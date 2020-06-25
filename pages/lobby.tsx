import React from "react";
import io from "socket.io-client";
import { usePlayer, useSetPlayer } from "../components/playerContext";

export default function Lobby() {
  const { playerName, opponentName } = usePlayer();
  const { setId, setOpponentName } = useSetPlayer();

  let socket = io("localhost:8080");
  socket.on("uuid", (id) => {
    console.log(id);
    setId(id);
  });
  socket.on("opponent", (name) => {
    console.log(name);
    setOpponentName(name);
  });
  const enter = () => {
    socket.emit("enter", playerName);
  };
  return (
    <div>
      <p>Welcome {playerName}</p>
      <p>
        {opponentName ? "Opponent is " + opponentName : "Waiting opponent..."}
      </p>
      <button onClick={enter}>enter</button>
    </div>
  );
}
