"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

type SharedState = {
  finishedLoading: boolean;
};

type AppContextType = {
  sharedState: SharedState;
  setSharedState: Dispatch<SetStateAction<SharedState>>;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [sharedState, setSharedState] = useState<SharedState>({
    finishedLoading: true,
  });

  return (
    <AppContext.Provider value={{ sharedState, setSharedState }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
