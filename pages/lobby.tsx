import React, { useEffect } from "react";
import Link from "next/link";

import { usePlayer } from "../contexts/playerContext";
import { useSocketAction } from "../contexts/socketContext";

import styles from "../css_modules/lobby.module.css";

const Lobby: React.FC = () => {
  const { opponentName } = usePlayer();
  const { enter } = useSocketAction();
  useEffect(() => enter(), []);
  return (
    <div className={styles.main}>
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
};

export default Lobby;
