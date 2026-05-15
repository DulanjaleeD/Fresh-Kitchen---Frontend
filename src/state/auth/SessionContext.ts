import { createContext } from 'react';
import type { LoginPayload, RegisterPayload } from '../../type/auth';
import type { UserProfile } from '../../type/types';

export interface SessionContextShape {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  isFallbackContext?: true;
}

const MISSING_PROVIDER_ERROR = 'SessionProvider is missing in the component tree.';

export const defaultSessionContext: SessionContextShape = {
  token: null,
  user: null,
  isAuthenticated: false,
  loading: false,
  isFallbackContext: true,
  login: async () => {
    throw new Error(MISSING_PROVIDER_ERROR);
  },
  register: async () => {
    throw new Error(MISSING_PROVIDER_ERROR);
  },
  logout: () => {
    throw new Error(MISSING_PROVIDER_ERROR);
  },
};

export const SessionContext = createContext<SessionContextShape>(defaultSessionContext);
