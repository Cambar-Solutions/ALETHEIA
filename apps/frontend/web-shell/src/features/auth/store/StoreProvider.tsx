'use client';

import { type ReactNode, useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { loadAuth } from '../lib/persist';
import { loginAs } from './authSlice';
import { type AppStore, makeStore } from './store';

export function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  // Hidrata el rol persistido (localStorage) tras montar en cliente.
  useEffect(() => {
    const role = loadAuth();
    if (role) storeRef.current?.dispatch(loginAs(role));
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
