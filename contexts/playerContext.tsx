import { useState, useEffect, useContext, createContext } from "react";

const defaultState = {
  id: "",
  playerName: "",
  opponentName: "",
};

const PlayerStateContext = createContext(defaultState);
const PlayerSetContext = createContext({
  setId: undefined,
  setPlayerName: undefined,
  setOpponentName: undefined,
});

export const PlayerProvider = ({ children }) => {
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
    const initialState =
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
