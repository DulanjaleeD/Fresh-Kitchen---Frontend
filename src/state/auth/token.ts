import { jwtDecode } from 'jwt-decode';
import type { UserRole } from '../../type/types';

interface Claims {
  sub?: string;
  role?: string;
}

function parseRole(raw?: string): UserRole {
  if (raw?.includes('ADMIN')) return 'ADMIN';
  return 'CUSTOMER';
}

export function readIdentity(token: string | null): { email: string; role: UserRole } | null {
  if (!token) return null;

  try {
    const claims = jwtDecode<Claims>(token);
    if (!claims.sub) return null;
    return { email: claims.sub, role: parseRole(claims.role) };
  } catch {
    return null;
  }
}
