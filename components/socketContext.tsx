import { useEffect, useContext, createContext } from "react";
import io from "socket.io-client";
import { usePlayer, useSetPlayer } from "./playerContext";
import { useDispatchBoard } from "./boardContext";
import { useSetGame } from "./gameContext";
import Cood from "./cood";

const SocketActionContext = createContext(undefined);

let socket: SocketIOClient.Socket;

export const SocketProvider: React.FC = ({ children }): JSX.Element => {
  const { setId, setOpponentName } = useSetPlayer();
  const { id, playerName } = usePlayer();
  const { opponentPrepareDone } = useSetGame();
  const boardDispatch = useDispatchBoard();

  useEffect(() => {
    socket = io("localhost:8080");
    socket.emit("uuid", id);
    socket.on("assignId", (id) => {
      console.log(id);
      setId(id);
    });
    socket.on("opponent", (name) => {
      console.log(name);
      setOpponentName(name);
    });
    socket.on("move", (from, to) => {
      console.log("opponent moved");
      console.log(from, to);
      boardDispatch({
        type: "OPPONENT_MOVE",
        payload: {
          from: new Cood(from.x, from.y),
          to: new Cood(to.x, to.y),
        },
      });
    });

    socket.on("opponentPrepareDone", () => {
      console.log("opponent prepare done");
      opponentPrepareDone();
    });
  }, []);

  const enter = () => {
    socket.emit("enter", playerName, id);
  };

  const move = (from: Cood, to: Cood) => {
    console.log(from, to);
    socket.emit("move", from, to, id);
  };

  const emitPrepareDone = () => {
    socket.emit("playerPrepareDone", id);
  };

  return (
    <SocketActionContext.Provider value={{ enter, move, emitPrepareDone }}>
      {children}
    </SocketActionContext.Provider>
  );
};

export const useSocketAction = () => useContext(SocketActionContext);
