/**
 * Auth utilities - re-exports from google-auth
 * 
 * Note: Tokens are stored in httpOnly cookies (not accessible from JS)
 * Only user info is stored in localStorage for UI display
 */

export {
  getStoredUser,
  setUserData,
  clearAuth,
  isLoggedIn,
  logout,
  verifyAuth,
  type AuthUser,
} from './google-auth';
