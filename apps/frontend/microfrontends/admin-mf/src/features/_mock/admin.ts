'use client';

// Capa de datos MOCK del microfrontend admin-mf.
// Sin backend: el estado vive en React + se persiste en localStorage (`aletheia_admin`).
// Tipos y código en inglés; los datos semilla (labels visibles) en español.

import type { Role } from '@aletheia/frontend-commons';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'aletheia_admin';

// ─── Domain types ──────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  areaId: string;
  roles: Role[];
  active: boolean;
}

export interface Area {
  id: string;
  name: string;
  active: boolean;
}

export interface Apoderado {
  id: string;
  name: string;
  power: string; // descripción del poder legal
  active: boolean;
}

export interface WorkflowStage {
  id: string;
  name: string;
  role: Role;
  slaHours: number;
  order: number;
}

export interface AdminState {
  users: User[];
  areas: Area[];
  apoderados: Apoderado[];
  workflowStages: WorkflowStage[];
}

// ─── Seed data ─────────────────────────────────────────────────────────────
function seed(): AdminState {
  const areas: Area[] = [
    { id: 'area-compras', name: 'Compras', active: true },
    { id: 'area-legal', name: 'Legal', active: true },
    { id: 'area-rrhh', name: 'RRHH', active: true },
    { id: 'area-finanzas', name: 'Finanzas', active: true },
  ];

  const users: User[] = [
    {
      id: 'usr-1',
      name: 'Ana Martínez',
      email: 'ana.martinez@aletheia.mx',
      areaId: 'area-compras',
      roles: ['SOLICITANTE'],
      active: true,
    },
    {
      id: 'usr-2',
      name: 'Carlos Ruiz',
      email: 'carlos.ruiz@aletheia.mx',
      areaId: 'area-legal',
      roles: ['ADMINISTRADOR'],
      active: true,
    },
    {
      id: 'usr-3',
      name: 'Lucía Fernández',
      email: 'lucia.fernandez@aletheia.mx',
      areaId: 'area-legal',
      roles: ['ABOGADO', 'APROBADOR'],
      active: true,
    },
    {
      id: 'usr-4',
      name: 'Miguel Torres',
      email: 'miguel.torres@aletheia.mx',
      areaId: 'area-finanzas',
      roles: ['APROBADOR'],
      active: true,
    },
    {
      id: 'usr-5',
      name: 'Sofía Ramírez',
      email: 'sofia.ramirez@aletheia.mx',
      areaId: 'area-rrhh',
      roles: ['FIRMANTE'],
      active: false,
    },
    {
      id: 'usr-6',
      name: 'Jorge Delgado',
      email: 'jorge.delgado@aletheia.mx',
      areaId: 'area-compras',
      roles: ['SOLICITANTE', 'FIRMANTE'],
      active: true,
    },
  ];

  const apoderados: Apoderado[] = [
    {
      id: 'apo-1',
      name: 'Roberto Salinas',
      power: 'Poder general para actos de administración y dominio.',
      active: true,
    },
    {
      id: 'apo-2',
      name: 'Patricia Vega',
      power: 'Poder especial para suscripción de contratos hasta $5,000,000 MXN.',
      active: true,
    },
    {
      id: 'apo-3',
      name: 'Fernando Ibarra',
      power: 'Poder para pleitos y cobranzas.',
      active: false,
    },
  ];

  const workflowStages: WorkflowStage[] = [
    { id: 'stg-1', name: 'Revisión Admin', role: 'ADMINISTRADOR', slaHours: 24, order: 1 },
    { id: 'stg-2', name: 'Revisión Abogado', role: 'ABOGADO', slaHours: 48, order: 2 },
    { id: 'stg-3', name: 'Aprobación', role: 'APROBADOR', slaHours: 24, order: 3 },
    { id: 'stg-4', name: 'Firma', role: 'FIRMANTE', slaHours: 12, order: 4 },
  ];

  return { users, areas, apoderados, workflowStages };
}

// ─── Persistence ───────────────────────────────────────────────────────────
function read(): AdminState {
  if (typeof window === 'undefined') return seed();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const fresh = seed();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      return fresh;
    }
    return JSON.parse(raw) as AdminState;
  } catch {
    return seed();
  }
}

function write(state: AdminState) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  // Notifica a otros hooks montados en la misma pestaña.
  window.dispatchEvent(new Event('aletheia_admin_change'));
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

// Hook base: estado sincronizado con localStorage y entre secciones.
function useAdminState(): [AdminState, (updater: (s: AdminState) => AdminState) => void] {
  const [state, setState] = useState<AdminState>(() =>
    typeof window === 'undefined' ? seed() : read(),
  );

  useEffect(() => {
    // Hidrata desde localStorage tras el montaje (evita mismatch SSR).
    setState(read());
    const sync = () => setState(read());
    window.addEventListener('aletheia_admin_change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('aletheia_admin_change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const update = useCallback((updater: (s: AdminState) => AdminState) => {
    setState((prev) => {
      const next = updater(prev);
      write(next);
      return next;
    });
  }, []);

  return [state, update];
}

// ─── Users ─────────────────────────────────────────────────────────────────
export function useUsers() {
  const [state, update] = useAdminState();

  const create = useCallback(
    (data: Omit<User, 'id'>) =>
      update((s) => ({ ...s, users: [...s.users, { ...data, id: uid('usr') }] })),
    [update],
  );

  const updateUser = useCallback(
    (id: string, data: Partial<Omit<User, 'id'>>) =>
      update((s) => ({
        ...s,
        users: s.users.map((u) => (u.id === id ? { ...u, ...data } : u)),
      })),
    [update],
  );

  const toggleActive = useCallback(
    (id: string) =>
      update((s) => ({
        ...s,
        users: s.users.map((u) => (u.id === id ? { ...u, active: !u.active } : u)),
      })),
    [update],
  );

  return { users: state.users, areas: state.areas, create, update: updateUser, toggleActive };
}

// ─── Areas ─────────────────────────────────────────────────────────────────
export function useAreas() {
  const [state, update] = useAdminState();

  const create = useCallback(
    (data: Omit<Area, 'id'>) =>
      update((s) => ({ ...s, areas: [...s.areas, { ...data, id: uid('area') }] })),
    [update],
  );

  const updateArea = useCallback(
    (id: string, data: Partial<Omit<Area, 'id'>>) =>
      update((s) => ({
        ...s,
        areas: s.areas.map((a) => (a.id === id ? { ...a, ...data } : a)),
      })),
    [update],
  );

  const toggleActive = useCallback(
    (id: string) =>
      update((s) => ({
        ...s,
        areas: s.areas.map((a) => (a.id === id ? { ...a, active: !a.active } : a)),
      })),
    [update],
  );

  return { areas: state.areas, create, update: updateArea, toggleActive };
}

// ─── Apoderados ────────────────────────────────────────────────────────────
export function useApoderados() {
  const [state, update] = useAdminState();

  const create = useCallback(
    (data: Omit<Apoderado, 'id'>) =>
      update((s) => ({ ...s, apoderados: [...s.apoderados, { ...data, id: uid('apo') }] })),
    [update],
  );

  const updateApoderado = useCallback(
    (id: string, data: Partial<Omit<Apoderado, 'id'>>) =>
      update((s) => ({
        ...s,
        apoderados: s.apoderados.map((a) => (a.id === id ? { ...a, ...data } : a)),
      })),
    [update],
  );

  const toggleActive = useCallback(
    (id: string) =>
      update((s) => ({
        ...s,
        apoderados: s.apoderados.map((a) => (a.id === id ? { ...a, active: !a.active } : a)),
      })),
    [update],
  );

  return { apoderados: state.apoderados, create, update: updateApoderado, toggleActive };
}

// ─── Workflow stages ───────────────────────────────────────────────────────
export function useWorkflowStages() {
  const [state, update] = useAdminState();
  const stages = [...state.workflowStages].sort((a, b) => a.order - b.order);

  const create = useCallback(
    (data: Omit<WorkflowStage, 'id' | 'order'>) =>
      update((s) => {
        const nextOrder = s.workflowStages.reduce((max, st) => Math.max(max, st.order), 0) + 1;
        return {
          ...s,
          workflowStages: [...s.workflowStages, { ...data, id: uid('stg'), order: nextOrder }],
        };
      }),
    [update],
  );

  const updateStage = useCallback(
    (id: string, data: Partial<Omit<WorkflowStage, 'id' | 'order'>>) =>
      update((s) => ({
        ...s,
        workflowStages: s.workflowStages.map((st) => (st.id === id ? { ...st, ...data } : st)),
      })),
    [update],
  );

  const remove = useCallback(
    (id: string) =>
      update((s) => {
        const remaining = s.workflowStages
          .filter((st) => st.id !== id)
          .sort((a, b) => a.order - b.order)
          .map((st, i) => ({ ...st, order: i + 1 }));
        return { ...s, workflowStages: remaining };
      }),
    [update],
  );

  // Reordena moviendo una etapa hacia arriba (-1) o abajo (+1).
  const move = useCallback(
    (id: string, direction: 'up' | 'down') =>
      update((s) => {
        const ordered = [...s.workflowStages].sort((a, b) => a.order - b.order);
        const idx = ordered.findIndex((st) => st.id === id);
        if (idx === -1) return s;
        const target = direction === 'up' ? idx - 1 : idx + 1;
        if (target < 0 || target >= ordered.length) return s;
        [ordered[idx], ordered[target]] = [ordered[target], ordered[idx]];
        const renumbered = ordered.map((st, i) => ({ ...st, order: i + 1 }));
        return { ...s, workflowStages: renumbered };
      }),
    [update],
  );

  return { stages, create, update: updateStage, remove, move };
}
