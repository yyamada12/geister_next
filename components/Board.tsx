import React, { useState } from "react";
import styles from "./board.module.css";
import Square from "./square";
import Cood from "./cood";

import { useBoard, useDispatchBoard } from "./boardContext";
import { useGame } from "./gameContext";
import { useSocketAction } from "../components/socketContext";

import { BOARD_SIZE, SIDE_BOARD_COLS, SIDE_BOARD_ROWS } from "../consts";

const Board: React.FC = () => {
  const boardState = useBoard();
  const boardDispatch = useDispatchBoard();
  const { isPlayerInPreparation, isOpponentInPreparation } = useGame();
  const [firstClickedSquare, setFirstClickedSquare] = useState(undefined);

  const { move } = useSocketAction();

  const handleFirstClick = (c: Cood) => {
    setFirstClickedSquare(c);
  };

  const handleSecondClick = (sc: Cood) => {
    const fc = firstClickedSquare;
    // emit move to opponent
    move(fc, sc);
    // change state
    boardDispatch({ type: "PLAYER_MOVE", payload: { from: fc, to: sc } });

    setFirstClickedSquare(undefined);
  };

  const renderMainBoardRow = (i: number) => {
    const rows = [];

    for (let j = 0; j < BOARD_SIZE; j++) {
      const squareCood = new Cood(i, j);
      let onClick = () => {};
      // handle first click
      if (!firstClickedSquare) {
        // only player's ghosts are clickable
        if (
          boardState.mainBoard[i][j].ghost &&
          boardState.mainBoard[i][j].ghost.ofPlayer
        )
          onClick = () => handleFirstClick(squareCood);

        // handle second click
      } else {
        // in preparation
        if (isPlayerInPreparation) {
          // only player's ghosts are clickable
          if (
            boardState.mainBoard[i][j].ghost &&
            boardState.mainBoard[i][j].ghost.ofPlayer
          ) {
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
          key={BOARD_SIZE * i + j}
          ghost={boardState.mainBoard[i][j].ghost}
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
    for (let i = 0; i < BOARD_SIZE; i++) {
      board.push(renderMainBoardRow(i));
    }
    return board;
  };

  const renderSideBoardRow = (i: number, isPlayer: boolean) => {
    const rows = [];

    for (let j = 0; j < SIDE_BOARD_COLS; j++) {
      const ghost = isPlayer
        ? boardState.playerSideBoard[i][j].ghost
        : boardState.opponentSideBoard[i][j].ghost;
      rows.push(<Square key={SIDE_BOARD_COLS * i + j} ghost={ghost} />);
    }
    return (
      <div className="board-row" key={i}>
        {rows}
      </div>
    );
  };

  const renderSideBoard = (isPlayer: boolean) => {
    const board = [];
    for (let i = 0; i < SIDE_BOARD_ROWS; i++) {
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
