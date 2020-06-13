import React from "react";
import styles from "./board.module.css";
import Square from "./Square";
import Ghost from "./Ghost";
import Cood from "./Cood";

interface BoardPropsInterface {}
interface BoardStateInterface {
  squares: Array<Array<{ ghost: Ghost }>>;
  firstClickedSquare: Cood;
  secondClickedSquare: Cood;
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
      secondClickedSquare: null,
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
      const onClick =
        this.state.squares[i][j].ghost &&
        this.state.squares[i][j].ghost.ofPlayer
          ? !this.state.firstClickedSquare
            ? () => this.handleFirstClick(squareCood)
            : () => this.handleSecondClick(squareCood)
          : () => {};

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
