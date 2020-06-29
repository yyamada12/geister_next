import { useState, useEffect, useContext, createContext } from "react";

const defaultState = {
  isPlayerInPreparation: true,
  isOpponentInPreparation: true,
};

const GameStateContext = createContext(defaultState);
const GameSetContext = createContext({
  playerPrepareDone: undefined,
  opponentPrepareDone: undefined,
});

export const GameProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPlayerInPreparation, setIsPlayerInPreparation] = useState(true);
  const [isOpponentInPreparation, setIsOpponentInPreparation] = useState(true);

  const playerPrepareDone = () => setIsPlayerInPreparation(false);
  const opponentPrepareDone = () => setIsOpponentInPreparation(false);

  useEffect(() => {
    if (isInitialized) {
      sessionStorage.setItem(
        "game",
        JSON.stringify({ isPlayerInPreparation, isOpponentInPreparation })
      );
    }
  }, [isPlayerInPreparation, isOpponentInPreparation]);

  useEffect(() => {
    const initialState =
      JSON.parse(sessionStorage.getItem("game")) || defaultState;
    setIsPlayerInPreparation(initialState.isPlayerInPreparation);
    setIsOpponentInPreparation(initialState.isOpponentInPreparation);

    setIsInitialized(true);
  }, []);

  return (
    <GameSetContext.Provider value={{ playerPrepareDone, opponentPrepareDone }}>
      <GameStateContext.Provider
        value={{ isPlayerInPreparation, isOpponentInPreparation }}
      >
        {children}
      </GameStateContext.Provider>
    </GameSetContext.Provider>
  );
};

export const useGame = () => useContext(GameStateContext);
export const useSetGame = () => useContext(GameSetContext);
