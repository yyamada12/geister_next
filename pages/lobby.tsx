import React from "react";
import { usePlayer } from "../components/playerContext";
import { useSocketAction } from "../components/socketContext";

export default function Lobby() {
  const { playerName, opponentName } = usePlayer();
  const enter = useSocketAction();
  return (
    <div>
      <p>Welcome {playerName}</p>
      <p>
        {opponentName ? "Opponent is " + opponentName : "Waiting opponent..."}
      </p>
      <button onClick={() => enter(playerName)}>enter</button>
    </div>
  );
}
