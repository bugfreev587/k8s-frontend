import React, { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, signup as apiSignup, getProfile, logout as apiLogout, refreshToken as apiRefresh} from "../api/auth";
import axios from "axios";

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (tenantName: string, email: string, password: string) => Promise<void>;
  signup: (tenantName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  async function login(tenantName: string, email: string, password: string) {
    const { accessToken, refreshToken } = await apiLogin(tenantName, email, password);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    // const profile = await getProfile(accessToken);
    // setUser(profile.user);
  }

  async function signup(tenantName: string, email: string, password: string) {
    const {accessToken, refreshToken} = await apiSignup(tenantName, email, password);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    const profile = await getProfile(accessToken);
    // setUser(profile.user);
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

    // Decode JWT to get expiry (exp is in seconds since epoch)
    const payload = JSON.parse(atob(accessToken.split(".")[1]));
    const exp = payload.exp * 1000; // convert to ms
    const now = Date.now();

    // Refresh 1 minute before expiry
    const refreshTime = exp - now - 60_000;
    if (refreshTime <= 0) return; // already expired, will be handled by interceptor

    const timer = setTimeout(async () => {
      try {
        const {accessToken} = await apiRefresh(refreshToken);
        setAccessToken(accessToken);
      } catch {
        // logout on failure
        logout();
        window.location.href = "/login";
      }
    }, refreshTime);
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