/**
 * Auth utilities for knowyourself - Firebase Auth
 */

import { 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from './firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://selfkit-backend-129518505568.asia-northeast1.run.app/api/v1';

// Re-export for checking
export { isFirebaseConfigured };

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  firebaseUser?: User;
}

// Token storage keys
const ACCESS_TOKEN_KEY = 'kys_access_token';

/**
 * Get stored access token
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Store token
 */
export function setAccessToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  // Set cookie for middleware auth check (session-only)
  document.cookie = `kys_auth=1; path=/; SameSite=Lax`;
}

/**
 * Clear tokens (logout)
 */
export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  // Clear auth cookie
  document.cookie = 'kys_auth=; path=/; max-age=0';
}

/**
 * Check if user is logged in
 */
export function isLoggedIn(): boolean {
  return !!getAccessToken();
}

/**
 * Sign in with Google using Firebase Auth
 */
export async function signInWithGoogle(): Promise<AuthUser> {
  if (!auth || !googleProvider) {
    throw new Error('Firebase Auth 尚未設定');
  }
  
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  
  // Get Firebase ID token
  const idToken = await user.getIdToken();
  
  // Exchange Firebase token for our backend token
  const response = await fetch(`${API_URL}/auth/firebase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_token: idToken }),
  });

  if (!response.ok) {
    // If backend doesn't support Firebase auth yet, just use Firebase directly
    setAccessToken(idToken);
    return {
      id: user.uid,
      email: user.email || '',
      name: user.displayName || undefined,
      avatar_url: user.photoURL || undefined,
      firebaseUser: user,
    };
  }

  const data = await response.json();
  setAccessToken(data.access_token || idToken);
  
  return {
    id: user.uid,
    email: user.email || '',
    name: user.displayName || undefined,
    avatar_url: user.photoURL || undefined,
    firebaseUser: user,
  };
}

/**
 * Subscribe to auth state changes
 */
export function subscribeToAuthState(callback: (user: AuthUser | null) => void): () => void {
  if (!auth) {
    // Firebase not configured, return no-op unsubscribe
    callback(null);
    return () => {};
  }
  
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const idToken = await firebaseUser.getIdToken();
      setAccessToken(idToken);
      callback({
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || undefined,
        avatar_url: firebaseUser.photoURL || undefined,
        firebaseUser,
      });
    } else {
      clearTokens();
      callback(null);
    }
  });
}

/**
 * Logout
 */
export async function logout(): Promise<void> {
  if (auth) {
    await firebaseSignOut(auth);
  }
  clearTokens();
}

/**
 * Get current Firebase user
 */
export function getCurrentFirebaseUser(): User | null {
  return auth?.currentUser || null;
}

/**
 * Refresh token
 */
export async function refreshToken(): Promise<string | null> {
  const user = auth?.currentUser;
  if (!user) return null;
  
  const token = await user.getIdToken(true);
  setAccessToken(token);
  return token;
}
