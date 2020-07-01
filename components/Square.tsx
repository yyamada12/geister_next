import React from "react";
import styles from "./square.module.css";
import Ghost from "./ghost";

import classNames from "classnames";

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
    className={classNames(styles.ghost, { [styles.reversed]: reversed })}
  />
);

const blackGhost = (reversed: boolean) => (
  <img
    src="/images/black_ghost.svg"
    alt="Black Ghost"
    className={classNames(styles.ghost, { [styles.reversed]: reversed })}
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
      className={classNames(styles.square, {
        [styles.firstClicked]: props.isFirstClicked,
        [styles.clickable]: !props.isFirstClicked && props.onClick,
      })}
      onClick={props.onClick}
    >
      {ghostImage}
    </button>
  );
}
