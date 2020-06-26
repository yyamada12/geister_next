import App from "next/app";
import { PlayerProvider } from "../components/playerContext";
import { SocketProvider } from "../components/socketContext";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <PlayerProvider>
        <SocketProvider>
          <Component {...pageProps} />
        </SocketProvider>
      </PlayerProvider>
    );
  }
}

export default MyApp;
