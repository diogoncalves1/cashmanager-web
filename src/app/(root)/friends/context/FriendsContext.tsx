"use client";

import { createContext, useContext, useState } from "react";

const FriendsContext = createContext<{
  loadCounter: number;
  setLoadCounter: React.Dispatch<React.SetStateAction<number>>;
}>({ loadCounter: 0, setLoadCounter: () => {} });

export const FriendsProvider = ({ children }: { children: React.ReactNode }) => {
  const [loadCounter, setLoadCounter] = useState(0);
  return (
    <FriendsContext.Provider value={{ loadCounter, setLoadCounter }}>
      {children}
    </FriendsContext.Provider>
  );
};

export const useFriendsContext = () => useContext(FriendsContext);
