"use client";

import { createContext, useContext, useState } from "react";

const DebtDetailsContext = createContext<{
  loadCounter: number;
  setLoadCounter: React.Dispatch<React.SetStateAction<number>>;
}>({ loadCounter: 0, setLoadCounter: () => {} });

export const AccountDetailsProvider = ({ children }: { children: React.ReactNode }) => {
  const [loadCounter, setLoadCounter] = useState(0);
  return (
    <DebtDetailsContext.Provider value={{ loadCounter, setLoadCounter }}>
      {children}
    </DebtDetailsContext.Provider>
  );
};

export const useDebtDetailsContext = () => useContext(DebtDetailsContext);
