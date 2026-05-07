import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginApi, signupApi } from "../api/auth";
import { setAuthTokenProvider } from "../api/client";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthValue = {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

const TOKEN_KEY = "task_tracker_token";
const USER_KEY = "task_tracker_user";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setAuthTokenProvider(() => token);
  }, [token]);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedToken = await AsyncStorage.getItem(TOKEN_KEY);
        const savedUser = await AsyncStorage.getItem(USER_KEY);

        if (savedToken) setToken(savedToken);
        if (savedUser) setUser(JSON.parse(savedUser));
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginApi(email, password);
    if (!data?.token) {
      throw new Error("Token missing in login response");
    }
    setToken(data.token);
    setUser(data.user || null);
    try {
      await AsyncStorage.setItem(TOKEN_KEY, data.token);
      if (data.user) {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));
      } else {
        await AsyncStorage.removeItem(USER_KEY);
      }
    } catch {
      // Do not block login if local storage fails.
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    const data = await signupApi(name, email, password);
    if (!data?.token) {
      throw new Error("Token missing in signup response");
    }
    setToken(data.token);
    setUser(data.user || null);
    try {
      await AsyncStorage.setItem(TOKEN_KEY, data.token);
      if (data.user) {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));
      } else {
        await AsyncStorage.removeItem(USER_KEY);
      }
    } catch {
      // Do not block signup if local storage fails.
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  };

  const value = useMemo(
    () => ({ token, user, isLoading, login, signup, logout }),
    [token, user, isLoading]
  );

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
