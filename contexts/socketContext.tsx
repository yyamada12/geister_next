import { useEffect, useContext, createContext } from "react";
import io from "socket.io-client";
import { usePlayer, useSetPlayer } from "./playerContext";
import { useBoard, useDispatchBoard, ActionType } from "./boardContext";
import { useSetGame } from "./gameContext";
import Cood from "../classes/cood";

const SocketActionContext = createContext(undefined);

let socket: SocketIOClient.Socket;

export const SocketProvider: React.FC = ({ children }): JSX.Element => {
  const { setId, setOpponentName } = useSetPlayer();
  const { id, playerName } = usePlayer();

  const {
    opponentPrepareDone,
    setIsPlayerTurn,
    setIsPlayerWin,
    setFactorGhost,
  } = useSetGame();

  const boardState = useBoard();
  const boardDispatch = useDispatchBoard();

  useEffect(() => {
    socket = io();
    socket.emit("uuid", id);

    console.log(socket.io.uri);

    socket.on("assignId", (newId: string) => {
      setId(newId);
    });

    socket.on("opponent", (name: string, turn: boolean) => {
      setOpponentName(name);
      setIsPlayerTurn(turn);
    });

    socket.on("move", (from, to) => {
      boardDispatch({
        type: ActionType.OPPONENT_MOVE,
        payload: {
          from: new Cood(from.x, from.y),
          to: new Cood(to.x, to.y),
        },
      });
    });

    socket.on("opponentTurnEnd", () => {
      judgeWinnerAtOpponentAction();
      setIsPlayerTurn(true);
    });

    socket.on("opponentPrepareDone", () => {
      opponentPrepareDone();
    });
  }, []);

  const enter = () => {
    socket.emit("enter", playerName, id);
  };

  const emitMove = (from: Cood, to: Cood) => {
    socket.emit("move", from, to, id);
  };

  const emitPrepareDone = () => {
    socket.emit("playerPrepareDone", id);
  };

  const emitTurnEnd = () => {
    socket.emit("playerTurnEnd", id);
  };

  const judgeWinnerAtOpponentAction = () => {
    if (boardState.opponentSideGhosts[0] === -1) {
      // take 4 black ghosts
      setIsPlayerWin(true);
    } else if (boardState.opponentSideGhosts[1] === -1) {
      // take 4 white ghosts
      setIsPlayerWin(false);
    } else if (isPlayerGhostAtLeftGoal()) {
      // player's white ghost arrived at the left side goal
      setIsPlayerWin(true);
      setFactorGhost(new Cood(0, 0));
    } else if (isPlayerGhostAtRightGoal()) {
      // player's white ghost arrived at the right side goal
      setIsPlayerWin(true);
      setFactorGhost(new Cood(0, 5));
    }
  };

  const isPlayerGhostAtLeftGoal = () => {
    const goal = boardState.mainBoard[0][0].ghost;
    return goal && goal.isWhite && goal.ofPlayer;
  };

  const isPlayerGhostAtRightGoal = () => {
    const goal = boardState.mainBoard[0][5].ghost;
    return goal && goal.isWhite && goal.ofPlayer;
  };

  return (
    <SocketActionContext.Provider
      value={{ enter, emitMove, emitPrepareDone, emitTurnEnd }}
    >
      {children}
    </SocketActionContext.Provider>
  );
};

export const useSocketAction = () => useContext(SocketActionContext);
