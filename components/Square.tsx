import React from "react";
import styles from "./square.module.css";
import Ghost from "./ghost";

type BoardType = "MAIN_BOARD" | "PLAYER_SIDE_BOARD" | "OPPONENT_SIDE_BOARD";

interface SquarePropsInterface {
  ghost: Ghost;
  board: BoardType;
  onClick?: () => void;
  isFirstClicked?: boolean;
}

const whiteGhost = (reversed: boolean) => (
  <img
    src="/images/white_ghost.svg"
    alt="White Ghost"
    className={styles.ghost + (reversed ? " " + styles.reversed : "")}
  />
);

const blackGhost = (reversed: boolean) => (
  <img
    src="/images/black_ghost.svg"
    alt="Black Ghost"
    className={styles.ghost + (reversed ? " " + styles.reversed : "")}
  />
);

const hiddenGhost = (
  <img
    src="/images/hidden_ghost.svg"
    alt="Hidden Ghost"
    className={styles.ghost}
  />
);

const loadGhostImage = (ghost: Ghost, board: BoardType) => {
  if (!ghost) {
    return;
  }
  switch (board) {
    case "MAIN_BOARD":
      return ghost.ofPlayer
        ? ghost.isWhite
          ? whiteGhost(false)
          : blackGhost(false)
        : hiddenGhost;
    case "PLAYER_SIDE_BOARD":
      return ghost.isWhite ? whiteGhost(false) : blackGhost(false);
    case "OPPONENT_SIDE_BOARD":
      return ghost.isWhite ? whiteGhost(true) : blackGhost(true);
  }
};

export default function Square(props: SquarePropsInterface) {
  const ghostImage = loadGhostImage(props.ghost, props.board);

  return (
    <button
      className={
        styles.square + " " + (props.isFirstClicked ? styles.firstClicked : "")
      }
      onClick={props.onClick}
    >
      {ghostImage}
    </button>
  );
}
