import { createContext, useContext } from "react";

export const CRMDataContext = createContext(null);

export function useCRMData() {
  const context = useContext(CRMDataContext);
  if (!context) {
    throw new Error("useCRMData must be used within a CRMDataProvider.");
  }
  return context;
}
