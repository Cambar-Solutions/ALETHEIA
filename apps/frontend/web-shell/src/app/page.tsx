'use client';

import { AuthSplash, RoleDashboard, RoleLogin, useAuth } from '@/features/auth';

export default function Home() {
  const { isAuthenticated, hydrated } = useAuth();
  // Mientras no se restaura la sesión persistida, mostramos un splash en vez del
  // login: así volver desde un microfrontend no parpadea a la pantalla de login.
  if (!hydrated) return <AuthSplash />;
  return isAuthenticated ? <RoleDashboard /> : <RoleLogin />;
}
