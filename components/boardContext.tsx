import {
  useState,
  useEffect,
  useContext,
  createContext,
  useReducer,
} from "react";
import Ghost from "./ghost";
import Cood from "./cood";

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
};

const BoardStateContext = createContext(defaultState);
const BoardDispatchContext = createContext(undefined);

const reducer = (state, action) => {
  switch (action.type) {
    case "MOVE":
      let mainBoard = state.mainBoard;
      const from: Cood = action.payload.from;
      const to: Cood = action.payload.to;

      [mainBoard[from.x][from.y], mainBoard[to.x][to.y]] = [
        mainBoard[to.x][to.y],
        mainBoard[from.x][from.y],
      ];
      return {
        ...state,
        mainBoard,
      };
    case "SET":
      return action.payload.state;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
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
