/**
 * Google Sign-In (GSI) - httpOnly Cookie Auth
 * Tokens are stored in httpOnly cookies by the backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://selfkit-backend-129518505568.asia-northeast1.run.app/api/v1';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

// User storage (only user info, NOT tokens - tokens are in httpOnly cookies)
const USER_KEY = 'kys_user';

// Cached config
let cachedConfig: { google_client_id: string } | null = null;

/**
 * Get stored user info (NOT the token - that's in httpOnly cookie)
 */
export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(USER_KEY);
  return stored ? JSON.parse(stored) : null;
}

/**
 * Store user info locally (for UI display only)
 */
export function setUserData(user: AuthUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Clear local user data and call logout endpoint to clear cookies
 */
export async function clearAuth(): Promise<void> {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_KEY);
  
  // Call backend to clear httpOnly cookies
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (e) {
    console.error('Logout error:', e);
  }
}

/**
 * Check if user is logged in by checking stored user data
 * Note: actual auth is verified by backend via httpOnly cookie
 */
export function isLoggedIn(): boolean {
  return !!getStoredUser();
}

/**
 * Verify auth status with backend (checks httpOnly cookie)
 */
export async function verifyAuth(): Promise<AuthUser | null> {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      credentials: 'include',
    });
    if (!response.ok) {
      // Not authenticated - clear local user data
      localStorage.removeItem(USER_KEY);
      return null;
    }
    const data = await response.json();
    const user: AuthUser = {
      id: data.id,
      email: data.email,
      name: data.name,
      avatar_url: data.avatar_url,
    };
    setUserData(user);
    return user;
  } catch {
    return null;
  }
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
          if (!response.credential) {
            onError('Google 登入失敗：未收到憑證');
            return;
          }
          
          // Send credential to backend - it will set httpOnly cookies
          const result = await verifyGoogleToken(response.credential);
          
          if (!result.user) {
            onError('登入失敗');
            return;
          }
          
          // Store user info for UI (token is in httpOnly cookie)
          setUserData(result.user);
          onSuccess(result.user);
        } catch (err) {
          console.error('[GSI] Error:', err);
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
 * Backend sets httpOnly cookies, we only get user info back
 */
async function verifyGoogleToken(idToken: string): Promise<{ user: AuthUser }> {
  const response = await fetch(`${API_URL}/auth/google/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_token: idToken }),
    credentials: 'include',  // Important: allow cookies to be set
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Google 驗證失敗');
  }

  return response.json();
}

/**
 * Logout - clear local data and server cookies
 */
export async function logout(): Promise<void> {
  await clearAuth();
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
