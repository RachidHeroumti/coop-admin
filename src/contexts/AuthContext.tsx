import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { AuthUser } from "../types";

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  // 🔹 Auto load user if email exists in localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("savedEmail44");
    if (storedData) {
      const { email, timestamp } = JSON.parse(storedData);
      const now = Date.now();
      const threeMonths = 1000 * 60 * 60 * 24 * 90; // 90 days

      if (now - timestamp < threeMonths) {
        // Auto-login user (simulate API validation)
        if (email === "admin@admin.com") {
          setUser({
            id: "1",
            name: "مدير النظام",
            email,
          });
        }
      } else {
        localStorage.removeItem("savedEmail");
      }
    }else{
         setUser({
            id: "1",
            name: "مدير النظام",
            email:"admin@gmail.com",
          });
        
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    if (email === "admin@admin.com" && password === "password") {
      const authUser: AuthUser = {
        id: "1",
        name: "مدير النظام",
        email,
      };
      setUser(authUser);

      // Save email in localStorage with expiration
      localStorage.setItem(
        "savedEmail",
        JSON.stringify({
          email,
          timestamp: Date.now(),
        })
      );

      return true;
    }
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("savedEmail"); 
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
