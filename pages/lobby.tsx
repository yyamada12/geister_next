import React, { useContext, useState } from "react";
import io from "socket.io-client";
import PlayerContext from "../components/player";

export default function Lobby() {
  const { player } = useContext(PlayerContext);
  let [opposite, setOpposite] = useState("");
  let [id, setId] = useState("");

  let socket = io("localhost:8080");
  socket.on("uuid", (id) => {
    console.log(id);
    setId(id);
  });
  socket.on("opposite", (name) => {
    console.log(name);
    setOpposite(name);
  });
  const enter = () => {
    socket.emit("enter", player);
  };
  return (
    <div>
      <p>Welcome {player}</p>
      <p> {opposite ? "Opposite is " + opposite : "Waiting opposite..."}</p>
      <button onClick={enter}>enter</button>
    </div>
  );
}
