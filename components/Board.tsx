import React from "react";
import styles from "./board.module.css";
import Square from "./Square";
import Ghost from "./Ghost";
import Cood from "./Cood";

interface BoardPropsInterface {}
interface BoardStateInterface {
  ghosts: {
    player: { white: Array<Cood>; black: Array<Cood> };
    opposite: { white: Array<Cood>; black: Array<Cood> };
  };
  firstClickedSquare: Cood;
  secondClickedSquare: Cood;
}

class Board extends React.Component<BoardPropsInterface, BoardStateInterface> {
  constructor(props: BoardPropsInterface) {
    super(props);
    this.state = {
      ghosts: {
        player: {
          white: [
            new Cood(4, 1),
            new Cood(4, 2),
            new Cood(4, 3),
            new Cood(4, 4),
          ],
          black: [
            new Cood(5, 1),
            new Cood(5, 2),
            new Cood(5, 3),
            new Cood(5, 4),
          ],
        },
        opposite: {
          white: [
            new Cood(1, 1),
            new Cood(1, 2),
            new Cood(1, 3),
            new Cood(1, 4),
          ],
          black: [
            new Cood(0, 1),
            new Cood(0, 2),
            new Cood(0, 3),
            new Cood(0, 4),
          ],
        },
      },
      firstClickedSquare: null,
      secondClickedSquare: null,
    };
  }

  handleFirstClick(c: Cood) {
    this.setState({
      firstClickedSquare: c,
    });
    console.log(this.state.firstClickedSquare);
  }

  renderSquare(
    i: number,
    ghost: Ghost,
    cood: Cood,
    onClick: (c: Cood) => void
  ) {
    return (
      <Square
        key={i}
        ghost={ghost}
        cood={cood}
        onClick={onClick}
        isFirstClicked={cood.equals(this.state.firstClickedSquare)}
      />
    );
  }
  renderBoardRow(i: number) {
    const rows = [];

    for (let j = 0; j < 6; j++) {
      let ghost = null;
      const squareCood = new Cood(i, j);

      for (const [player, v] of Object.entries(this.state.ghosts)) {
        for (const [color, coods] of Object.entries(v)) {
          for (const [id, Cood] of coods.entries()) {
            if (Cood.equals(squareCood)) {
              ghost = new Ghost(id, player === "player", color === "white");
              break;
            }
          }
        }
      }
      rows.push(
        this.renderSquare(6 * i + j, ghost, squareCood, (cood: Cood) =>
          this.handleFirstClick(cood)
        )
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
