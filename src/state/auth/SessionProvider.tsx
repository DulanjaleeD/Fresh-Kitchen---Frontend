import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { authGateway } from '../../infra/services/authGateway';
import { userGateway } from '../../infra/services/userGateway';
import type { LoginPayload, RegisterPayload } from '../../type/auth';
import type { UserProfile } from '../../type/types';
import { SessionContext } from './SessionContext';
import { readIdentity } from './token';

export function SessionProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrate = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const identity = readIdentity(token);
      if (!identity) {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const profile = await userGateway.findByEmail(identity.email);
        if (!profile) {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        } else {
          setUser(profile);
        }
      } catch {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    queueMicrotask(() => {
      void hydrate();
    });
  }, [token]);

  const login = async (payload: LoginPayload) => {
    const response = await authGateway.login(payload);
    localStorage.setItem('token', response.token);
    setToken(response.token);
  };

  const register = async (payload: RegisterPayload) => {
    await authGateway.register(payload);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, isAuthenticated: Boolean(token && user), loading, login, register, logout }),
    [token, user, loading],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
