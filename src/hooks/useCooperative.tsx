import { useCallback, useState } from "react";
import { Cooperative } from "../types";
import api from "../lib/api";

export const useCooperative = () => {
  const [cooperatives, setCooperatives] = useState<Cooperative[]>([]);

  const fetchCooperatives =useCallback( async (page: number = 1, limit: number = 10) => {
    try {
      const res: any = await api.get(
        `/cooperatives?limit=${limit}&page=${page}`
      );
      console.log("🚀 ~ fetchCooperatives ~ res:", res);
      if (res.cooperatives) {
        setCooperatives(res.cooperatives);
        return {
          cooperatives: res.cooperatives,
          pagination: res.pagination,
        };
      }
      return { cooperatives: [], pagination: {} };
    } catch (error) {
      console.log("🚀 ~ fetchCooperatives ~ error:", error);
      return { cooperatives: [], pagination: {} };
    }
  },[]);

  const addCooperative = async (
    cooperativeData: Omit<Cooperative, "id" | "createdAt" | "updatedAt">
  ): Promise<boolean> => {
    try {
      const res: any = await api.post("/cooperatives", cooperativeData);
      if ( res.cooperative) {
        setCooperatives((prev) => [...prev, res.cooperative]);
        return true;
      }
      return false;
    } catch (error) {
      console.log("🚀 ~ addCooperative ~ error:", error);
      return false;
    }
  };

  const updateCooperative = async (
    id: string,
    cooperativeData: Omit<Cooperative, "id" | "createdAt" | "updatedAt">
  ): Promise<boolean> => {
    try {
      const res: any = await api.put(`/cooperatives/${id}`, cooperativeData);
      if ( res.cooperative) {
        setCooperatives((prev) =>
          prev.map((coop) => (coop.id === id ? res.cooperative : coop))
        );
        return true;
      }
      return false;
    } catch (error) {
      console.log("🚀 ~ updateCooperative ~ error:", error);
      return false;
    }
  };

  const deleteCooperative = async (id: string): Promise<void> => {
    try {
      const res: any = await api.delete(`/cooperatives/${id}`);
      if (res.status === 200) {
        setCooperatives((prev) => prev.filter((coop) => coop.id !== id));
      }
    } catch (error) {
      console.log("🚀 ~ deleteCooperative ~ error:", error);
    }
  };

  return {
    cooperatives,
    fetchCooperatives,
    addCooperative,
    updateCooperative,
    deleteCooperative,
  };
};
