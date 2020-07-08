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

  const { opponentPrepareDone, setIsPlayerTurn, setIsPlayerWin } = useSetGame();

  const boardState = useBoard();
  const boardDispatch = useDispatchBoard();

  useEffect(() => {
    socket = io(":8080");
    socket.emit("uuid", id);

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
    if (boardState.opponentSideGhosts[0] == 0) {
      // take 4 black ghosts
      setIsPlayerWin(true);
    } else if (boardState.opponentSideGhosts[1] == 0) {
      // take 4 white ghosts
      setIsPlayerWin(false);
    } else if (isPlayerGhostAtGoal()) {
      // player's white ghost arrived at the goal
      setIsPlayerWin(true);
    }
  };

  const isPlayerGhostAtGoal = () => {
    const g1 = boardState.mainBoard[0][0].ghost;
    const g2 = boardState.mainBoard[0][5].ghost;
    return (
      (g1 && g1.isWhite && g1.ofPlayer) || (g2 && g2.isWhite && g2.ofPlayer)
    );
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
