import React from "react";
import styles from "../css_modules/square.module.css";

import classNames from "classnames";
import { TGhost } from "../contexts/boardContext";

type BoardType = "MAIN_BOARD" | "PLAYER_SIDE_BOARD" | "OPPONENT_SIDE_BOARD";

type TSquareProps = {
  ghost: TGhost;
  board: BoardType;
  onClick?: () => void;
  isFirstClicked?: boolean;
  isClickable?: boolean;
  isGoal?: boolean;
  isButtleEnd?: boolean;
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
  ghost: TGhost,
  board: BoardType,
  isFirstClicked: boolean,
  isButtleEnd: boolean
) => {
  if (!ghost) {
    return;
  }
  switch (board) {
    case "MAIN_BOARD":
      if (isButtleEnd) {
        return ghost.isWhite
          ? whiteGhost(!ghost.ofPlayer, isFirstClicked, isFactorGhost)
          : blackGhost(!ghost.ofPlayer, isFirstClicked, isFactorGhost);
      } else {
        return ghost.ofPlayer
          ? ghost.isWhite
            ? whiteGhost(false, isFirstClicked, isFactorGhost)
            : blackGhost(false, isFirstClicked, isFactorGhost)
          : hiddenGhost;
      }
    case "PLAYER_SIDE_BOARD":
      return ghost.isWhite
        ? whiteGhost(false, false, isFactorGhost)
        : blackGhost(false, false, isFactorGhost);
    case "OPPONENT_SIDE_BOARD":
      return ghost.isWhite
        ? whiteGhost(true, false, isFactorGhost)
        : blackGhost(true, false, isFactorGhost);
  }
};

const Square: React.FC<TSquareProps> = (props) => {
  const ghostImage = loadGhostImage(
    props.ghost,
    props.board,
    props.isFirstClicked,
    props.isButtleEnd
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
