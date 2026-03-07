"use client";

import { createContext, useContext, useState } from "react";

const AccountDetailsContext = createContext<{
  loadCounter: number;
  setLoadCounter: React.Dispatch<React.SetStateAction<number>>;
}>({ loadCounter: 0, setLoadCounter: () => {} });

export const AccountDetailsProvider = ({ children }: { children: React.ReactNode }) => {
  const [loadCounter, setLoadCounter] = useState(0);
  return (
    <AccountDetailsContext.Provider value={{ loadCounter, setLoadCounter }}>
      {children}
    </AccountDetailsContext.Provider>
  );
};

export const useAccountDetailsContext = () => useContext(AccountDetailsContext);
