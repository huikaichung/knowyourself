'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AuthUser, getStoredUser, getAccessToken, clearAuth, isLoggedIn } from '@/lib/google-auth';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from storage on mount
  useEffect(() => {
    if (isLoggedIn()) {
      const storedUser = getStoredUser();
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  // Listen for storage changes (login from another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'kys_access_token') {
        if (e.newValue) {
          const storedUser = getStoredUser();
          setUser(storedUser);
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const refreshUser = useCallback(() => {
    if (isLoggedIn()) {
      const storedUser = getStoredUser();
      setUser(storedUser);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user && !!getAccessToken(),
      logout,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
