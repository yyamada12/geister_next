import { useState, useEffect, useContext, createContext } from "react";

const defaultState = {
  isPlayerInPreparation: true,
  isOpponentInPreparation: true,
  isPlayerTurn: undefined,
};

const GameStateContext = createContext(defaultState);
const GameSetContext = createContext(undefined);

export const GameProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPlayerInPreparation, setIsPlayerInPreparation] = useState(true);
  const [isOpponentInPreparation, setIsOpponentInPreparation] = useState(true);
  const [isPlayerTurn, setIsPlayerTurn] = useState(undefined);

  const playerPrepareDone = () => setIsPlayerInPreparation(false);
  const opponentPrepareDone = () => setIsOpponentInPreparation(false);
  useEffect(() => {
    if (isInitialized) {
      sessionStorage.setItem(
        "game",
        JSON.stringify({
          isPlayerInPreparation,
          isOpponentInPreparation,
          isPlayerTurn,
        })
      );
    }
  }, [isPlayerInPreparation, isOpponentInPreparation, isPlayerTurn]);

  useEffect(() => {
    const initialState =
      JSON.parse(sessionStorage.getItem("game")) || defaultState;
    setIsPlayerInPreparation(initialState.isPlayerInPreparation);
    setIsOpponentInPreparation(initialState.isOpponentInPreparation);
    setIsPlayerTurn(initialState.isPlayerTurn);

    setIsInitialized(true);
  }, []);

  return (
    <GameSetContext.Provider
      value={{
        playerPrepareDone,
        opponentPrepareDone,
        setIsPlayerTurn,
      }}
    >
      <GameStateContext.Provider
        value={{ isPlayerInPreparation, isOpponentInPreparation, isPlayerTurn }}
      >
        {children}
      </GameStateContext.Provider>
    </GameSetContext.Provider>
  );
};

export const useGame = () => useContext(GameStateContext);
export const useSetGame = () => useContext(GameSetContext);
