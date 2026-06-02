'use client';

import type { ReactNode } from 'react';
import type { Privilege } from './roles';
import { useRole } from './useRole';

interface PrivilegeGuardProps {
  privilege: Privilege;
  children: ReactNode;
  fallback?: ReactNode;
}

/** Guard basado en cookie (para microfrontends). Renderiza si hay privilegio. */
export function PrivilegeGuard({ privilege, children, fallback = null }: PrivilegeGuardProps) {
  const { can } = useRole();
  return can(privilege) ? <>{children}</> : <>{fallback}</>;
}
