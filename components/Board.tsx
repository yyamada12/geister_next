import React, { useState } from "react";
import styles from "./board.module.css";
import Square from "./square";
import Cood from "./cood";

import { useBoard, useDispatchBoard } from "./boardContext";
import { useGame, useSetGame } from "./gameContext";
import { useSocketAction } from "../components/socketContext";

import { BOARD_SIZE, GHOST_NUM, GHOST_COLORS } from "../consts";

const Board: React.FC = () => {
  const boardState = useBoard();
  const boardDispatch = useDispatchBoard();

  const {
    isPlayerInPreparation,
    isOpponentInPreparation,
    isPlayerTurn,
  } = useGame();
  const { setIsPlayerTurn } = useSetGame();

  const [firstClickedSquare, setFirstClickedSquare] = useState<
    Cood | undefined
  >(undefined);

  const { emitMove, emitTurnEnd } = useSocketAction();

  const handleFirstClick = (fc: Cood) => {
    setFirstClickedSquare(fc);
  };

  const handleSecondClick = (sc: Cood) => {
    const fc = firstClickedSquare;

    emitMove(fc, sc);
    boardDispatch({ type: "PLAYER_MOVE", payload: { from: fc, to: sc } });

    setFirstClickedSquare(undefined);
  };

  const turnEnd = () => {
    emitTurnEnd();
    setIsPlayerTurn(false);
  };

  const renderMainBoardRow = (i: number) => {
    const rows = [];

    for (let j = 0; j < BOARD_SIZE; j++) {
      const squareCood = new Cood(i, j);
      let onClick: () => void;

      const crtSquare = boardState.mainBoard[i][j];

      if (isPlayerInPreparation) {
        // only player's ghosts are clickable
        if (crtSquare.ghost && crtSquare.ghost.ofPlayer) {
          onClick = !firstClickedSquare
            ? () => handleFirstClick(squareCood) // first click
            : () => handleSecondClick(squareCood); // second click
        }
      } else if (!isOpponentInPreparation && isPlayerTurn) {
        // first click
        if (!firstClickedSquare) {
          // only player's ghosts are clickable
          if (crtSquare.ghost && crtSquare.ghost.ofPlayer) {
            onClick = () => handleFirstClick(squareCood);
          }
          // second click
        } else {
          // only squares adjacent to firstClickedSquare are clickable
          if (firstClickedSquare.isAdjacent(squareCood)) {
            onClick = () => {
              handleSecondClick(squareCood);
              turnEnd();
            };
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

    for (let j = 0; j < GHOST_NUM; j++) {
      const ghost = isPlayer
        ? boardState.playerSideBoard[i][j].ghost
        : boardState.opponentSideBoard[i][j].ghost;
      rows.push(<Square key={GHOST_NUM * i + j} ghost={ghost} />);
    }
    return (
      <div className="board-row" key={i}>
        {rows}
      </div>
    );
  };

  const renderSideBoard = (isPlayer: boolean) => {
    const board = [];
    for (let i = 0; i < GHOST_COLORS; i++) {
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
