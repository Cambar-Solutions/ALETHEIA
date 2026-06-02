'use client';

import { useCallback } from 'react';
import type { Privilege, Role } from '../data/roles';
import { clearAuth, saveAuth } from '../lib/persist';
import { loginAs as loginAction, logout as logoutAction } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store/store';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { role, privileges, isAuthenticated } = useAppSelector((s) => s.auth);

  const loginAs = useCallback(
    (r: Role) => {
      saveAuth(r);
      dispatch(loginAction(r));
    },
    [dispatch],
  );

  const logout = useCallback(() => {
    clearAuth();
    dispatch(logoutAction());
  }, [dispatch]);

  const can = useCallback((p: Privilege) => privileges.includes(p), [privileges]);

  return { role, privileges, isAuthenticated, loginAs, logout, can };
}
