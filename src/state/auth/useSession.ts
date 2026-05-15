import { useContext } from 'react';
import { SessionContext } from './SessionContext';

export function useSession() {
  const context = useContext(SessionContext);
  if (context.isFallbackContext) {
    throw new Error('useSession must be used within SessionProvider.');
  }
  return context;
}
