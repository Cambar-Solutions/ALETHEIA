'use client';

import { RoleDashboard, RoleLogin, useAuth } from '@/features/auth';

export default function Home() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <RoleDashboard /> : <RoleLogin />;
}
