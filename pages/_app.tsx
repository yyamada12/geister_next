import App from "next/app";
import { PlayerProvider } from "../components/playerContext";
import { BoardProvider } from "../components/boardContext";
import { SocketProvider } from "../components/socketContext";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <PlayerProvider>
        <BoardProvider>
          <SocketProvider>
            <Component {...pageProps} />
          </SocketProvider>
        </BoardProvider>
      </PlayerProvider>
    );
  }
}

export default MyApp;
