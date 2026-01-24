import { apiService, UserProfile } from "@/services/api";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "auth_token";
const USER_KEY = "user_data";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token and user from secure storage on mount
  useEffect(() => {
    loadStoredAuth();
  }, []);

  // Monitor authentication state and redirect
  useEffect(() => {
    if (isLoading) return;

    console.log("🔐 Auth state changed:", {
      isAuthenticated: !!token && !!user,
      token: !!token,
      user: !!user,
    });

    if (token && user) {
      // User is authenticated - go to tabs
      console.log("✅ User authenticated, navigating to /(tabs)");
      router.replace("/(tabs)");
    } else {
      // User is not authenticated - go to login
      console.log("❌ User not authenticated, navigating to /login");
      router.replace("/login");
    }
  }, [token, user, isLoading]);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      const storedUser = await SecureStore.getItemAsync(USER_KEY);

      console.log("📦 Loaded from SecureStore:", {
        hasToken: !!storedToken,
        hasUser: !!storedUser,
      });

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading stored auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUser = async () => {
    if (!token) return;

    try {
      const profile = await apiService.getProfile(token);
      setUser(profile);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error("Error loading user profile:", error);
      // If token is invalid, logout
      await logout();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log("🔑 Attempting login...");
      const response = await apiService.login({ email, password });

      if (response.token) {
        console.log("✅ Login successful, token received");
        // Save token and user immediately
        await SecureStore.setItemAsync(TOKEN_KEY, response.token);

        // If user data is in response, use it; otherwise fetch profile
        let userData: UserProfile;
        if (response.user) {
          console.log("📋 User data in response");
          userData = response.user;
          await SecureStore.setItemAsync(
            USER_KEY,
            JSON.stringify(response.user),
          );
        } else {
          console.log("📋 Fetching user profile...");
          // Fetch profile using the token directly
          userData = await apiService.getProfile(response.token);
          await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
        }

        // Update state atomically - this will trigger the useEffect above
        console.log("🔄 Updating auth state");
        setToken(response.token);
        setUser(userData);
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      console.log("🔑 Attempting register...");
      const response = await apiService.register({ email, password, name });

      if (response.token) {
        console.log("✅ Register successful, token received");
        // Save token and user immediately
        await SecureStore.setItemAsync(TOKEN_KEY, response.token);

        // If user data is in response, use it; otherwise fetch profile
        let userData: UserProfile;
        if (response.user) {
          console.log("📋 User data in response");
          userData = response.user;
          await SecureStore.setItemAsync(
            USER_KEY,
            JSON.stringify(response.user),
          );
        } else {
          console.log("📋 Fetching user profile...");
          // Fetch profile using the token directly
          userData = await apiService.getProfile(response.token);
          await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
        }

        // Update state atomically - this will trigger the useEffect above
        console.log("🔄 Updating auth state");
        setToken(response.token);
        setUser(userData);
      }
    } catch (error) {
      console.error("❌ Register error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
      setToken(null);
      setUser(null);
      router.replace("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
