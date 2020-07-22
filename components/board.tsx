import React, { useState, useEffect } from "react";
import styles from "../css_modules/board.module.css";
import Square from "./square";
import Cood from "../classes/cood";
import {
  useBoard,
  useDispatchBoard,
  ActionType,
} from "../contexts/boardContext";
import { useGame, useSetGame } from "../contexts/gameContext";
import { useSocketAction } from "../contexts/socketContext";
import { BOARD_SIZE, GHOST_NUM, GHOST_COLORS } from "../consts";

const Board: React.FC = () => {
  // -- Contexts --

  const boardState = useBoard();
  const boardDispatch = useDispatchBoard();

  const {
    isPlayerInPreparation,
    isOpponentInPreparation,
    isPlayerTurn,
    isPlayerWin,
  } = useGame();
  const { setIsPlayerTurn, setIsPlayerWin } = useSetGame();

  const { emitMove, emitTurnEnd } = useSocketAction();

  // -- States --

  const [firstClickedSquare, setFirstClickedSquare] = useState<
    Cood | undefined
  >(undefined);

  // -- Effects --

  useEffect(() => {
    if (!isPlayerInPreparation) {
      setFirstClickedSquare(undefined);
    }
  }, [isPlayerInPreparation]);

  // -- functions --

  const handleFirstClick = (fc: Cood) => {
    setFirstClickedSquare(fc);
  };

  const resetFirstClick = () => {
    setFirstClickedSquare(undefined);
  };

  const handleSecondClick = (sc: Cood) => {
    const fc = firstClickedSquare;
    emitMove(fc, sc);
    boardDispatch({
      type: ActionType.PLAYER_MOVE,
      payload: { from: fc, to: sc },
    });

    setFirstClickedSquare(undefined);
  };

  const turnEnd = () => {
    emitTurnEnd();
    setIsPlayerTurn(false);
    judgeWinnerAtPlayerAction(boardState, setIsPlayerWin);
  };

  const takeHandleClick = (cood: Cood) => {
    const crtGhost = boardState.mainBoard[cood.x][cood.y].ghost;

    if (isPlayerWin !== undefined) {
      return { handleClick: undefined, isClickable: false };
    }

    // in preparation
    if (isPlayerInPreparation) {
      // first click
      if (!firstClickedSquare) {
        // only player's ghosts are clickable
        if (crtGhost && crtGhost.ofPlayer) {
          return {
            handleClick: () => handleFirstClick(cood),
            isClickable: true,
          };
        }

        //second click
      } else {
        // only player's ghosts having opposite color of first clicked ghost are clickable
        if (
          crtGhost &&
          crtGhost.ofPlayer &&
          crtGhost.isWhite !==
            boardState.mainBoard[firstClickedSquare.x][firstClickedSquare.y]
              .ghost.isWhite
        ) {
          return {
            handleClick: () => handleSecondClick(cood),
            isClickable: true,
          };
        } else if (cood.equals(firstClickedSquare)) {
          return {
            handleClick: resetFirstClick,
            isClickable: false,
          };
        }
      }

      // during buttle
    } else if (!isOpponentInPreparation && isPlayerTurn) {
      // first click
      if (!firstClickedSquare) {
        // only player's ghosts are clickable
        if (crtGhost && crtGhost.ofPlayer) {
          return {
            handleClick: () => handleFirstClick(cood),
            isClickable: true,
          };
        }

        // second click
      } else {
        // only squares adjacent to firstClickedSquare and without players ghost are clickable
        if (
          firstClickedSquare.isAdjacent(cood) &&
          !(crtGhost && crtGhost.ofPlayer)
        ) {
          return {
            handleClick: () => {
              handleSecondClick(cood);
              turnEnd();
            },
            isClickable: true,
          };
        } else if (cood.equals(firstClickedSquare)) {
          return { handleClick: resetFirstClick, isClickable: false };
        }
      }
    }
    return { handleClick: undefined, isClickable: false };
  };

  const renderMainBoardRow = (i: number) => {
    const rows = [];

    for (let j = 0; j < BOARD_SIZE; j++) {
      const squareCood = new Cood(i, j);
      const { handleClick, isClickable } = takeHandleClick(squareCood);

      rows.push(
        <Square
          key={BOARD_SIZE * i + j}
          board="MAIN_BOARD"
          ghost={boardState.mainBoard[i][j].ghost}
          onClick={handleClick}
          isClickable={isClickable}
          isFirstClicked={squareCood.equals(firstClickedSquare)}
          isGoal={goals.some((cood) => cood.equals(squareCood))}
          isButtleEnd={isPlayerWin !== undefined}
        />
      );
    }
    return (
      <div className="board-row" key={i}>
        {rows}
      </div>
    );
  };

  const goals = [
    new Cood(0, 0),
    new Cood(0, 5),
    new Cood(5, 0),
    new Cood(5, 5),
  ];

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

const judgeWinnerAtPlayerAction = (boardState, setIsPlayerWin) => {
  if (boardState.playerSideGhosts[0] == GHOST_NUM) {
    // take 4 white ghosts
    setIsPlayerWin(true);
  } else if (boardState.playerSideGhosts[1] == GHOST_NUM) {
    // take 4 black ghosts
    setIsPlayerWin(false);
  } else if (isOpponentGhostAtGoal(boardState.mainBoard)) {
    // opponent white ghost arrived at the goal
    setIsPlayerWin(false);
  }
};

const isOpponentGhostAtGoal = (mainBoard) => {
  const g1 = mainBoard[5][0].ghost;
  const g2 = mainBoard[5][5].ghost;
  return (
    (g1 && g1.isWhite && !g1.ofPlayer) || (g2 && g2.isWhite && !g2.ofPlayer)
  );
};

export default Board;
