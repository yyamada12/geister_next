import React, { useState } from "react";
import styles from "./board.module.css";
import Square from "./square";
import Ghost from "./ghost";
import Cood from "./cood";

import { useSocketAction } from "../components/socketContext";

interface BoardPropsInterface {
  isPlayerInPreparation: boolean;
}

const NOMAL = () => {
  return { ghost: undefined };
};
const OP_BL = () => {
  return { ghost: new Ghost(0, false, false) };
};
const OP_WH = () => {
  return { ghost: new Ghost(0, false, true) };
};
const PL_WH = () => {
  return { ghost: new Ghost(0, true, true) };
};
const PL_BL = () => {
  return { ghost: new Ghost(0, true, false) };
};

const Board: React.FC<BoardPropsInterface> = ({ isPlayerInPreparation }) => {
  const [mainBoard, setMainBoard] = useState([
    [NOMAL(), OP_BL(), OP_BL(), OP_BL(), OP_BL(), NOMAL()],
    [NOMAL(), OP_WH(), OP_WH(), OP_WH(), OP_WH(), NOMAL()],
    [NOMAL(), NOMAL(), NOMAL(), NOMAL(), NOMAL(), NOMAL()],
    [NOMAL(), NOMAL(), NOMAL(), NOMAL(), NOMAL(), NOMAL()],
    [NOMAL(), PL_WH(), PL_WH(), PL_WH(), PL_WH(), NOMAL()],
    [NOMAL(), PL_BL(), PL_BL(), PL_BL(), PL_BL(), NOMAL()],
  ]);
  const [playerSideBoard, setPlayerSideBoard] = useState([
    [NOMAL(), NOMAL(), NOMAL(), NOMAL()],
    [NOMAL(), NOMAL(), NOMAL(), NOMAL()],
  ]);
  const [opponentSideBoard, setOpponentSideBoard] = useState([
    [NOMAL(), NOMAL(), NOMAL(), NOMAL()],
    [NOMAL(), NOMAL(), NOMAL(), NOMAL()],
  ]);
  const [firstClickedSquare, setFirstClickedSquare] = useState(undefined);

  const { move } = useSocketAction();

  const handleFirstClick = (c: Cood) => {
    setFirstClickedSquare(c);
  };

  const handleSecondClick = (sc: Cood) => {
    const fc = firstClickedSquare;
    let squares = mainBoard;
    move(fc, sc);

    [squares[sc.x][sc.y], squares[fc.x][fc.y]] = [
      squares[fc.x][fc.y],
      squares[sc.x][sc.y],
    ];
    setMainBoard(squares);
    setFirstClickedSquare(undefined);
  };
  const renderMainBoardRow = (i: number) => {
    const rows = [];

    for (let j = 0; j < 6; j++) {
      const squareCood = new Cood(i, j);
      let onClick = () => {};
      // handle first click
      if (!firstClickedSquare) {
        // only player's ghosts are clickable
        if (mainBoard[i][j].ghost && mainBoard[i][j].ghost.ofPlayer)
          onClick = () => handleFirstClick(squareCood);

        // handle second click
      } else {
        // in preparation
        if (isPlayerInPreparation) {
          // only player's ghosts are clickable
          if (mainBoard[i][j].ghost && mainBoard[i][j].ghost.ofPlayer) {
            onClick = () => handleSecondClick(squareCood);
          }

          // during buttle
        } else {
          // only squares adjacent to firstClickedSquare are clickable
          if (firstClickedSquare.isAdjacent(squareCood)) {
            onClick = () => handleSecondClick(squareCood);
          }
        }
      }

      rows.push(
        <Square
          key={6 * i + j}
          ghost={mainBoard[i][j].ghost}
          onClick={onClick}
          isFirstClicked={squareCood.equals(firstClickedSquare)}
        />
      );
    }
    return (
      <div className="board-row" key={i}>
        {rows}
      </div>
    );
  };

  const renderMainBoard = () => {
    const board = [];
    for (let i = 0; i < 6; i++) {
      board.push(renderMainBoardRow(i));
    }
    return board;
  };

  const renderSideBoardRow = (i: number, isPlayer: boolean) => {
    const rows = [];

    for (let j = 0; j < 4; j++) {
      const ghost = isPlayer
        ? playerSideBoard[i][j].ghost
        : opponentSideBoard[i][j].ghost;
      rows.push(<Square key={4 * i + j} ghost={ghost} />);
    }
    return (
      <div className="board-row" key={i}>
        {rows}
      </div>
    );
  };

  const renderSideBoard = (isPlayer: boolean) => {
    const board = [];
    for (let i = 0; i < 2; i++) {
      board.push(renderSideBoardRow(i, isPlayer));
    }
    return board;
  };

  return (
    <div className={styles.boardContainer}>
      <div className={styles.opponentSideBoard}>
        <div>{renderSideBoard(false)}</div>
      </div>
      <div className={styles.mainBoard}>
        <div>{renderMainBoard()}</div>
      </div>
      <div className={styles.playerSideBoard}>
        <div>{renderSideBoard(true)}</div>
      </div>
    </div>
  );
};

export default Board;
