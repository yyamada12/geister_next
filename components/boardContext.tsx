import {
  useState,
  useEffect,
  useContext,
  createContext,
  useReducer,
} from "react";

import Ghost from "./ghost";

import { GHOST_NUM } from "../consts";

const NOMAL = () => {
  return { ghost: undefined };
};
const OP_BL = () => {
  return { ghost: new Ghost(0, false, false) };
};
const OP_WH = () => {
  return { ghost: new Ghost(0, false, true) };
};
const PL_WH = () => {
  return { ghost: new Ghost(0, true, true) };
};
const PL_BL = () => {
  return { ghost: new Ghost(0, true, false) };
};

const defaultState = {
  mainBoard: [
    [NOMAL(), OP_BL(), OP_BL(), OP_BL(), OP_BL(), NOMAL()],
    [NOMAL(), OP_WH(), OP_WH(), OP_WH(), OP_WH(), NOMAL()],
    [NOMAL(), NOMAL(), NOMAL(), NOMAL(), NOMAL(), NOMAL()],
    [NOMAL(), NOMAL(), NOMAL(), NOMAL(), NOMAL(), NOMAL()],
    [NOMAL(), PL_WH(), PL_WH(), PL_WH(), PL_WH(), NOMAL()],
    [NOMAL(), PL_BL(), PL_BL(), PL_BL(), PL_BL(), NOMAL()],
  ],
  playerSideBoard: [
    [NOMAL(), NOMAL(), NOMAL(), NOMAL()],
    [NOMAL(), NOMAL(), NOMAL(), NOMAL()],
  ],
  opponentSideBoard: [
    [NOMAL(), NOMAL(), NOMAL(), NOMAL()],
    [NOMAL(), NOMAL(), NOMAL(), NOMAL()],
  ],
  playerSideGhosts: [0, 0],
  opponentSideGhosts: [GHOST_NUM - 1, GHOST_NUM - 1],
};

const BoardStateContext = createContext(defaultState);
const BoardDispatchContext = createContext(undefined);

const reducer = (state, action) => {
  switch (action.type) {
    case "PLAYER_MOVE":
      const { mainBoard, playerSideBoard, playerSideGhosts } = handlePlayerMove(
        state,
        action.payload
      );
      return {
        ...state,
        mainBoard,
        playerSideBoard,
        playerSideGhosts,
      };
    case "OPPONENT_MOVE":
      const opponentState = handleOpponentMove(state, action.payload);
      return {
        ...state,
        ...opponentState,
      };
    case "SET":
      return action.payload.state;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

const handlePlayerMove = (
  { mainBoard, playerSideBoard, playerSideGhosts },
  { from, to }
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
  { mainBoard, opponentSideBoard, opponentSideGhosts },
  { from, to }
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

const swap = (from, fromBoard, to, toBoard) => {
  [fromBoard[from.x][from.y], toBoard[to.x][to.y]] = [
    toBoard[to.x][to.y],
    fromBoard[from.x][from.y],
  ];
};

export const BoardProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  const [state, dispatch] = useReducer(reducer, defaultState);

  useEffect(() => {
    if (isInitialized) {
      sessionStorage.setItem("board", JSON.stringify(state));
    }
  }, [state]);

  useEffect(() => {
    const initialState =
      JSON.parse(sessionStorage.getItem("board")) || defaultState;
    dispatch({ type: "SET", payload: { state: initialState } });
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
