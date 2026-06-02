'use client';

import { useEffect, useState } from 'react';
import { type Privilege, ROLE_PRIVILEGES, type Role } from './roles';

function readRoleCookie(): Role | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)aletheia_role=([^;]+)/);
  return (match?.[1] as Role) ?? null;
}

/**
 * Lee el rol activo desde la cookie `aletheia_role` (la pone el web-shell).
 * Pensado para los microfrontends, que no comparten el store Redux del host.
 */
export function useRole() {
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    setRole(readRoleCookie());
  }, []);

  const privileges = role ? ROLE_PRIVILEGES[role] : [];
  const can = (p: Privilege) => privileges.includes(p);

  return { role, privileges, can };
}
