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
  const { setIsPlayerTurn, setIsPlayerWin } = useSetGame();

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
    judgeWinnerAtPlayerAction();
  };

  const judgeWinnerAtPlayerAction = () => {
    if (boardState.playerSideGhosts[0] == GHOST_NUM) {
      // take 4 white ghosts
      setIsPlayerWin(true);
    } else if (boardState.playerSideGhosts[1] == GHOST_NUM) {
      // take 4 black ghosts
      setIsPlayerWin(false);
    } else if (isOpponentGhostAtGoal()) {
      // opponent white ghost arrived at the goal
      setIsPlayerWin(false);
    }
  };

  const isOpponentGhostAtGoal = () => {
    const g1 = boardState.mainBoard[5][0].ghost;
    const g2 = boardState.mainBoard[5][5].ghost;
    return (
      (g1 && g1.isWhite && !g1.ofPlayer) || (g2 && g2.isWhite && !g2.ofPlayer)
    );
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

      const isGoal = [
        new Cood(0, 0),
        new Cood(0, 5),
        new Cood(5, 0),
        new Cood(5, 5),
      ].some((cood) => cood.equals(squareCood));

      rows.push(
        <Square
          key={BOARD_SIZE * i + j}
          board="MAIN_BOARD"
          ghost={boardState.mainBoard[i][j].ghost}
          onClick={onClick}
          isFirstClicked={squareCood.equals(firstClickedSquare)}
          isGoal={isGoal}
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

  const renderSideBoardRow = (i: number, ofPlayer: boolean) => {
    const rows = [];

    for (let j = 0; j < GHOST_NUM; j++) {
      const ghost = ofPlayer
        ? boardState.playerSideBoard[i][j].ghost
        : boardState.opponentSideBoard[i][j].ghost;
      rows.push(
        <Square
          key={GHOST_NUM * i + j}
          board={ofPlayer ? "PLAYER_SIDE_BOARD" : "OPPONENT_SIDE_BOARD"}
          ghost={ghost}
        />
      );
    }
    return (
      <div className="board-row" key={i}>
        {rows}
      </div>
    );
  };

  const renderSideBoard = (ofPlayer: boolean) => {
    const board = [];
    for (let i = 0; i < GHOST_COLORS; i++) {
      board.push(renderSideBoardRow(i, ofPlayer));
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
