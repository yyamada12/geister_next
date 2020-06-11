import React from "react";
import styles from "./square.module.css";
import Ghost from "./Ghost";
import Cood from "./Cood";

interface SquarePropsInterface {
  ghost: Ghost;
  cood: Cood;
  onClick: (c: Cood) => void;
  isFirstClicked: boolean;
}

const whiteGhost = (
  <img
    src="/images/white_ghost.svg"
    alt="White Ghost"
    className={styles.ghost}
  />
);

const blackGhost = (
  <img
    src="/images/black_ghost.svg"
    alt="Black Ghost"
    className={styles.ghost}
  />
);

const hiddenGhost = (
  <img
    src="/images/hidden_ghost.svg"
    alt="Hidden Ghost"
    className={styles.ghost}
  />
);

export default function Square(props: SquarePropsInterface) {
  const ghost = props.ghost;
  return (
    <button
      className={
        styles.square + " " + (props.isFirstClicked ? styles.firstClicked : "")
      }
      onClick={() => props.onClick(props.cood)}
    >
      {ghost &&
        (ghost.ofPlayer
          ? ghost.isWhite
            ? whiteGhost
            : blackGhost
          : hiddenGhost)}
    </button>
  );
}
