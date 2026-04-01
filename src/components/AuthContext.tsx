'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AuthUser, getStoredUser, clearAuth, isLoggedIn, verifyAuth, setUserData } from '@/lib/google-auth';

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
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateBirthInfo: (info: BirthInfo) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.selfkit.art/api/v1';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [birthInfo, setBirthInfo] = useState<BirthInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch full profile from API using httpOnly cookie
  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        credentials: 'include',  // Send httpOnly cookies
      });
      if (res.ok) {
        const data = await res.json();
        // Update user data
        const userData: AuthUser = {
          id: data.id,
          email: data.email,
          name: data.name,
          avatar_url: data.avatar_url,
        };
        setUser(userData);
        setUserData(userData);
        
        if (data.birth_info) {
          setBirthInfo(data.birth_info);
          localStorage.setItem('kys_birth_info', JSON.stringify(data.birth_info));
        }
        return true;
      } else {
        // Backend says not authenticated (401) - user is NOT logged in
        return false;
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      return false;
    }
  }, []);

  // Helper to read kys_user from cookie
  const getUserFromCookie = useCallback((): AuthUser | null => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/kys_user=([^;]+)/);
    if (!match) return null;
    try {
      return JSON.parse(decodeURIComponent(match[1]));
    } catch {
      return null;
    }
  }, []);

  // Verify auth on mount (client-side only)
  useEffect(() => {
    async function init() {
      // Quick UI: Check for kys_user cookie for immediate display
      const cookieMatch = document.cookie.match(/kys_user=([^;]+)/);
      if (cookieMatch) {
        try {
          const cookieUser = JSON.parse(decodeURIComponent(cookieMatch[1]));
          setUser(cookieUser);  // Show UI immediately
        } catch {
          // Cookie parse failed
        }
      } else {
        // Fallback: check localStorage for quick UI
        const storedUser = getStoredUser();
        if (storedUser) {
          setUser(storedUser);
        }
      }
      
      // Always verify with backend to ensure auth is valid
      const isValid = await fetchProfile();
      
      if (!isValid) {
        // Backend says not authenticated - clear everything
        setUser(null);
        setBirthInfo(null);
        localStorage.removeItem('kys_user');
        localStorage.removeItem('kys_birth_info');
        // Clear cookies
        document.cookie = 'kys_user=; path=/; domain=.selfkit.art; max-age=0';
        document.cookie = 'kys_auth=; path=/; domain=.selfkit.art; max-age=0';
        document.cookie = 'kys_user=; path=/; max-age=0';
        document.cookie = 'kys_auth=; path=/; max-age=0';
      }
      
      setLoading(false);
    }
    init();
  }, [fetchProfile]);

  // Listen for storage changes (login from another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'kys_user') {
        if (e.newValue) {
          const storedUser = JSON.parse(e.newValue);
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
    await fetchProfile();
  }, [fetchProfile]);

  const updateBirthInfo = useCallback(async (info: BirthInfo): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',  // Send httpOnly cookies
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

  const logout = useCallback(async () => {
    await clearAuth();
    setUser(null);
    setBirthInfo(null);
    localStorage.removeItem('kys_birth_info');
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      birthInfo,
      loading,
      isAuthenticated: !!user,
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
