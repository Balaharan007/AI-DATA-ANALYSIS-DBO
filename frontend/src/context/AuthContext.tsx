import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
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

// Helper to check if we're running on the server
const isServer = typeof window === "undefined";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // For SSR, initialize auth state synchronously from localStorage
  // This runs during render on both server and client
  const initialAuth = useMemo(() => {
    if (isServer) {
      // On server, we can't access localStorage, so assume not authenticated
      return { user: null as User | null, isLoading: false };
    }

    const token = getAccessToken();
    if (!token) {
      return { user: null as User | null, isLoading: false };
    }

    // Token exists, we'll validate it async
    return { user: null as User | null, isLoading: true };
  }, []);

  // Use the initial auth state for the first render
  const [authState, setAuthState] = useState(initialAuth);

  // Sync user state
  useEffect(() => {
    setUser(authState.user);
    setIsLoading(authState.isLoading);
  }, [authState]);

  const refreshUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setAuthState({ user: null, isLoading: false });
      return;
    }

    try {
      const userData = await endpoints.getMe();
      setAuthState({ user: userData, isLoading: false });
    } catch (error) {
      // Token might be expired or invalid
      setAccessToken(null);
      localStorage.removeItem("access_token");
      setAuthState({ user: null, isLoading: false });
    }
  }, []);

  // On client side, validate token after mount
  useEffect(() => {
    if (!isServer) {
      refreshUser();
    }
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const response: AuthResponse = await endpoints.signin({ email, password });
    setAccessToken(response.access_token);
    localStorage.setItem("access_token", response.access_token);
    const userData = await endpoints.getMe();
    setAuthState({ user: userData, isLoading: false });
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
    setAuthState({ user: userData, isLoading: false });
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
    setAuthState({ user: null, isLoading: false });
    toast.success("Signed out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        isLoading: authState.isLoading,
        isAuthenticated: !!authState.user,
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
