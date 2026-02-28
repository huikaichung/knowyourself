/**
 * Google Sign-In (GSI) - No API key needed, Client ID from backend config
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://selfkit-backend-129518505568.asia-northeast1.run.app/api/v1';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

// Token storage
const ACCESS_TOKEN_KEY = 'kys_access_token';
const USER_KEY = 'kys_user';

// Cached config
let cachedConfig: { google_client_id: string } | null = null;

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(USER_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function setAuthData(token: string, user: AuthUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  // Set cookie for middleware
  document.cookie = `kys_auth=1; path=/; SameSite=Lax`;
}

export function clearAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = 'kys_auth=; path=/; max-age=0';
}

export function isLoggedIn(): boolean {
  return !!getAccessToken();
}

/**
 * Fetch public config from backend
 */
export async function fetchConfig(): Promise<{ google_client_id: string }> {
  if (cachedConfig) return cachedConfig;
  
  const response = await fetch(`${API_URL}/config/public`);
  if (!response.ok) {
    throw new Error('Failed to fetch config');
  }
  
  cachedConfig = await response.json();
  return cachedConfig!;
}

/**
 * Load Google Identity Services script
 */
export function loadGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Not in browser'));
      return;
    }

    // Already loaded
    if (window.google?.accounts) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google script'));
    document.head.appendChild(script);
  });
}

/**
 * Initialize Google Sign-In button
 */
export async function initGoogleSignIn(
  buttonElement: HTMLElement,
  onSuccess: (user: AuthUser) => void,
  onError: (error: string) => void
): Promise<void> {
  try {
    // Load config and script in parallel
    const [config] = await Promise.all([
      fetchConfig(),
      loadGoogleScript(),
    ]);
    
    if (!config.google_client_id) {
      onError('Google 登入尚未設定');
      return;
    }

    if (!window.google?.accounts) {
      onError('Google Sign-In 載入失敗');
      return;
    }

    window.google.accounts.id.initialize({
      client_id: config.google_client_id,
      callback: async (response: { credential: string }) => {
        try {
          // Send credential to backend for verification
          const result = await verifyGoogleToken(response.credential);
          setAuthData(result.access_token, result.user);
          onSuccess(result.user);
        } catch (err) {
          onError(err instanceof Error ? err.message : '登入失敗');
        }
      },
    });

    window.google.accounts.id.renderButton(buttonElement, {
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      locale: 'zh-TW',
      width: 300,
    });
  } catch (err) {
    onError(err instanceof Error ? err.message : '初始化失敗');
  }
}

/**
 * Verify Google ID token with backend
 */
async function verifyGoogleToken(idToken: string): Promise<{ access_token: string; user: AuthUser }> {
  const response = await fetch(`${API_URL}/auth/google/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_token: idToken }),
    mode: 'cors',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Google 驗證失敗');
  }

  return response.json();
}

/**
 * Logout
 */
export function logout(): void {
  clearAuth();
  // Also revoke Google session if available
  if (window.google?.accounts) {
    window.google.accounts.id.disableAutoSelect();
  }
}

// Type declarations for Google Identity Services
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              theme?: string;
              size?: string;
              text?: string;
              locale?: string;
              width?: number;
            }
          ) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}
