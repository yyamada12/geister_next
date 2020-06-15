import React from "react";
import Board from "../components/board";

interface GamePropsInterface {}
interface GameStateInterface {
  inPreparation: boolean;
}

class Game extends React.Component<GamePropsInterface, GameStateInterface> {
  constructor(props: GamePropsInterface) {
    super(props);
    this.state = {
      inPreparation: true,
    };
  }
  render() {
    return (
      <div>
        <Board inPreparation={this.state.inPreparation} />
        <br />
        <PreparedButton
          onClick={() => this.setState({ inPreparation: false })}
        ></PreparedButton>
      </div>
    );
  }
}

interface PreparedButtonProps {
  onClick: () => void;
}

function PreparedButton(props: PreparedButtonProps) {
  return <button onClick={props.onClick}>準備完了</button>;
}

export default Game;
