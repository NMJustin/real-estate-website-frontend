import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getApiBaseUrl, sanitizeUrl, isApiConfigValid } from '../config/api';

const API_BASE = getApiBaseUrl();
const TOKEN_KEY = 'admin_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  phone?: string | null;
}

interface AuthContextValue {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  userLogin: (email: string, password: string) => Promise<AdminUser>;
  userRegister: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (name: string, phone: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Validate API configuration on mount
  useEffect(() => {
    isApiConfigValid();
  }, []);

  // On mount: restore session from stored token
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    setToken(storedToken);
    fetch(sanitizeUrl(API_BASE, '/auth/me'), {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Session expired');
        return res.json();
      })
      .then((body) => {
        const u = body.data;
        const userRole = u.role?.name ?? u.role;
        setUser({
          id: u.id,
          name: u.name,
          email: u.email,
          role: userRole,
          phone: u.phone ?? null,
        });
        setToken(storedToken);
        // Store role for redirect on token expiration
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_role', JSON.stringify(userRole));
        }
      })
      .catch(async () => {
        // Attempt refresh before expiring session
        if (typeof window !== 'undefined') {
          const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
          if (storedRefreshToken) {
            try {
              const refreshRes = await fetch(sanitizeUrl(API_BASE, '/auth/refresh'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: storedRefreshToken }),
              });
              const refreshBody = await refreshRes.json();
              if (refreshRes.ok && refreshBody.data?.token) {
                const refreshedJwt = refreshBody.data.token;
                const newRefreshToken = refreshBody.data.refreshToken;
                const refreshedUser = refreshBody.data.user;
                localStorage.setItem(TOKEN_KEY, refreshedJwt);
                if (newRefreshToken) {
                  localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
                }
                const refreshedRole = refreshedUser?.role?.name ?? refreshedUser?.role;
                localStorage.setItem('user_role', JSON.stringify(refreshedRole));
                setToken(refreshedJwt);
                setUser({
                  id: refreshedUser.id,
                  name: refreshedUser.name,
                  email: refreshedUser.email,
                  role: refreshedRole,
                  phone: refreshedUser.phone ?? null,
                });
                return;
              }
            } catch {
              // Refresh failed, proceed to logout cleanup
            }
          }

          const currentPathname = window.location.pathname;
          // Determine if we are on a protected route that requires redirection on session expiry
          const isProtectedContext = currentPathname.startsWith('/admin') || currentPathname.startsWith('/portal');
          const isLoginPage = currentPathname === '/admin' || currentPathname === '/portal/login';

          let storedRole: string | null = null;
          try {
            const roleStr = localStorage.getItem('user_role');
            storedRole = roleStr ? JSON.parse(roleStr) : null;
          } catch {
            storedRole = null;
          }

          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
          localStorage.removeItem('user_role');
          localStorage.removeItem('inactivity_logout');

          if (isProtectedContext && !isLoginPage) {
            let target = '/portal/login';
            if (storedRole?.toLowerCase() === 'admin' || currentPathname.startsWith('/admin')) {
              target = '/admin';
            }
            window.location.href = `${target}?session=expired`;
            return;
          }
        }
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem('user_role');
        setToken(null);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(sanitizeUrl(API_BASE, '/auth/admin/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.message || 'Login failed');
    const { token: jwt, refreshToken, user: userData } = body.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, jwt);
      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
      localStorage.setItem('user_role', JSON.stringify(userData.role?.name ?? userData.role));
    }
    setToken(jwt);
    setUser(userData);
  }, []);

  const userLogin = useCallback(async (email: string, password: string): Promise<AdminUser> => {
    const res = await fetch(sanitizeUrl(API_BASE, '/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.message || 'Login failed');
    const { token: jwt, refreshToken, user: userData } = body.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, jwt);
      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
      localStorage.setItem('user_role', JSON.stringify(userData.role?.name ?? userData.role));
    }
    setToken(jwt);
    const authenticatedUser: AdminUser = {
      ...userData,
      role: userData.role?.name ?? userData.role,
      phone: userData.phone ?? null,
    };
    setUser(authenticatedUser);
    return authenticatedUser;
  }, []);

  const userRegister = useCallback(async (name: string, email: string, password: string) => {
    const res = await fetch(sanitizeUrl(API_BASE, '/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.message || 'Registration failed');
    const { token: jwt, refreshToken, user: userData } = body.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, jwt);
      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
      localStorage.setItem('user_role', JSON.stringify(userData.role?.name ?? userData.role));
    }
    setToken(jwt);
    setUser(userData);
  }, []);

  const updateProfile = useCallback(async (name: string, phone: string) => {
    const currentToken = token || (typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null);
    if (!currentToken) throw new Error('You must be signed in to update your profile.');
    const response = await fetch(sanitizeUrl(API_BASE, '/auth/profile'), {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, phone }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.message || 'Unable to update your profile.');
    const profile = body.data as { name?: string | null; phone?: string | null };
    setUser((current) => current ? { ...current, name: profile.name ?? current.name, phone: profile.phone ?? null } : current);
  }, [token]);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem('user_role');
      localStorage.removeItem('inactivity_logout');
    }
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        userLogin,
        userRegister,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
