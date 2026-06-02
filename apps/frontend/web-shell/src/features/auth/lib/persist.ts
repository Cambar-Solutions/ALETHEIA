import type { Role } from '../data/roles';

const KEY = 'aletheia_auth';

/** Persiste el rol en localStorage (host) y en cookie (compartible con MFs en prod). */
export function saveAuth(role: Role) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify({ role }));
  document.cookie = `aletheia_role=${role}; path=/; max-age=86400; SameSite=Lax`;
}

export function clearAuth() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
  document.cookie = 'aletheia_role=; path=/; max-age=0; SameSite=Lax';
}

export function loadAuth(): Role | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return (JSON.parse(raw) as { role?: Role }).role ?? null;
  } catch {
    return null;
  }
}
