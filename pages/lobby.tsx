import React, { useEffect } from "react";
import Link from "next/link";

import { usePlayer } from "../contexts/playerContext";
import { useSocketAction } from "../contexts/socketContext";

import styles from "../css_modules/lobby.module.css";
import { Button } from "@material-ui/core";
import Header from "../components/header";

const Lobby: React.FC = () => {
  const { opponentName } = usePlayer();
  const { enter } = useSocketAction();
  useEffect(() => enter(), []);
  return (
    <div className={styles.main}>
      <Header />
      <p>
        {opponentName
          ? opponentName + "とマッチしました！"
          : "対戦相手を探しています ..."}
      </p>
      <br />
      {opponentName && (
        <Link href="/game">
          <Button variant="contained" color="primary">
            ゲーム開始
          </Button>
        </Link>
      )}
    </div>
  );
};

export default Lobby;
