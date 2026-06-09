import { createContext, useState, useCallback, type ReactNode } from 'react';

interface AuthState {
  readonly isAuthenticated: boolean;
  readonly isAdmin: boolean;
  readonly token: string | null;
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
}

function decodeIsAdmin(token: string): boolean {
  const raw = JSON.parse(atob(token.split('.')[1]!)) as JwtPayload;
  return raw.roles?.includes('ROLE_ADMIN') ?? false;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(() => {
    const token = localStorage.getItem('jwt_token');
    if (!token) return { isAuthenticated: false, isAdmin: false, token: null };

    try {
      return { isAuthenticated: true, isAdmin: decodeIsAdmin(token), token };
    } catch {
      return { isAuthenticated: false, isAdmin: false, token: null };
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

  const login = useCallback((token: string) => {
    localStorage.setItem('jwt_token', token);
    setState({ isAuthenticated: true, isAdmin: decodeIsAdmin(token), token });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('jwt_token');
    sessionStorage.removeItem('jwt_original');
    sessionStorage.removeItem('impersonated');
    setState({ isAuthenticated: false, isAdmin: false, token: null });
    setImpersonationState({ isImpersonating: false, impersonatedEmail: null, originalToken: null });
  }, []);

  const impersonate = useCallback((token: string, email: string) => {
    const adminToken = localStorage.getItem('jwt_token');
    if (adminToken) {
      sessionStorage.setItem('jwt_original', adminToken);
    }
    sessionStorage.setItem('impersonated', email);
    localStorage.setItem('jwt_token', token);
    setState({ isAuthenticated: true, isAdmin: decodeIsAdmin(token), token });
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
      });
    } else {
      localStorage.removeItem('jwt_token');
      setState({ isAuthenticated: false, isAdmin: false, token: null });
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
