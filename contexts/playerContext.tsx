import { useState, useEffect, useContext, createContext } from "react";

type TState = {
  id: string;
  playerName: string;
  opponentName: string;
};

type TSetState = {
  setId: Function;
  setPlayerName: Function;
  setOpponentName: Function;
};

const defaultState: TState = {
  id: "",
  playerName: "",
  opponentName: "",
};

const PlayerStateContext = createContext<TState>(defaultState);
const PlayerSetContext = createContext<TSetState | undefined>(undefined);

export const PlayerProvider: React.FC = ({ children }): JSX.Element => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [id, setId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [opponentName, setOpponentName] = useState("");

  useEffect(() => {
    if (isInitialized) {
      sessionStorage.setItem(
        "player",
        JSON.stringify({ id, playerName, opponentName })
      );
    }
  }, [id, playerName, opponentName]);

  useEffect(() => {
    const initialState: TState =
      JSON.parse(sessionStorage.getItem("player")) || defaultState;
    setId(initialState.id);
    setPlayerName(initialState.playerName);
    setOpponentName(initialState.opponentName);

    setIsInitialized(true);
  }, []);

  return (
    <PlayerSetContext.Provider
      value={{ setId, setPlayerName, setOpponentName }}
    >
      <PlayerStateContext.Provider value={{ id, playerName, opponentName }}>
        {children}
      </PlayerStateContext.Provider>
    </PlayerSetContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerStateContext);
export const useSetPlayer = () => useContext(PlayerSetContext);
