import React from "react";
import styles from "../css_modules/square.module.css";
import Ghost from "../classes//ghost";

import classNames from "classnames";

type BoardType = "MAIN_BOARD" | "PLAYER_SIDE_BOARD" | "OPPONENT_SIDE_BOARD";

type TSquareProps = {
  ghost: Ghost;
  board: BoardType;
  onClick?: () => void;
  isFirstClicked?: boolean;
  isClickable?: boolean;
  isGoal?: boolean;
};

const whiteGhost = (reversed: boolean, isFirstClicked: boolean) => (
  <img
    src="/images/white_ghost.png"
    alt="White Ghost"
    className={classNames(styles.ghost, {
      [styles.reversed]: reversed,
      [styles.firstClicked]: isFirstClicked,
    })}
  />
);

const blackGhost = (reversed: boolean, isFirstClicked: boolean) => (
  <img
    src="/images/black_ghost.png"
    alt="Black Ghost"
    className={classNames(styles.ghost, {
      [styles.reversed]: reversed,
      [styles.firstClicked]: isFirstClicked,
    })}
  />
);

const hiddenGhost = (
  <img
    src="/images/hidden_ghost.png"
    alt="Hidden Ghost"
    className={styles.ghost}
  />
);

const loadGhostImage = (
  ghost: Ghost,
  board: BoardType,
  isFirstClicked: boolean
) => {
  if (!ghost) {
    return;
  }
  switch (board) {
    case "MAIN_BOARD":
      return ghost.ofPlayer
        ? ghost.isWhite
          ? whiteGhost(false, isFirstClicked)
          : blackGhost(false, isFirstClicked)
        : hiddenGhost;
    case "PLAYER_SIDE_BOARD":
      return ghost.isWhite
        ? whiteGhost(false, false)
        : blackGhost(false, false);
    case "OPPONENT_SIDE_BOARD":
      return ghost.isWhite ? whiteGhost(true, false) : blackGhost(true, false);
  }
};

const Square: React.FC<TSquareProps> = (props) => {
  const ghostImage = loadGhostImage(
    props.ghost,
    props.board,
    props.isFirstClicked
  );

  return (
    <button
      className={classNames(styles.square, {
        [styles.clickable]: props.isClickable,
        [styles.goal]: props.isGoal,
      })}
      onClick={props.onClick}
    >
      {ghostImage}
    </button>
  );
};

export default Square;
