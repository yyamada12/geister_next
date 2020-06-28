import React from "react";
import styles from "./board.module.css";
import Square from "./square";
import Ghost from "./ghost";
import Cood from "./cood";

import { useSocketAction } from "../components/socketContext";

interface BoardPropsInterface {
  isPlayerInPreparation: boolean;
}
interface BoardStateInterface {
  mainBoard: Array<Array<{ ghost: Ghost }>>;
  playerSideBoard: Array<Array<{ ghost: Ghost }>>;
  opponentSideBoard: Array<Array<{ ghost: Ghost }>>;
  firstClickedSquare: Cood;
}

class Board extends React.Component<BoardPropsInterface, BoardStateInterface> {
  constructor(props: BoardPropsInterface) {
    super(props);
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

    this.state = {
      mainBoard: [
        [NOMAL(), OP_BL(), OP_BL(), OP_BL(), OP_BL(), NOMAL()],
        [NOMAL(), OP_WH(), OP_WH(), OP_WH(), OP_WH(), NOMAL()],
        [NOMAL(), NOMAL(), NOMAL(), NOMAL(), NOMAL(), NOMAL()],
        [NOMAL(), NOMAL(), NOMAL(), NOMAL(), NOMAL(), NOMAL()],
        [NOMAL(), PL_WH(), PL_WH(), PL_WH(), PL_WH(), NOMAL()],
        [NOMAL(), PL_BL(), PL_BL(), PL_BL(), PL_BL(), NOMAL()],
      ],
      playerSideBoard: [
        [NOMAL(), NOMAL(), NOMAL(), NOMAL()],
        [NOMAL(), NOMAL(), NOMAL(), NOMAL()],
      ],
      opponentSideBoard: [
        [NOMAL(), NOMAL(), NOMAL(), NOMAL()],
        [NOMAL(), NOMAL(), NOMAL(), NOMAL()],
      ],

      firstClickedSquare: undefined,
    };
  }

  handleFirstClick(c: Cood) {
    this.setState({
      firstClickedSquare: c,
    });
  }

  handleSecondClick(c: Cood) {
    const fc = this.state.firstClickedSquare;
    let squares = this.state.mainBoard;

    [squares[c.x][c.y], squares[fc.x][fc.y]] = [
      squares[fc.x][fc.y],
      squares[c.x][c.y],
    ];
    this.setState({
      firstClickedSquare: undefined,
      mainBoard: squares,
    });
  }

  renderMainBoardRow(i: number) {
    const rows = [];

    for (let j = 0; j < 6; j++) {
      const squareCood = new Cood(i, j);
      let onClick = () => {};
      // handle first click
      if (!this.state.firstClickedSquare) {
        // only player's ghosts are clickable
        if (
          this.state.mainBoard[i][j].ghost &&
          this.state.mainBoard[i][j].ghost.ofPlayer
        )
          onClick = () => this.handleFirstClick(squareCood);

        // handle second click
      } else {
        // in preparation
        if (this.props.isPlayerInPreparation) {
          // only player's ghosts are clickable
          if (
            this.state.mainBoard[i][j].ghost &&
            this.state.mainBoard[i][j].ghost.ofPlayer
          ) {
            onClick = () => this.handleSecondClick(squareCood);
          }

          // during buttle
        } else {
          // only squares adjacent to firstClickedSquare are clickable
          if (this.state.firstClickedSquare.isAdjacent(squareCood)) {
            onClick = () => this.handleSecondClick(squareCood);
          }
        }
      }

      rows.push(
        <Square
          key={6 * i + j}
          ghost={this.state.mainBoard[i][j].ghost}
          onClick={onClick}
          isFirstClicked={squareCood.equals(this.state.firstClickedSquare)}
        />
      );
    }
    return (
      <div className="board-row" key={i}>
        {rows}
      </div>
    );
  }

  renderMainBoard() {
    const board = [];
    for (let i = 0; i < 6; i++) {
      board.push(this.renderMainBoardRow(i));
    }
    return board;
  }

  renderSideBoardRow(i: number, isPlayer: boolean) {
    const rows = [];

    for (let j = 0; j < 4; j++) {
      const ghost = isPlayer
        ? this.state.playerSideBoard[i][j].ghost
        : this.state.opponentSideBoard[i][j].ghost;
      rows.push(<Square key={4 * i + j} ghost={ghost} />);
    }
    return (
      <div className="board-row" key={i}>
        {rows}
      </div>
    );
  }
  renderSideBoard(isPlayer: boolean) {
    const board = [];
    for (let i = 0; i < 2; i++) {
      board.push(this.renderSideBoardRow(i, isPlayer));
    }
    return board;
  }

  render() {
    return (
      <div className={styles.boardContainer}>
        <div className={styles.opponentSideBoard}>
          <div>{this.renderSideBoard(false)}</div>
        </div>
        <div className={styles.mainBoard}>
          <div>{this.renderMainBoard()}</div>
        </div>
        <div className={styles.playerSideBoard}>
          <div>{this.renderSideBoard(true)}</div>
        </div>
      </div>
    );
  }
}

export default Board;
