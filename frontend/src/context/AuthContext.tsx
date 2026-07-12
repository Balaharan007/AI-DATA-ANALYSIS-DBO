import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { endpoints } from "@/lib/api/endpoints";
import { setAccessToken, getAccessToken } from "@/lib/api/client";
import type { User, AuthResponse } from "@/lib/api/types";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const isClientRef = useRef(false);

  // Mark as client-side after mount to avoid SSR hydration mismatch
  useEffect(() => {
    isClientRef.current = true;
    setIsClient(true);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!isClientRef.current) return;

    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await endpoints.getMe();
      setUser(userData);
    } catch {
      // Token might be expired or invalid
      setAccessToken(null);
      localStorage.removeItem("access_token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // On client side, validate token after mount
  useEffect(() => {
    if (isClientRef.current) {
      refreshUser();
    }
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const response: AuthResponse = await endpoints.signin({ email, password });
    setAccessToken(response.access_token);
    localStorage.setItem("access_token", response.access_token);
    const userData = await endpoints.getMe();
    setUser(userData);
    setIsLoading(false);
    toast.success("Welcome back!");
  };

  const signup = async (name: string, email: string, password: string) => {
    const response: AuthResponse = await endpoints.signup({
      name,
      email,
      password,
    });
    setAccessToken(response.access_token);
    localStorage.setItem("access_token", response.access_token);
    const userData = await endpoints.getMe();
    setUser(userData);
    setIsLoading(false);
    toast.success("Account created successfully!");
  };

  const logout = async () => {
    try {
      await endpoints.signout();
    } catch {
      // Ignore errors
    }
    setAccessToken(null);
    localStorage.removeItem("access_token");
    setUser(null);
    setIsLoading(false);
    toast.success("Signed out successfully");
  };

  // During SSR or before client mount, don't render auth-dependent UI
  // This prevents hydration mismatch
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isClient ? isLoading : false, // Only show loading on client
        isAuthenticated,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
