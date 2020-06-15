import React from "react";
import styles from "./board.module.css";
import Square from "./square";
import Ghost from "./ghost";
import Cood from "./cood";

interface BoardPropsInterface {
  inPreparation: boolean;
}
interface BoardStateInterface {
  squares: Array<Array<{ ghost: Ghost }>>;
  firstClickedSquare: Cood;
}

class Board extends React.Component<BoardPropsInterface, BoardStateInterface> {
  constructor(props: BoardPropsInterface) {
    super(props);
    const NOMAL = () => {
      return { ghost: null };
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
      squares: [
        [NOMAL(), OP_BL(), OP_BL(), OP_BL(), OP_BL(), NOMAL()],
        [NOMAL(), OP_WH(), OP_WH(), OP_WH(), OP_WH(), NOMAL()],
        [NOMAL(), NOMAL(), NOMAL(), NOMAL(), NOMAL(), NOMAL()],
        [NOMAL(), NOMAL(), NOMAL(), NOMAL(), NOMAL(), NOMAL()],
        [NOMAL(), PL_WH(), PL_WH(), PL_WH(), PL_WH(), NOMAL()],
        [NOMAL(), PL_BL(), PL_BL(), PL_BL(), PL_BL(), NOMAL()],
      ],

      firstClickedSquare: null,
    };
  }

  handleFirstClick(c: Cood) {
    this.setState({
      firstClickedSquare: c,
    });
  }

  handleSecondClick(c: Cood) {
    const fc = this.state.firstClickedSquare;
    let squares = this.state.squares;
    [squares[c.x][c.y], squares[fc.x][fc.y]] = [
      squares[fc.x][fc.y],
      squares[c.x][c.y],
    ];
    this.setState({
      firstClickedSquare: null,
      squares: squares,
    });
  }

  renderBoardRow(i: number) {
    const rows = [];

    for (let j = 0; j < 6; j++) {
      const squareCood = new Cood(i, j);
      let onClick = () => {};
      // handle first click
      if (!this.state.firstClickedSquare) {
        // only player's ghosts are clickable
        if (
          this.state.squares[i][j].ghost &&
          this.state.squares[i][j].ghost.ofPlayer
        )
          onClick = () => this.handleFirstClick(squareCood);

        // handle second click
      } else {
        // in preparation
        if (this.props.inPreparation) {
          // only player's ghosts are clickable
          if (
            this.state.squares[i][j].ghost &&
            this.state.squares[i][j].ghost.ofPlayer
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
          ghost={this.state.squares[i][j].ghost}
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

  render() {
    const board = [];
    for (let i = 0; i < 6; i++) {
      board.push(this.renderBoardRow(i));
    }
    return (
      <div className={styles.board}>
        <div>{board}</div>
      </div>
    );
  }
}

export default Board;
