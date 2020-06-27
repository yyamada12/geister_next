import React, { useEffect } from "react";
import Link from "next/link";

import { usePlayer } from "../components/playerContext";
import { useSocketAction } from "../components/socketContext";

export default function Lobby() {
  const { id, playerName, opponentName } = usePlayer();
  const enter = useSocketAction();
  useEffect(() => enter(playerName, id), []);
  return (
    <div>
      <p>
        {opponentName
          ? opponentName + "とマッチしました！"
          : "対戦相手を探しています ..."}
      </p>
      {opponentName && (
        <Link href="/game">
          <button>ゲーム開始</button>
        </Link>
      )}
    </div>
  );
}
