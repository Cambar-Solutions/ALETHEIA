// Mock data layer for the review workflow (flujo-mf).
// No backend: state lives in React + localStorage under `aletheia_workflow`.
// Status names mirror contracts-service `ContractStatus` (canonical enum).

import type { Role } from '@aletheia/frontend-commons';

// ─── Domain types ─────────────────────────────────────────────────────────

/** Contract lifecycle status (subset relevant to the review flow). */
export type ContractStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'ADMIN_REVIEW'
  | 'LAWYER_REVIEW'
  | 'APPROVAL_PENDING'
  | 'SIGNING'
  | 'SIGNED'
  | 'REJECTED'
  | 'CANCELLED';

/** Action recorded on every workflow transition. */
export type TransitionAction = 'SUBMIT' | 'APPROVE' | 'RETURN' | 'REJECT' | 'RECOVER';

/** A configurable workflow stage (mirrors workflow-service `WorkflowStage`). */
export interface WorkflowStage {
  /** Status this stage represents while a contract sits in it. */
  status: ContractStatus;
  /** Human label (Spanish, UI). */
  label: string;
  /** SLA budget in hours for this stage. */
  slaHours: number;
  /** Role that owns the review at this stage. */
  roleRequired: Role;
}

/** A single immutable entry in a contract's workflow history. */
export interface WorkflowTransition {
  id: string;
  contractId: string;
  from: ContractStatus;
  to: ContractStatus;
  action: TransitionAction;
  /** User who performed the action (display name). */
  performedBy: string;
  /** Optional comment (mandatory for RETURN / REJECT). */
  comment?: string;
  /** ISO timestamp. */
  timestamp: string;
}

/** A contract as tracked by the review workflow. */
export interface WorkflowContract {
  id: string;
  /** Unique, human-readable folio. */
  folio: string;
  /** Provider / counterparty name. */
  provider: string;
  /** Society the contract belongs to. */
  society: string;
  /** Requesting area. */
  area: string;
  /** Current lifecycle status. */
  status: ContractStatus;
  /** ISO timestamp of when the contract entered the current status. */
  enteredAt: string;
  /** Solicitante (requester) display name. */
  requestedBy: string;
}

/** Full persisted workflow snapshot. */
export interface WorkflowState {
  contracts: WorkflowContract[];
  transitions: WorkflowTransition[];
}

// ─── Stage configuration ──────────────────────────────────────────────────

/** Stages that carry an SLA budget (the active review stages, HU-11..14). */
export const WORKFLOW_STAGES: Record<string, WorkflowStage> = {
  ADMIN_REVIEW: {
    status: 'ADMIN_REVIEW',
    label: 'Revisión Administrador',
    slaHours: 24,
    roleRequired: 'ADMINISTRADOR',
  },
  LAWYER_REVIEW: {
    status: 'LAWYER_REVIEW',
    label: 'Revisión Abogado',
    slaHours: 48,
    roleRequired: 'ABOGADO',
  },
  APPROVAL_PENDING: {
    status: 'APPROVAL_PENDING',
    label: 'Aprobación',
    slaHours: 24,
    roleRequired: 'APROBADOR',
  },
};

/** Stages, in flow order, that count towards SLA tracking. */
export const SLA_TRACKED_STATUSES: ContractStatus[] = [
  'SUBMITTED',
  'ADMIN_REVIEW',
  'LAWYER_REVIEW',
  'APPROVAL_PENDING',
];

/**
 * SLA config keyed by status. SUBMITTED shares the admin stage budget because
 * an unprocessed submission is awaiting the admin (it maps to ADMIN_REVIEW).
 */
export function slaHoursForStatus(status: ContractStatus): number | null {
  switch (status) {
    case 'SUBMITTED':
    case 'ADMIN_REVIEW':
      return WORKFLOW_STAGES.ADMIN_REVIEW.slaHours;
    case 'LAWYER_REVIEW':
      return WORKFLOW_STAGES.LAWYER_REVIEW.slaHours;
    case 'APPROVAL_PENDING':
      return WORKFLOW_STAGES.APPROVAL_PENDING.slaHours;
    default:
      return null;
  }
}

// ─── Seed data ────────────────────────────────────────────────────────────

export const WORKFLOW_STORAGE_KEY = 'aletheia_workflow';

/**
 * Base reference date for deterministic SLA demos (~2026-06-02).
 * `enteredAt` of the seed contracts is computed relative to this so the
 * three SLA colors (green / yellow / red) are always visible.
 */
const BASE_NOW = new Date('2026-06-02T12:00:00.000Z');

/** Helper: ISO string for `hours` before BASE_NOW. */
function hoursAgo(hours: number): string {
  return new Date(BASE_NOW.getTime() - hours * 3600_000).toISOString();
}

function buildSeed(): WorkflowState {
  const contracts: WorkflowContract[] = [
    // ── Admin queue (SUBMITTED / ADMIN_REVIEW, SLA 24h) ──
    {
      id: 'c-001',
      folio: 'ALT-2026-0001',
      provider: 'Servicios Logísticos del Norte S.A.',
      society: 'Grupo Aletheia',
      area: 'Compras',
      status: 'SUBMITTED',
      enteredAt: hoursAgo(6), // 25% → verde
      requestedBy: 'María Fernández',
    },
    {
      id: 'c-002',
      folio: 'ALT-2026-0002',
      provider: 'Construcciones Peralta',
      society: 'Aletheia Inmobiliaria',
      area: 'Infraestructura',
      status: 'ADMIN_REVIEW',
      enteredAt: hoursAgo(17), // ~71% → amarillo
      requestedBy: 'Jorge Medina',
    },
    {
      id: 'c-003',
      folio: 'ALT-2026-0003',
      provider: 'TI Soluciones Integrales',
      society: 'Grupo Aletheia',
      area: 'Tecnología',
      status: 'ADMIN_REVIEW',
      enteredAt: hoursAgo(30), // 125% → rojo
      requestedBy: 'Ana Ruiz',
    },
    // ── Lawyer queue (LAWYER_REVIEW, SLA 48h) ──
    {
      id: 'c-004',
      folio: 'ALT-2026-0004',
      provider: 'Despacho Contable Vega',
      society: 'Aletheia Servicios',
      area: 'Finanzas',
      status: 'LAWYER_REVIEW',
      enteredAt: hoursAgo(12), // 25% → verde
      requestedBy: 'Luis Cabrera',
    },
    {
      id: 'c-005',
      folio: 'ALT-2026-0005',
      provider: 'Transportes Águila',
      society: 'Aletheia Logística',
      area: 'Operaciones',
      status: 'LAWYER_REVIEW',
      enteredAt: hoursAgo(38), // ~79% → amarillo
      requestedBy: 'Sofía Bravo',
    },
    {
      id: 'c-006',
      folio: 'ALT-2026-0006',
      provider: 'Seguridad Privada Centinela',
      society: 'Grupo Aletheia',
      area: 'Seguridad',
      status: 'LAWYER_REVIEW',
      enteredAt: hoursAgo(55), // ~115% → rojo
      requestedBy: 'Diego Navarro',
    },
    // ── Approver queue (APPROVAL_PENDING, SLA 24h) ──
    {
      id: 'c-007',
      folio: 'ALT-2026-0007',
      provider: 'Consultoría Estratégica Lumen',
      society: 'Aletheia Servicios',
      area: 'Dirección',
      status: 'APPROVAL_PENDING',
      enteredAt: hoursAgo(4), // ~17% → verde
      requestedBy: 'Patricia Lozano',
    },
    {
      id: 'c-008',
      folio: 'ALT-2026-0008',
      provider: 'Mantenimiento Industrial Robles',
      society: 'Aletheia Inmobiliaria',
      area: 'Mantenimiento',
      status: 'APPROVAL_PENDING',
      enteredAt: hoursAgo(26), // ~108% → rojo
      requestedBy: 'Raúl Estrada',
    },
  ];

  const transitions: WorkflowTransition[] = [
    // c-001 history
    t('c-001', 'DRAFT', 'SUBMITTED', 'SUBMIT', 'María Fernández', hoursAgo(6)),
    // c-002 history
    t('c-002', 'DRAFT', 'SUBMITTED', 'SUBMIT', 'Jorge Medina', hoursAgo(40)),
    t('c-002', 'SUBMITTED', 'ADMIN_REVIEW', 'APPROVE', 'Sistema', hoursAgo(17)),
    // c-003 history (went back to draft once, then resubmitted)
    t('c-003', 'DRAFT', 'SUBMITTED', 'SUBMIT', 'Ana Ruiz', hoursAgo(72)),
    t(
      'c-003',
      'SUBMITTED',
      'DRAFT',
      'RETURN',
      'Carlos Admin',
      hoursAgo(60),
      'Falta el anexo técnico y la firma del área requirente.',
    ),
    t('c-003', 'DRAFT', 'SUBMITTED', 'SUBMIT', 'Ana Ruiz', hoursAgo(48)),
    t('c-003', 'SUBMITTED', 'ADMIN_REVIEW', 'APPROVE', 'Carlos Admin', hoursAgo(30)),
    // c-004 history
    t('c-004', 'DRAFT', 'SUBMITTED', 'SUBMIT', 'Luis Cabrera', hoursAgo(60)),
    t('c-004', 'SUBMITTED', 'ADMIN_REVIEW', 'APPROVE', 'Carlos Admin', hoursAgo(36)),
    t(
      'c-004',
      'ADMIN_REVIEW',
      'LAWYER_REVIEW',
      'APPROVE',
      'Carlos Admin',
      hoursAgo(12),
      'Documentación administrativa completa.',
    ),
    // c-005 history
    t('c-005', 'DRAFT', 'SUBMITTED', 'SUBMIT', 'Sofía Bravo', hoursAgo(70)),
    t('c-005', 'SUBMITTED', 'ADMIN_REVIEW', 'APPROVE', 'Carlos Admin', hoursAgo(55)),
    t('c-005', 'ADMIN_REVIEW', 'LAWYER_REVIEW', 'APPROVE', 'Carlos Admin', hoursAgo(38)),
    // c-006 history
    t('c-006', 'DRAFT', 'SUBMITTED', 'SUBMIT', 'Diego Navarro', hoursAgo(96)),
    t('c-006', 'SUBMITTED', 'ADMIN_REVIEW', 'APPROVE', 'Carlos Admin', hoursAgo(80)),
    t('c-006', 'ADMIN_REVIEW', 'LAWYER_REVIEW', 'APPROVE', 'Carlos Admin', hoursAgo(55)),
    // c-007 history
    t('c-007', 'DRAFT', 'SUBMITTED', 'SUBMIT', 'Patricia Lozano', hoursAgo(50)),
    t('c-007', 'SUBMITTED', 'ADMIN_REVIEW', 'APPROVE', 'Carlos Admin', hoursAgo(40)),
    t('c-007', 'ADMIN_REVIEW', 'LAWYER_REVIEW', 'APPROVE', 'Carlos Admin', hoursAgo(28)),
    t(
      'c-007',
      'LAWYER_REVIEW',
      'APPROVAL_PENDING',
      'APPROVE',
      'Mariana Abogada',
      hoursAgo(4),
      'Cláusulas revisadas sin observaciones.',
    ),
    // c-008 history
    t('c-008', 'DRAFT', 'SUBMITTED', 'SUBMIT', 'Raúl Estrada', hoursAgo(90)),
    t('c-008', 'SUBMITTED', 'ADMIN_REVIEW', 'APPROVE', 'Carlos Admin', hoursAgo(75)),
    t('c-008', 'ADMIN_REVIEW', 'LAWYER_REVIEW', 'APPROVE', 'Carlos Admin', hoursAgo(55)),
    t('c-008', 'LAWYER_REVIEW', 'APPROVAL_PENDING', 'APPROVE', 'Mariana Abogada', hoursAgo(26)),
  ];

  return { contracts, transitions };
}

let seedCounter = 0;
function t(
  contractId: string,
  from: ContractStatus,
  to: ContractStatus,
  action: TransitionAction,
  performedBy: string,
  timestamp: string,
  comment?: string,
): WorkflowTransition {
  seedCounter += 1;
  return {
    id: `seed-${seedCounter}`,
    contractId,
    from,
    to,
    action,
    performedBy,
    timestamp,
    comment,
  };
}

// ─── Persistence ──────────────────────────────────────────────────────────

/** Returns a fresh seed snapshot (deep copy, safe to mutate). */
export function getSeedState(): WorkflowState {
  return buildSeed();
}

/** Loads the workflow state from localStorage, seeding it on first run. */
export function loadWorkflowState(): WorkflowState {
  if (typeof window === 'undefined') return getSeedState();
  try {
    const raw = window.localStorage.getItem(WORKFLOW_STORAGE_KEY);
    if (!raw) {
      const seed = getSeedState();
      window.localStorage.setItem(WORKFLOW_STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw) as WorkflowState;
    if (!parsed.contracts || !parsed.transitions) throw new Error('invalid shape');
    return parsed;
  } catch {
    const seed = getSeedState();
    try {
      window.localStorage.setItem(WORKFLOW_STORAGE_KEY, JSON.stringify(seed));
    } catch {
      /* ignore quota / privacy errors */
    }
    return seed;
  }
}

/** Persists the workflow state to localStorage. */
export function saveWorkflowState(state: WorkflowState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(WORKFLOW_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / privacy errors */
  }
}

/** Clears the persisted state so the next load re-seeds. */
export function resetWorkflowState(): WorkflowState {
  const seed = getSeedState();
  saveWorkflowState(seed);
  return seed;
}
