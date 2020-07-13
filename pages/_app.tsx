import App from "next/app";
import { PlayerProvider } from "../contexts/playerContext";
import { BoardProvider } from "../contexts/boardContext";
import { GameProvider } from "../contexts/gameContext";
import { SocketProvider } from "../contexts/socketContext";

import "../public/style.css";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <PlayerProvider>
        <BoardProvider>
          <GameProvider>
            <SocketProvider>
              <Component {...pageProps} />
            </SocketProvider>
          </GameProvider>
        </BoardProvider>
      </PlayerProvider>
    );
  }
}

export default MyApp;
