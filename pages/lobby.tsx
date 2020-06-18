import React, { useContext } from "react";
import PlayerContext from "../components/player";

export default function Lobby() {
  const { player } = useContext(PlayerContext);
  return <div>Welcome {player} </div>;
}
