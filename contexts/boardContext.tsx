import {
  useState,
  useEffect,
  useContext,
  createContext,
  useReducer,
  Dispatch,
} from "react";

import { GHOST_NUM } from "../consts";
import Cood from "../classes//cood";

type TGhost = { ofPlayer: boolean; isWhite: boolean };
type TSquare = { ghost: undefined | TGhost };
type TBoard = Array<Array<TSquare>>;
type TCood = { x: number; y: number };
type TState = {
  mainBoard: TBoard;
  playerSideBoard: TBoard;
  opponentSideBoard: TBoard;
  playerSideGhosts: Array<number>;
  opponentSideGhosts: Array<number>;
};
type TAction = {
  type: ActionType;
  payload: {
    from?: Cood;
    to?: Cood;
    state?: TState;
  };
};

export enum ActionType {
  PLAYER_MOVE = "PLAYER_MOVE",
  OPPONENT_MOVE = "OPPONENT_MOVE",
  SET = "SET",
}

const NOMAL: TSquare = { ghost: undefined };

const OP_BL: TSquare = { ghost: { ofPlayer: false, isWhite: false } };
const OP_WH: TSquare = { ghost: { ofPlayer: false, isWhite: true } };
const PL_WH: TSquare = { ghost: { ofPlayer: true, isWhite: true } };
const PL_BL: TSquare = { ghost: { ofPlayer: true, isWhite: false } };

const defaultState: TState = {
  mainBoard: [
    [NOMAL, OP_BL, OP_BL, OP_BL, OP_BL, NOMAL],
    [NOMAL, OP_WH, OP_WH, OP_WH, OP_WH, NOMAL],
    [NOMAL, NOMAL, NOMAL, NOMAL, NOMAL, NOMAL],
    [NOMAL, NOMAL, NOMAL, NOMAL, NOMAL, NOMAL],
    [NOMAL, PL_WH, PL_WH, PL_WH, PL_WH, NOMAL],
    [NOMAL, PL_BL, PL_BL, PL_BL, PL_BL, NOMAL],
  ],
  playerSideBoard: [
    [NOMAL, NOMAL, NOMAL, NOMAL],
    [NOMAL, NOMAL, NOMAL, NOMAL],
  ],
  opponentSideBoard: [
    [NOMAL, NOMAL, NOMAL, NOMAL],
    [NOMAL, NOMAL, NOMAL, NOMAL],
  ],
  playerSideGhosts: [0, 0],
  opponentSideGhosts: [GHOST_NUM - 1, GHOST_NUM - 1],
};

const BoardStateContext = createContext<TState>(defaultState);
const BoardDispatchContext = createContext<Dispatch<TAction>>(undefined);

const reducer: React.Reducer<TState, TAction> = (state, action) => {
  switch (action.type) {
    case ActionType.PLAYER_MOVE:
      const { mainBoard, playerSideBoard, playerSideGhosts } = handlePlayerMove(
        state,
        action.payload.to,
        action.payload.from
      );
      return {
        ...state,
        mainBoard,
        playerSideBoard,
        playerSideGhosts,
      };
    case ActionType.OPPONENT_MOVE:
      const opponentState = handleOpponentMove(
        state,
        action.payload.to,
        action.payload.from
      );
      return {
        ...state,
        ...opponentState,
      };
    case ActionType.SET:
      return action.payload.state;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

const handlePlayerMove = (
  { mainBoard, playerSideBoard, playerSideGhosts },
  from: Cood,
  to: Cood
) => {
  const targetGhost = mainBoard[to.x][to.y].ghost;
  if (targetGhost && !targetGhost.ofPlayer) {
    const targetColor = targetGhost.isWhite ? 0 : 1;
    swap(
      to,
      mainBoard,
      {
        x: targetColor,
        y: playerSideGhosts[targetColor],
      },
      playerSideBoard
    );
    playerSideGhosts[targetColor] += 1;
  }
  swap(from, mainBoard, to, mainBoard);
  return { mainBoard, playerSideBoard, playerSideGhosts };
};

const handleOpponentMove = (
  { mainBoard, opponentSideBoard, opponentSideGhosts }: TState,
  from: Cood,
  to: Cood
) => {
  from = from.reversed();
  to = to.reversed();
  const targetGhost = mainBoard[to.x][to.y].ghost;
  if (targetGhost && targetGhost.ofPlayer) {
    const targetColor = targetGhost.isWhite ? 1 : 0;
    swap(
      to,
      mainBoard,
      {
        x: targetColor,
        y: opponentSideGhosts[targetColor],
      },
      opponentSideBoard
    );
    opponentSideGhosts[targetColor] -= 1;
  }
  swap(from, mainBoard, to, mainBoard);
  return { mainBoard, opponentSideBoard, opponentSideGhosts };
};

const swap = (from: TCood, fromBoard: TBoard, to: TCood, toBoard: TBoard) => {
  [fromBoard[from.x][from.y], toBoard[to.x][to.y]] = [
    toBoard[to.x][to.y],
    fromBoard[from.x][from.y],
  ];
};

export const BoardProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const [state, dispatch] = useReducer(reducer, defaultState);

  useEffect(() => {
    if (isInitialized) {
      sessionStorage.setItem("board", JSON.stringify(state));
    }
  }, [state]);

  useEffect(() => {
    const initialState: TState =
      JSON.parse(sessionStorage.getItem("board")) || defaultState;
    dispatch({ type: ActionType.SET, payload: { state: initialState } });
    setIsInitialized(true);
  }, []);

  return (
    <BoardDispatchContext.Provider value={dispatch}>
      <BoardStateContext.Provider value={state}>
        {children}
      </BoardStateContext.Provider>
    </BoardDispatchContext.Provider>
  );
};

export const useBoard = () => useContext(BoardStateContext);
export const useDispatchBoard = () => useContext(BoardDispatchContext);
