import React from "react";
import Board from "../components/board";
import { useGame, useSetGame } from "../components/gameContext";
import { useSocketAction } from "../components/socketContext";

const Game: React.FC = () => {
  const { isPlayerInPreparation, isOpponentInPreparation } = useGame();
  const { playerPrepareDone } = useSetGame();
  const { emitPrepareDone } = useSocketAction();

  const status = isPlayerInPreparation
    ? "おばけの配置を決定してください"
    : isOpponentInPreparation
    ? "対戦相手が準備中です…"
    : "ゲーム開始";
  return (
    <div>
      <p>{status}</p>
      <Board />
      <br />
      <button
        onClick={() => {
          playerPrepareDone();
          emitPrepareDone();
        }}
      >
        準備完了
      </button>
    </div>
  );
};

export default Game;
