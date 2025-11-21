import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { AuthUser } from "../types";
import api from "../lib/api";

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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res: any = await api.get("/users/me");
        console.log("🚀 ~ checkAuth ~ res:", res);
        if (res.user) {
          setUser(res.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser;
        console.log("🚀 ~ checkAuth ~ error:", error);
      }
    };
    checkAuth();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; token: string }> => {
    try {
      const res: any = await api.post("/users/login", { email, password });
      console.log("🚀 ~ login ~ res:", res);
      if (res.status === 200 && res.user) {
        const token = res.token;
        setUser(res.user);
        return { success: true, token };
      }
      return { success: false, token: "" };
    } catch (error) {
      console.log("🚀 ~ login ~ error:", error);
      return { success: false, token: "" };
    }
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
