import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "../types";
import { v4 as uuidv4 } from "uuid";
import api from "../lib/api";

interface UserContextType {
  users: User[];
  addUser: (user: Omit<User, "id" | "createdAt" | "updatedAt">) => boolean;
  updateUser: (
    id: string,
    user: Omit<User, "id" | "createdAt" | "updatedAt">
  ) => boolean;
  deleteUser: (id: string) => void;
  getUser: (id: string) => User | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};



interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  

  const fetchUsers = async () => {
    try {
      const res: any = await api.get("/users");
      if (res.status === 200 && res.users) {
        setUsers(res.users);
      }
    } catch (error) {
      console.log("🚀 ~ fetchUsers ~ error:", error);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);


  const addUser = (
    userData: Omit<User, "id" | "createdAt" | "updatedAt">
  ): boolean => {
    try {
      const res: any = api.post("/users/create", userData);
      if (res.status === 200 && res.user) {
        setUsers((prev) => [...prev, res.user]);
      }
      return true;
    } catch (error) {
      console.log("🚀 ~ addUser ~ error:", error);
      return false;
    }
  };

  const updateUser = (
    id: string,
    userData: Omit<User, "id" | "createdAt" | "updatedAt">
  ): boolean => {
    try {
      const res: any = api.put(`/users/${id}`, userData);
      if (res.status === 200 && res.user) {
        setUsers((prev) =>
          prev.map((user) => (user.id === id ? res.user : user))
        );
      }
      return true;
    } catch (error) {
      console.log("🚀 ~ updateUser ~ error:", error);
      return false;
    }
  };

  const deleteUser = (id: string) => {
    try {
      const res: any = api.delete(`/users/${id}`);
      if (res.status === 200) {
        setUsers((prev) => prev.filter((user) => user.id !== id));
      }
    } catch (error) {
      console.log("🚀 ~ deleteUser ~ error:", error);
    }
  };

  const getUser = (id: string) => {
    try {
      const res: any = api.get(`/users/${id}`);
      if (res.status === 200 && res.user) {
        return res.user;
      }
    } catch (error) {
      console.log("🚀 ~ getUser ~ error:", error);
    }
  };
  const value = {
    users,
    addUser,
    updateUser,
    deleteUser,
    getUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
