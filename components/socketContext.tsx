import { useEffect, useContext, createContext } from "react";
import io from "socket.io-client";
import { usePlayer, useSetPlayer } from "./playerContext";
import Cood from "./cood";

const SocketActionContext = createContext(undefined);

let socket: SocketIOClient.Socket;

export const SocketProvider: React.FC = ({ children }): JSX.Element => {
  const { setId, setOpponentName } = useSetPlayer();
  const { id, playerName } = usePlayer();

  useEffect(() => {
    socket = io("localhost:8080");
    socket.on("uuid", (id) => {
      console.log(id);
      setId(id);
    });
    socket.on("opponent", (name) => {
      console.log(name);
      setOpponentName(name);
    });
  }, []);

  const enter = () => {
    socket.emit("enter", playerName, id);
  };

  const move = (from: Cood, to: Cood) => {
    socket.emit("move", from, to, id);
  };

  return (
    <SocketActionContext.Provider value={{ enter, move }}>
      {children}
    </SocketActionContext.Provider>
  );
};

export const useSocketAction = () => useContext(SocketActionContext);
