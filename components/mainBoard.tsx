
import Cood from "./cood";
import Square from "./square";
import styles from "./board.module.css";

export default function MainBoard (props) {
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
        if (this.props.isPlayerInPreparation) {
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
