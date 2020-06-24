import React, { useContext, useState } from "react";
import io from "socket.io-client";
import PlayerContext from "../components/player";

export default function Lobby() {
  const { player } = useContext(PlayerContext);
  let [opponent, setOpponent] = useState("");
  let [id, setId] = useState("");

  let socket = io("localhost:8080");
  socket.on("uuid", (id) => {
    console.log(id);
    setId(id);
  });
  socket.on("opponent", (name) => {
    console.log(name);
    setOpponent(name);
  });
  const enter = () => {
    socket.emit("enter", player);
  };
  return (
    <div>
      <p>Welcome {player}</p>
      <p> {opponent ? "Opponent is " + opponent : "Waiting opponent..."}</p>
      <button onClick={enter}>enter</button>
    </div>
  );
}
