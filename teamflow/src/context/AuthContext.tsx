import React, { createContext, useState, useEffect, useContext } from "react";
import { UserInfo, LoginRequest, RegisterRequest } from "../types/auth.types";
import { authApi } from "../api/authApi";

interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCurrentUser() {
      const savedToken = localStorage.getItem("accessToken");
      if (savedToken) {
        setToken(savedToken);
        try {
          const fetchedUser = await authApi.getCurrentUser();
          if (fetchedUser) {
            setUser(fetchedUser);
          } else {
            // Token is stale or invalid
            localStorage.removeItem("accessToken");
            setToken(null);
          }
        } catch (e) {
          console.error("Failed to load user info during initialization:", e);
        }
      }
      setLoading(false);
    }
    loadCurrentUser();
  }, []);

  const login = async (data: LoginRequest) => {
    setLoading(true);
    try {
      const result = await authApi.login(data);
      localStorage.setItem("accessToken", result.accessToken);
      setToken(result.accessToken);
      setUser(result.user);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setLoading(true);
    try {
      await authApi.register(data);
      // Immediately log in user
      await login({ email: data.email, password: data.password });
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
    } catch (err) {
      console.error("Logout api error:", err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("accessToken");
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
