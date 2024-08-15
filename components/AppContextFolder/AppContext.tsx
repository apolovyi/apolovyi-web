"use client";

import React, { createContext, ReactNode, useState } from "react";

type SharedState = {
  finishedLoading: boolean;
};

type AppContextType = {
  sharedState: SharedState;
  setSharedState: React.Dispatch<React.SetStateAction<SharedState>>;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
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
