'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AuthUser, getStoredUser, getAccessToken, clearAuth, isLoggedIn } from '@/lib/google-auth';

export interface BirthInfo {
  birth_date: string;  // YYYY-MM-DD
  birth_time?: string; // HH:MM
  birth_place?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  gender?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  birthInfo: BirthInfo | null;
  loading: boolean;
  isAuthenticated: boolean;
  hasBirthInfo: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateBirthInfo: (info: BirthInfo) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.selfkit.art';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [birthInfo, setBirthInfo] = useState<BirthInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch full profile from API
  const fetchProfile = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.birth_info) {
          setBirthInfo(data.birth_info);
          localStorage.setItem('kys_birth_info', JSON.stringify(data.birth_info));
        }
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  }, []);

  // Load user from storage on mount
  useEffect(() => {
    if (isLoggedIn()) {
      const storedUser = getStoredUser();
      setUser(storedUser);
      
      // Load cached birth info
      const cachedBirthInfo = localStorage.getItem('kys_birth_info');
      if (cachedBirthInfo) {
        setBirthInfo(JSON.parse(cachedBirthInfo));
      }
      
      // Fetch fresh profile from API
      fetchProfile();
    }
    setLoading(false);
  }, [fetchProfile]);

  // Listen for storage changes (login from another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'kys_access_token') {
        if (e.newValue) {
          const storedUser = getStoredUser();
          setUser(storedUser);
          fetchProfile();
        } else {
          setUser(null);
          setBirthInfo(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchProfile]);

  const refreshUser = useCallback(async () => {
    if (isLoggedIn()) {
      const storedUser = getStoredUser();
      setUser(storedUser);
      await fetchProfile();
    }
  }, [fetchProfile]);

  const updateBirthInfo = useCallback(async (info: BirthInfo): Promise<boolean> => {
    const token = getAccessToken();
    if (!token) return false;

    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ birth_info: info }),
      });
      
      if (res.ok) {
        setBirthInfo(info);
        localStorage.setItem('kys_birth_info', JSON.stringify(info));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to update birth info:', err);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    setBirthInfo(null);
    localStorage.removeItem('kys_birth_info');
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      birthInfo,
      loading,
      isAuthenticated: !!user && !!getAccessToken(),
      hasBirthInfo: !!birthInfo?.birth_date,
      logout,
      refreshUser,
      updateBirthInfo,
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
