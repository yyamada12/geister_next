import App from "next/app";
import { PlayerProvider } from "../components/playerContext";
import { BoardProvider } from "../components/boardContext";
import { GameProvider } from "../components/gameContext";
import { SocketProvider } from "../components/socketContext";

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
