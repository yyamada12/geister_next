import App from "next/app";
import PlayerContext from "../components/player";

class MyApp extends App {
  constructor(props) {
    super(props);
    this.state = {
      player: "",
    };
  }
  componentDidMount = () => {
    const player = localStorage.getItem("player");
    if (player) {
      this.setState({
        player,
      });
    }
  };

  setPlayer = (name) => {
    localStorage.setItem("player", name);
    this.setState({
      player: name,
    });
  };

  render() {
    const { Component, pageProps } = this.props;
    return (
      <PlayerContext.Provider
        value={{ player: this.state.player, setPlayer: this.setPlayer }}
      >
        <Component {...pageProps} />
      </PlayerContext.Provider>
    );
  }
}

export default MyApp;
