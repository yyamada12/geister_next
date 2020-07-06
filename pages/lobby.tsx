import React, { useEffect } from "react";
import Link from "next/link";

import { usePlayer } from "../contexts/playerContext";
import { useSocketAction } from "../contexts/socketContext";

export default function Lobby() {
  const { opponentName } = usePlayer();
  const { enter } = useSocketAction();
  useEffect(() => enter(), []);
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
