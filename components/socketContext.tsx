import { useState, useEffect, useContext, createContext } from "react";
import io from "socket.io-client";
import { useSetPlayer } from "./playerContext";

const SocketActionContext = createContext((playerName: string) => {});

let socket: SocketIOClient.Socket;

export const SocketProvider: React.FC = ({ children }): JSX.Element => {
  const { setId, setOpponentName } = useSetPlayer();

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

  const enter = (playerName) => {
    socket.emit("enter", playerName);
  };

  return (
    <SocketActionContext.Provider value={enter}>
      {children}
    </SocketActionContext.Provider>
  );
};

export const useSocketAction = () => useContext(SocketActionContext);
