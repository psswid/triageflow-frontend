import { createContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import type { MeResponse } from '../../api/types';

interface AuthState {
  readonly isAuthenticated: boolean;
  readonly isAdmin: boolean;
  readonly token: string | null;
  readonly isLoading: boolean;
}

interface ImpersonationState {
  readonly isImpersonating: boolean;
  readonly impersonatedEmail: string | null;
  readonly originalToken: string | null;
}

interface AuthContextValue extends AuthState {
  readonly login: (token: string) => void;
  readonly logout: () => void;
  readonly isImpersonating: boolean;
  readonly impersonatedEmail: string | null;
  readonly impersonate: (token: string, email: string) => void;
  readonly exitImpersonation: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  readonly children: ReactNode;
}

interface JwtPayload {
  readonly roles?: readonly string[];
  readonly exp?: number;
}

function decodeIsAdmin(token: string): boolean {
  const raw = JSON.parse(atob(token.split('.')[1]!)) as JwtPayload;
  return raw.roles?.includes('ROLE_ADMIN') ?? false;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(() => {
    const token = localStorage.getItem('jwt_token');
    if (!token) return { isAuthenticated: false, isAdmin: false, token: null, isLoading: false };

    try {
      const payload = JSON.parse(atob(token.split('.')[1]!)) as JwtPayload;
      // Client-side expiry check: if expired, clear immediately without API call
      if (payload.exp && typeof payload.exp === 'number' && payload.exp < Math.floor(Date.now() / 1000)) {
        localStorage.removeItem('jwt_token');
        sessionStorage.removeItem('jwt_original');
        sessionStorage.removeItem('impersonated');
        return { isAuthenticated: false, isAdmin: false, token: null, isLoading: false };
      }
      return { isAuthenticated: true, isAdmin: payload.roles?.includes('ROLE_ADMIN') ?? false, token, isLoading: true };
    } catch {
      return { isAuthenticated: false, isAdmin: false, token: null, isLoading: false };
    }
  });

  const [impersonationState, setImpersonationState] = useState<ImpersonationState>(() => {
    const originalToken = sessionStorage.getItem('jwt_original');
    const impersonatedEmail = sessionStorage.getItem('impersonated');
    if (originalToken && impersonatedEmail) {
      return { isImpersonating: true, impersonatedEmail, originalToken };
    }
    return { isImpersonating: false, impersonatedEmail: null, originalToken: null };
  });

  // Mount-time token validation: verify stored token with GET /api/me
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (!token) return;

    // Client-side JWT expiry check: skip API call if token is already expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]!)) as JwtPayload;
      if (payload.exp && typeof payload.exp === 'number' && payload.exp < Math.floor(Date.now() / 1000)) {
        localStorage.removeItem('jwt_token');
        sessionStorage.removeItem('jwt_original');
        sessionStorage.removeItem('impersonated');
        setState({ isAuthenticated: false, isAdmin: false, token: null, isLoading: false });
        setImpersonationState({ isImpersonating: false, impersonatedEmail: null, originalToken: null });
        return;
      }
    } catch {
      localStorage.removeItem('jwt_token');
      sessionStorage.removeItem('jwt_original');
      sessionStorage.removeItem('impersonated');
      setState({ isAuthenticated: false, isAdmin: false, token: null, isLoading: false });
      setImpersonationState({ isImpersonating: false, impersonatedEmail: null, originalToken: null });
      return;
    }

    apiClient.get<MeResponse>(ENDPOINTS.AUTH.ME)
      .then(() => {
        setState(prev => ({ ...prev, isLoading: false }));
      })
      .catch(() => {
        localStorage.removeItem('jwt_token');
        sessionStorage.removeItem('jwt_original');
        sessionStorage.removeItem('impersonated');
        setState({ isAuthenticated: false, isAdmin: false, token: null, isLoading: false });
        setImpersonationState({ isImpersonating: false, impersonatedEmail: null, originalToken: null });
      });
  }, []);

  const login = useCallback((token: string) => {
    localStorage.setItem('jwt_token', token);
    setState({ isAuthenticated: true, isAdmin: decodeIsAdmin(token), token, isLoading: false });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('jwt_token');
    sessionStorage.removeItem('jwt_original');
    sessionStorage.removeItem('impersonated');
    setState({ isAuthenticated: false, isAdmin: false, token: null, isLoading: false });
    setImpersonationState({ isImpersonating: false, impersonatedEmail: null, originalToken: null });
  }, []);

  const impersonate = useCallback((token: string, email: string) => {
    const adminToken = localStorage.getItem('jwt_token');
    if (adminToken) {
      sessionStorage.setItem('jwt_original', adminToken);
    }
    sessionStorage.setItem('impersonated', email);
    localStorage.setItem('jwt_token', token);
    setState({ isAuthenticated: true, isAdmin: decodeIsAdmin(token), token, isLoading: false });
    setImpersonationState({
      isImpersonating: true,
      impersonatedEmail: email,
      originalToken: adminToken,
    });
  }, []);

  const exitImpersonation = useCallback(() => {
    const originalToken = sessionStorage.getItem('jwt_original');
    if (originalToken) {
      localStorage.setItem('jwt_token', originalToken);
      setState({
        isAuthenticated: true,
        isAdmin: decodeIsAdmin(originalToken),
        token: originalToken,
        isLoading: false,
      });
    } else {
      localStorage.removeItem('jwt_token');
      setState({ isAuthenticated: false, isAdmin: false, token: null, isLoading: false });
    }
    sessionStorage.removeItem('jwt_original');
    sessionStorage.removeItem('impersonated');
    setImpersonationState({
      isImpersonating: false,
      impersonatedEmail: null,
      originalToken: null,
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        isImpersonating: impersonationState.isImpersonating,
        impersonatedEmail: impersonationState.impersonatedEmail,
        impersonate,
        exitImpersonation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
