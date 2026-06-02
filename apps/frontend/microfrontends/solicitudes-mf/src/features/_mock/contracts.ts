// Mock domain layer for solicitudes-mf (CLM).
// No backend: a React-state store persisted to localStorage under
// `aletheia_solicitudes`. `useContracts()` exposes read/create/update with an
// automatic audit-trail (bitácora) entry on every mutation.

'use client';

import * as React from 'react';

/* ─── Domain types ───────────────────────────────────────────────────── */

export type ContractStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'ADMIN_REVIEW'
  | 'LAWYER_REVIEW'
  | 'APPROVAL_PENDING'
  | 'SIGNING'
  | 'SIGNED'
  | 'CANCELLED'
  | 'REJECTED';

export type ProviderType = 'PERSONA_FISICA' | 'PERSONA_MORAL';

export interface AuditEntry {
  /** Action label in Spanish (e.g. "Creó la solicitud"). */
  action: string;
  /** Display name of the user who performed the action. */
  user: string;
  /** ISO timestamp. */
  date: string;
  /** Optional free-text note (e.g. cancellation reason). */
  note?: string;
}

export interface Contract {
  id: string;
  folio: string;
  title: string;
  society: string;
  providerName: string;
  providerEmail: string;
  providerType: ProviderType;
  area: string;
  status: ContractStatus;
  createdAt: string;
  updatedAt: string;
  log: AuditEntry[];
}

/* ─── Catalogs (mock) ────────────────────────────────────────────────── */

export const SOCIETIES = [
  'Grupo Aletheia S.A. de C.V.',
  'Aletheia Servicios S.A. de C.V.',
  'Corporativo Levsek S.A. de C.V.',
  'Inmobiliaria del Norte S.A. de C.V.',
] as const;

export const AREAS = [
  'Compras',
  'Legal',
  'RRHH',
  'Finanzas',
  'IT',
  'Logística',
  'Infraestructura',
] as const;

/** Area the CONTRACT_VIEW_AREA-only user is bound to (mock). */
export const USER_AREA = 'Compras';

export const PROVIDER_TYPE_LABEL: Record<ProviderType, string> = {
  PERSONA_FISICA: 'Persona Física',
  PERSONA_MORAL: 'Persona Moral',
};

/** Required documents per provider type (informational only in this MF). */
export const REQUIRED_DOCS: Record<ProviderType, string[]> = {
  PERSONA_FISICA: [
    'INE',
    'RFC',
    'CURP',
    'Comprobante de domicilio',
    'Cédula fiscal',
    'Carátula de estado de cuenta',
  ],
  PERSONA_MORAL: [
    'RFC',
    'Comprobante de domicilio',
    'Acta Constitutiva',
    'Poder Notarial',
    'Cédula fiscal',
    'Carátula de estado de cuenta',
  ],
};

/* ─── Status metadata ────────────────────────────────────────────────── */

export const STATUS_LABEL: Record<ContractStatus, string> = {
  DRAFT: 'Borrador',
  SUBMITTED: 'Enviada',
  ADMIN_REVIEW: 'Revisión Admin.',
  LAWYER_REVIEW: 'Revisión Legal',
  APPROVAL_PENDING: 'Pend. Aprobación',
  SIGNING: 'En Firma',
  SIGNED: 'Firmada',
  CANCELLED: 'Cancelada',
  REJECTED: 'Rechazada',
};

/** Tailwind classes for the status pill (neobrutalism palette). */
export const STATUS_COLOR: Record<ContractStatus, string> = {
  DRAFT: 'bg-secondary-background text-foreground',
  SUBMITTED: 'bg-main text-main-foreground',
  ADMIN_REVIEW: 'bg-yellow-400 text-black',
  LAWYER_REVIEW: 'bg-orange-400 text-black',
  APPROVAL_PENDING: 'bg-blue-400 text-black',
  SIGNING: 'bg-purple-400 text-black',
  SIGNED: 'bg-green-500 text-white',
  CANCELLED: 'bg-zinc-400 text-black',
  REJECTED: 'bg-red-500 text-white',
};

export const STATUS_ORDER: ContractStatus[] = [
  'DRAFT',
  'SUBMITTED',
  'ADMIN_REVIEW',
  'LAWYER_REVIEW',
  'APPROVAL_PENDING',
  'SIGNING',
  'SIGNED',
];

/* ─── SLA semaphore (simulated) ──────────────────────────────────────── */

export type SlaLevel = 'green' | 'yellow' | 'red';

export const SLA_META: Record<SlaLevel, { label: string; dot: string; text: string }> = {
  green: { label: 'En tiempo', dot: 'bg-green-500', text: 'text-green-700' },
  yellow: { label: 'Por vencer', dot: 'bg-yellow-400', text: 'text-yellow-700' },
  red: { label: 'Vencido', dot: 'bg-red-500', text: 'text-red-700' },
};

/**
 * Simulated SLA: terminal states are always green; otherwise derive a level
 * from how long the contract has been sitting since its last update.
 */
export function computeSla(contract: Contract): SlaLevel {
  if (contract.status === 'SIGNED') return 'green';
  if (contract.status === 'CANCELLED' || contract.status === 'REJECTED') return 'green';
  if (contract.status === 'DRAFT') return 'green';

  const days = Math.floor(
    (Date.now() - new Date(contract.updatedAt).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (days >= 5) return 'red';
  if (days >= 2) return 'yellow';
  return 'green';
}

/* ─── Seed data ──────────────────────────────────────────────────────── */

const STORAGE_KEY = 'aletheia_solicitudes';

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
}

function seedContracts(): Contract[] {
  return [
    {
      id: 'c-0042',
      folio: 'FOLIO-2026-001',
      title: 'Suministro de equipo de cómputo',
      society: 'Grupo Aletheia S.A. de C.V.',
      providerName: 'TechCorp México S.A. de C.V.',
      providerEmail: 'contratos@techcorp.mx',
      providerType: 'PERSONA_MORAL',
      area: 'Compras',
      status: 'ADMIN_REVIEW',
      createdAt: daysAgo(8),
      updatedAt: daysAgo(3),
      log: [
        { action: 'Creó la solicitud', user: 'Laura Méndez', date: daysAgo(8) },
        { action: 'Envió a revisión', user: 'Laura Méndez', date: daysAgo(4) },
        { action: 'Tomó en revisión administrativa', user: 'Admin Sistema', date: daysAgo(3) },
      ],
    },
    {
      id: 'c-0041',
      folio: 'FOLIO-2026-002',
      title: 'Servicio de transporte y logística',
      society: 'Corporativo Levsek S.A. de C.V.',
      providerName: 'Distribuidora Norte S.A. de C.V.',
      providerEmail: 'ventas@distnorte.com.mx',
      providerType: 'PERSONA_MORAL',
      area: 'Logística',
      status: 'SIGNED',
      createdAt: daysAgo(30),
      updatedAt: daysAgo(2),
      log: [
        { action: 'Creó la solicitud', user: 'Pedro Salas', date: daysAgo(30) },
        { action: 'Envió a revisión', user: 'Pedro Salas', date: daysAgo(28) },
        { action: 'Aprobó el contrato', user: 'Mónica Reyes', date: daysAgo(6) },
        { action: 'Firmó el contrato', user: 'Director General', date: daysAgo(2) },
      ],
    },
    {
      id: 'c-0040',
      folio: 'FOLIO-2026-003',
      title: 'Consultoría en reclutamiento especializado',
      society: 'Aletheia Servicios S.A. de C.V.',
      providerName: 'Ana García López',
      providerEmail: 'ana.garcia@gmail.com',
      providerType: 'PERSONA_FISICA',
      area: 'RRHH',
      status: 'DRAFT',
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1),
      log: [{ action: 'Creó la solicitud', user: 'Laura Méndez', date: daysAgo(1) }],
    },
    {
      id: 'c-0039',
      folio: 'FOLIO-2026-004',
      title: 'Obra civil — ampliación de almacén',
      society: 'Inmobiliaria del Norte S.A. de C.V.',
      providerName: 'Constructora Oeste S.A. de C.V.',
      providerEmail: 'proyectos@constructoraoeste.mx',
      providerType: 'PERSONA_MORAL',
      area: 'Infraestructura',
      status: 'LAWYER_REVIEW',
      createdAt: daysAgo(12),
      updatedAt: daysAgo(6),
      log: [
        { action: 'Creó la solicitud', user: 'Jorge Lara', date: daysAgo(12) },
        { action: 'Envió a revisión', user: 'Jorge Lara', date: daysAgo(10) },
        { action: 'Validó documentación', user: 'Admin Sistema', date: daysAgo(8) },
        { action: 'Pasó a revisión legal', user: 'Lic. Fernández', date: daysAgo(6) },
      ],
    },
    {
      id: 'c-0038',
      folio: 'FOLIO-2026-005',
      title: 'Mantenimiento de infraestructura de TI',
      society: 'Grupo Aletheia S.A. de C.V.',
      providerName: 'Carlos Mendoza Ruiz',
      providerEmail: 'carlos.mendoza@outlook.com',
      providerType: 'PERSONA_FISICA',
      area: 'IT',
      status: 'REJECTED',
      createdAt: daysAgo(20),
      updatedAt: daysAgo(15),
      log: [
        { action: 'Creó la solicitud', user: 'Pedro Salas', date: daysAgo(20) },
        { action: 'Envió a revisión', user: 'Pedro Salas', date: daysAgo(18) },
        {
          action: 'Rechazó la solicitud',
          user: 'Admin Sistema',
          date: daysAgo(15),
          note: 'Documentación fiscal incompleta.',
        },
      ],
    },
    {
      id: 'c-0037',
      folio: 'FOLIO-2026-006',
      title: 'Servicios financieros y auditoría',
      society: 'Corporativo Levsek S.A. de C.V.',
      providerName: 'Servicios Globales S.A. de C.V.',
      providerEmail: 'cuentas@serviciosglobales.mx',
      providerType: 'PERSONA_MORAL',
      area: 'Finanzas',
      status: 'SIGNING',
      createdAt: daysAgo(18),
      updatedAt: daysAgo(7),
      log: [
        { action: 'Creó la solicitud', user: 'Mónica Reyes', date: daysAgo(18) },
        { action: 'Envió a revisión', user: 'Mónica Reyes', date: daysAgo(16) },
        { action: 'Aprobó el contrato', user: 'Mónica Reyes', date: daysAgo(9) },
        { action: 'Envió a firma', user: 'Admin Sistema', date: daysAgo(7) },
      ],
    },
  ];
}

/* ─── localStorage store ─────────────────────────────────────────────── */

function readStore(): Contract[] {
  if (typeof window === 'undefined') return seedContracts();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seedContracts();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw) as Contract[];
    if (!Array.isArray(parsed) || parsed.length === 0) return seedContracts();
    return parsed;
  } catch {
    return seedContracts();
  }
}

function writeStore(contracts: Contract[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(contracts));
  } catch {
    /* ignore quota errors in mock */
  }
}

/* ─── Folio generator ────────────────────────────────────────────────── */

function nextFolio(contracts: Contract[]): string {
  const year = new Date().getFullYear();
  const prefix = `FOLIO-${year}-`;
  const maxSeq = contracts
    .map((c) => c.folio)
    .filter((f) => f.startsWith(prefix))
    .map((f) => Number.parseInt(f.slice(prefix.length), 10))
    .filter((n) => !Number.isNaN(n))
    .reduce((max, n) => Math.max(max, n), 0);
  return `${prefix}${String(maxSeq + 1).padStart(3, '0')}`;
}

/* ─── Public input type ──────────────────────────────────────────────── */

export interface CreateContractInput {
  title: string;
  society: string;
  providerName: string;
  providerEmail: string;
  providerType: ProviderType;
  area: string;
  /** Display name of the acting user (defaults to a mock). */
  actor?: string;
}

const DEFAULT_ACTOR = 'Laura Méndez';

/* ─── Hook ───────────────────────────────────────────────────────────── */

/**
 * React hook over the localStorage store. Every mutation appends to the
 * contract `log` (bitácora) and persists synchronously.
 */
export function useContracts() {
  const [contracts, setContracts] = React.useState<Contract[]>([]);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    setContracts(readStore());
    setReady(true);
  }, []);

  const persist = React.useCallback((next: Contract[]) => {
    setContracts(next);
    writeStore(next);
  }, []);

  const getById = React.useCallback(
    (id: string) => contracts.find((c) => c.id === id),
    [contracts],
  );

  const createContract = React.useCallback(
    (input: CreateContractInput): Contract => {
      const now = new Date().toISOString();
      const actor = input.actor ?? DEFAULT_ACTOR;
      const current = readStore();
      const contract: Contract = {
        id: `c-${Date.now().toString(36)}`,
        folio: nextFolio(current),
        title: input.title,
        society: input.society,
        providerName: input.providerName,
        providerEmail: input.providerEmail,
        providerType: input.providerType,
        area: input.area,
        status: 'DRAFT',
        createdAt: now,
        updatedAt: now,
        log: [{ action: 'Creó la solicitud', user: actor, date: now }],
      };
      persist([contract, ...current]);
      return contract;
    },
    [persist],
  );

  /** Generic status transition that records a bitácora entry. */
  const transition = React.useCallback(
    (id: string, status: ContractStatus, action: string, actor = DEFAULT_ACTOR, note?: string) => {
      const now = new Date().toISOString();
      const current = readStore();
      const next = current.map((c) =>
        c.id === id
          ? {
              ...c,
              status,
              updatedAt: now,
              log: [...c.log, { action, user: actor, date: now, note }],
            }
          : c,
      );
      persist(next);
    },
    [persist],
  );

  const submitContract = React.useCallback(
    (id: string, actor?: string) => transition(id, 'SUBMITTED', 'Envió a revisión', actor),
    [transition],
  );

  const cancelContract = React.useCallback(
    (id: string, reason: string, actor?: string) =>
      transition(id, 'CANCELLED', 'Canceló la solicitud', actor, reason),
    [transition],
  );

  const recoverContract = React.useCallback(
    (id: string, actor?: string) => transition(id, 'DRAFT', 'Recuperó la solicitud', actor),
    [transition],
  );

  /** Edit the editable fields of a DRAFT contract (records a bitácora entry). */
  const updateContract = React.useCallback(
    (id: string, patch: Partial<CreateContractInput>, actor = DEFAULT_ACTOR) => {
      const now = new Date().toISOString();
      const current = readStore();
      const next = current.map((c) =>
        c.id === id
          ? {
              ...c,
              title: patch.title ?? c.title,
              society: patch.society ?? c.society,
              providerName: patch.providerName ?? c.providerName,
              providerEmail: patch.providerEmail ?? c.providerEmail,
              providerType: patch.providerType ?? c.providerType,
              area: patch.area ?? c.area,
              updatedAt: now,
              log: [...c.log, { action: 'Editó la solicitud', user: actor, date: now }],
            }
          : c,
      );
      persist(next);
    },
    [persist],
  );

  return {
    contracts,
    ready,
    getById,
    createContract,
    updateContract,
    submitContract,
    cancelContract,
    recoverContract,
    nextFolioPreview: () => nextFolio(contracts),
  };
}
