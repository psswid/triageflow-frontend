import { createContext, useState, useCallback, type ReactNode } from 'react';

interface AuthState {
  readonly isAuthenticated: boolean;
  readonly isAdmin: boolean;
  readonly token: string | null;
}

interface AuthContextValue extends AuthState {
  readonly login: (token: string) => void;
  readonly logout: () => void;
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

  const login = useCallback((token: string) => {
    localStorage.setItem('jwt_token', token);
    setState({ isAuthenticated: true, isAdmin: decodeIsAdmin(token), token });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('jwt_token');
    setState({ isAuthenticated: false, isAdmin: false, token: null });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
