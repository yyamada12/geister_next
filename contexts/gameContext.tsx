import { useState, useEffect, useContext, createContext } from "react";

type TState = {
  isPlayerInPreparation: boolean;
  isOpponentInPreparation: boolean;
  isPlayerTurn: boolean | undefined;
  isPlayerWin: boolean | undefined;
};

type TSetState = {
  playerPrepareDone: Function;
  opponentPrepareDone: Function;
  setIsPlayerTurn: Function;
  setIsPlayerWin: Function;
};

const defaultState: TState = {
  isPlayerInPreparation: true,
  isOpponentInPreparation: true,
  isPlayerTurn: undefined,
  isPlayerWin: undefined,
};

const GameStateContext = createContext<TState>(defaultState);
const GameSetContext = createContext<TSetState | undefined>(undefined);

export const GameProvider: React.FC = ({ children }): JSX.Element => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPlayerInPreparation, setIsPlayerInPreparation] = useState(true);
  const [isOpponentInPreparation, setIsOpponentInPreparation] = useState(true);
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean | undefined>(
    undefined
  );
  const [isPlayerWin, setIsPlayerWin] = useState<boolean | undefined>(
    undefined
  );

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
          isPlayerWin,
        })
      );
    }
  }, [
    isPlayerInPreparation,
    isOpponentInPreparation,
    isPlayerTurn,
    isPlayerWin,
  ]);

  useEffect(() => {
    const initialState: TState =
      JSON.parse(sessionStorage.getItem("game")) || defaultState;
    setIsPlayerInPreparation(initialState.isPlayerInPreparation);
    setIsOpponentInPreparation(initialState.isOpponentInPreparation);
    setIsPlayerTurn(initialState.isPlayerTurn);
    setIsPlayerWin(initialState.isPlayerWin);

    setIsInitialized(true);
  }, []);

  return (
    <GameSetContext.Provider
      value={{
        playerPrepareDone,
        opponentPrepareDone,
        setIsPlayerTurn,
        setIsPlayerWin,
      }}
    >
      <GameStateContext.Provider
        value={{
          isPlayerInPreparation,
          isOpponentInPreparation,
          isPlayerTurn,
          isPlayerWin,
        }}
      >
        {children}
      </GameStateContext.Provider>
    </GameSetContext.Provider>
  );
};

export const useGame = () => useContext(GameStateContext);
export const useSetGame = () => useContext(GameSetContext);
