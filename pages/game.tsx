import React from "react";
import Board from "../components/board";
import { useGame, useSetGame } from "../contexts/gameContext";
import { useSocketAction } from "../contexts/socketContext";
import Header from "../components/header";

import styles from "../css_modules/game.module.css";

const Game: React.FC = () => {
  const {
    isPlayerInPreparation,
    isOpponentInPreparation,
    isPlayerTurn,
    isPlayerWin,
  } = useGame();
  const { playerPrepareDone } = useSetGame();
  const { emitPrepareDone } = useSocketAction();

  let status: string;
  if (isPlayerInPreparation) {
    status = "おばけの配置を決定してください";
  } else if (isOpponentInPreparation) {
    status = "対戦相手が準備中です…";
  } else if (typeof isPlayerWin === "undefined") {
    status = isPlayerTurn ? "あなたのターンです" : "相手のターンです";
  } else {
    status = isPlayerWin ? "あなたの勝ちです！！！" : "あなたの負けです‥";
  }

  return (
    <React.Fragment>
      <Header />
      <div className={styles.main}>
        <p>{status}</p>
        <Board />
        <br />
        {isPlayerInPreparation && (
          <button
            onClick={() => {
              playerPrepareDone();
              emitPrepareDone();
            }}
          >
            準備完了
          </button>
        )}
      </div>
    </React.Fragment>
  );
};

export default Game;
