"use client";

import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";

type SharedState = {
  finishedLoading: boolean;
};

type AppContextType = {
  sharedState: SharedState;
  setSharedState: Dispatch<SetStateAction<SharedState>>;
};

const defaultContextValue: AppContextType = {
  sharedState: { finishedLoading: true },
  setSharedState: () => {},
};

export const AppContext = createContext<AppContextType>(defaultContextValue);

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [sharedState, setSharedState] = useState<SharedState>(defaultContextValue.sharedState);

  return <AppContext.Provider value={{ sharedState, setSharedState }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === defaultContextValue) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
