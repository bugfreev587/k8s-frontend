import React, { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, signup as apiSignup, getProfile, logout as apiLogout, refreshToken as apiRefresh} from "../api/auth";
import axios from "axios";

interface User {
  userId: string;
  tenantId: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (tenantName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  async function login(email: string, password: string) {
    const { accessToken, refreshToken } = await apiLogin(email, password);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    const profile = await getProfile(accessToken);
    setUser({ userId: profile.userId, tenantId: profile.tenantId});
  }

  async function signup(tenantName: string, email: string, password: string) {
    const response = await apiSignup(tenantName, email, password);
    const {accessToken, refreshToken} = response;
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    const profile = await getProfile(accessToken);
    setUser({ userId: profile.userId, tenantId: profile.tenantId});
  }

  async function logout() {
    if (refreshToken) {
      await apiLogout(refreshToken);
    }
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  }

  // ⏳ Proactive refresh effect
  useEffect(() => {
    if (!accessToken || !refreshToken) return;
    
    const refreshDelay = 2 * 60 * 1000; // 14 minutes in milliseconds
    const timer = setTimeout(async () => {
      try {
        const {accessToken: newAccessToken, refreshToken: newRefreshToken} = await apiRefresh(accessToken, refreshToken);
        setAccessToken(newAccessToken);  
        setRefreshToken(newRefreshToken);
      } catch {
        // logout on failure
        logout();
        window.location.href = "/login";
      }
    }, refreshDelay);
    return () => clearTimeout(timer);
  }, [accessToken, refreshToken]);

  return (
    <AuthContext.Provider value={{ user, accessToken, refreshToken, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}