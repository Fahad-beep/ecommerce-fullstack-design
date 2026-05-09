import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  loginAdmin,
  refreshSession as refreshSessionRequest,
  type AuthSession,
  type LoginPayload,
} from '../api/products.api';

interface AuthContextValue {
  session: AuthSession | null;
  user: AuthSession['user'] | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAdmin: boolean;
  login: (payload: LoginPayload) => Promise<AuthSession>;
  refreshSession: () => Promise<AuthSession | null>;
  logout: () => void;
}

const STORAGE_KEY = 'ecommerce-auth-session';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      setSession(JSON.parse(stored) as AuthSession);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (!session) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  const login = async (payload: LoginPayload) => {
    const nextSession = await loginAdmin(payload);
    setSession(nextSession);
    return nextSession;
  };

  const refreshSession = async () => {
    if (!session?.refreshToken) {
      return null;
    }

    const nextSession = await refreshSessionRequest(session.refreshToken);
    setSession(nextSession);
    return nextSession;
  };

  const logout = () => {
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        accessToken: session?.accessToken ?? null,
        refreshToken: session?.refreshToken ?? null,
        isAdmin: session?.user.role === 'admin',
        login,
        refreshSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return value;
};
