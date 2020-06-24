import React from "react";
import Board from "../components/board";
import io from "socket.io-client";
import Link from "next/link";

interface GamePropsInterface {}
interface GameStateInterface {
  isPlayerInPreparation: boolean;
  isOppositeInPreparation: boolean;
}

let socket;

class Game extends React.Component<GamePropsInterface, GameStateInterface> {
  constructor(props: GamePropsInterface) {
    super(props);
    socket = io("localhost:8080");
    socket.on("oppositePrepareDone", () => {
      this.setState({
        isOppositeInPreparation: false,
      });
    });
    this.state = {
      isPlayerInPreparation: true,
      isOppositeInPreparation: true,
    };
  }

  handlePrepareDone = () => {
    this.setState({ isPlayerInPreparation: false });
    socket.emit("playerPrepareDone");
  };

  render() {
    return (
      <div>
        <Board isPlayerInPreparation={this.state.isPlayerInPreparation} />
        <br />
        <PreparedButton onClick={this.handlePrepareDone}></PreparedButton>

        <Link href="/lobby">
          <button>lobby</button>
        </Link>
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
