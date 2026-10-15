import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const TOKEN_KEY = 'admin_token';

// Sanitize URL to avoid double slashes when concatenating base URL and path
const sanitizeUrl = (baseUrl: string, path: string): string => {
	const trimmedBase = baseUrl.replace(/\/+$/, '');
	const trimmedPath = path.replace(/^\/+/, '');
	return `${trimmedBase}/${trimmedPath}`;
};

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
        setUser({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role?.name ?? u.role,
          phone: u.phone ?? null,
        });
        setToken(storedToken);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
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
    const { token: jwt, user: userData } = body.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, jwt);
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
    const { token: jwt, user: userData } = body.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, jwt);
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
    const { token: jwt, user: userData } = body.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, jwt);
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
