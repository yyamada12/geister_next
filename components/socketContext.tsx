import { useEffect, useContext, createContext } from "react";
import io from "socket.io-client";
import { usePlayer, useSetPlayer } from "./playerContext";
import { useDispatchBoard } from "./boardContext";
import { useGame, useSetGame } from "./gameContext";
import Cood from "./cood";

const SocketActionContext = createContext(undefined);

let socket: SocketIOClient.Socket;

export const SocketProvider: React.FC = ({ children }): JSX.Element => {
  const { setId, setOpponentName } = useSetPlayer();
  const { id, playerName } = usePlayer();

  const { isOpponentInPreparation } = useGame();
  const { opponentPrepareDone, setIsPlayerTurn } = useSetGame();

  const boardDispatch = useDispatchBoard();

  useEffect(() => {
    socket = io("localhost:8080");
    socket.emit("uuid", id);

    socket.on("assignId", (id) => {
      setId(id);
    });

    socket.on("opponent", (name: string, turn: boolean) => {
      setOpponentName(name);
      setIsPlayerTurn(turn);
    });

    socket.on("move", (from, to) => {
      boardDispatch({
        type: "OPPONENT_MOVE",
        payload: {
          from: new Cood(from.x, from.y),
          to: new Cood(to.x, to.y),
        },
      });
    });

    socket.on("opponentTurnEnd", () => {
      console.log("opponent turn end");
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
    console.log(from, to);
    socket.emit("move", from, to, id);
  };

  const emitPrepareDone = () => {
    socket.emit("playerPrepareDone", id);
  };

  const emitTurnEnd = () => {
    socket.emit("playerTurnEnd", id);
    console.log("player turn end");
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
