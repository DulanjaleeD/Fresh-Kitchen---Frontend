import type { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useSession } from '../../state/auth/useSession';
import type { UserRole } from '../../type/types';

export function RequireSession({ children, role }: { children: ReactNode; role?: UserRole }) {
  const { isAuthenticated, loading, user } = useSession();

  if (loading) return <div className="panel">Preparing your session...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;

  return <>{children}</>;
}
