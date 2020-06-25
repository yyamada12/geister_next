import App from "next/app";
import { PlayerProvider } from "../components/playerContext";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <PlayerProvider>
        <Component {...pageProps} />
      </PlayerProvider>
    );
  }
}

export default MyApp;
