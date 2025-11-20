import React, { createContext, useContext, useState, ReactNode } from "react";
import { Cooperative } from "../types";

interface CooperativeContextType {
  cooperatives: Cooperative[];
  addCooperative: (cooperative: Omit<Cooperative, "id" | "createdAt" | "updatedAt">) => boolean;
  updateCooperative: (id: string, cooperative: Omit<Cooperative, "id" | "createdAt" | "updatedAt">) => boolean;
  deleteCooperative: (id: string) => void;
}

const CooperativeContext = createContext<CooperativeContextType | undefined>(undefined);

export const CooperativeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cooperatives, setCooperatives] = useState<Cooperative[]>([
    {
      id: "1",
      name: "Green Valley Cooperative",
      founded: new Date("2020-01-15"),
      founder: "John Smith",
      phone: "+1234567890",
      address: "123 Main Street, City, Country",
      score: "A+",
      createdAt: new Date("2020-01-15"),
      updatedAt: new Date("2020-01-15"),
    },
    {
      id: "2",
      name: "Community Farmers Cooperative",
      founded: new Date("2019-06-20"),
      founder: "Jane Doe",
      phone: "+0987654321",
      address: "456 Oak Avenue, Town, Country",
      score: "A",
      createdAt: new Date("2019-06-20"),
      updatedAt: new Date("2019-06-20"),
    },
  ]);

  const addCooperative = (cooperativeData: Omit<Cooperative, "id" | "createdAt" | "updatedAt">): boolean => {
    const newCooperative: Cooperative = {
      ...cooperativeData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setCooperatives((prev) => [...prev, newCooperative]);
    return true;
  };

  const updateCooperative = (id: string, cooperativeData: Omit<Cooperative, "id" | "createdAt" | "updatedAt">): boolean => {
    setCooperatives((prev) =>
      prev.map((coop) =>
        coop.id === id
          ? { ...cooperativeData, id, createdAt: coop.createdAt, updatedAt: new Date() }
          : coop
      )
    );
    return true;
  };

  const deleteCooperative = (id: string) => {
    setCooperatives((prev) => prev.filter((coop) => coop.id !== id));
  };

  return (
    <CooperativeContext.Provider
      value={{
        cooperatives,
        addCooperative,
        updateCooperative,
        deleteCooperative,
      }}
    >
      {children}
    </CooperativeContext.Provider>
  );
};

export const useCooperative = () => {
  const context = useContext(CooperativeContext);
  if (!context) {
    throw new Error("useCooperative must be used within a CooperativeProvider");
  }
  return context;
};

