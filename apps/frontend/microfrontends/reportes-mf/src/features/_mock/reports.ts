// Mock data layer for the Reportes MF (HU-24 / HU-25).
// No backend: this module is the single source of truth for contracts and their
// audit trail. Field names mirror the real Prisma models (Contract / AuditLog)
// so the UI maps cleanly when the backend is wired later.

/* ─── Contract status ─────────────────────────────────────────────────── */
// Mirrors the `ContractStatus` enum from the contracts schema.
export type ContractStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'ADMIN_REVIEW'
  | 'LAWYER_REVIEW'
  | 'APPROVAL_PENDING'
  | 'APPROVED'
  | 'SIGNING'
  | 'SIGNED'
  | 'CANCELLED'
  | 'REJECTED';

export interface ContractStatusMeta {
  id: ContractStatus;
  /** Spanish label shown in the UI. */
  label: string;
  /** Badge variant from the design system. */
  variant: 'default' | 'secondary' | 'destructive' | 'neutral' | 'outline';
}

export const CONTRACT_STATUSES: ContractStatusMeta[] = [
  { id: 'DRAFT', label: 'Borrador', variant: 'neutral' },
  { id: 'SUBMITTED', label: 'Enviado', variant: 'secondary' },
  { id: 'ADMIN_REVIEW', label: 'Revisión admin.', variant: 'secondary' },
  { id: 'LAWYER_REVIEW', label: 'Revisión legal', variant: 'secondary' },
  { id: 'APPROVAL_PENDING', label: 'Pend. aprobación', variant: 'secondary' },
  { id: 'APPROVED', label: 'Aprobado', variant: 'default' },
  { id: 'SIGNING', label: 'En firma', variant: 'default' },
  { id: 'SIGNED', label: 'Firmado', variant: 'default' },
  { id: 'CANCELLED', label: 'Cancelado', variant: 'destructive' },
  { id: 'REJECTED', label: 'Rechazado', variant: 'destructive' },
];

export function statusMeta(status: ContractStatus): ContractStatusMeta {
  return (
    CONTRACT_STATUSES.find((s) => s.id === status) ?? {
      id: status,
      label: status,
      variant: 'neutral',
    }
  );
}

export function statusLabel(status: ContractStatus): string {
  return statusMeta(status).label;
}

/* ─── Areas ───────────────────────────────────────────────────────────── */
export interface Area {
  id: string;
  name: string;
}

export const AREAS: Area[] = [
  { id: 'area-compras', name: 'Compras' },
  { id: 'area-legal', name: 'Legal' },
  { id: 'area-rrhh', name: 'RRHH' },
  { id: 'area-finanzas', name: 'Finanzas' },
];

export function areaName(areaId: string): string {
  return AREAS.find((a) => a.id === areaId)?.name ?? areaId;
}

/* ─── Users (responsables) ────────────────────────────────────────────── */
export interface User {
  id: string;
  name: string;
}

export const USERS: User[] = [
  { id: 'usr-001', name: 'Ana Torres' },
  { id: 'usr-002', name: 'Luis Hernández' },
  { id: 'usr-003', name: 'María Gómez' },
  { id: 'usr-004', name: 'Carlos Ruiz' },
  { id: 'usr-005', name: 'Sofía Méndez' },
  { id: 'usr-006', name: 'Jorge Castillo' },
];

export function userName(userId: string): string {
  return USERS.find((u) => u.id === userId)?.name ?? userId;
}

/* ─── Contract ────────────────────────────────────────────────────────── */
export interface Contract {
  id: string;
  folio: string;
  title: string;
  vendorName: string;
  status: ContractStatus;
  areaId: string;
  /** userId of the assigned responsible (mirrors createdBy / owner). */
  responsibleId: string;
  createdAt: string;
  updatedAt: string;
}

/* ─── Audit log ───────────────────────────────────────────────────────── */
export type AuditAction =
  | 'CREATED'
  | 'EDITED'
  | 'SUBMITTED'
  | 'ADMIN_APPROVED'
  | 'LAWYER_APPROVED'
  | 'LAWYER_REJECTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'SIGNED'
  | 'CANCELLED'
  | 'RECOVERED'
  | 'DOCUMENT_UPLOADED'
  | 'ASSIGNED';

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  CREATED: 'Contrato creado',
  EDITED: 'Edición de datos',
  SUBMITTED: 'Enviado a revisión',
  ADMIN_APPROVED: 'Aprobado por administrador',
  LAWYER_APPROVED: 'Aprobado por abogado',
  LAWYER_REJECTED: 'Rechazado por abogado',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
  SIGNED: 'Firmado',
  CANCELLED: 'Cancelado',
  RECOVERED: 'Recuperado',
  DOCUMENT_UPLOADED: 'Documento subido',
  ASSIGNED: 'Responsable asignado',
};

export function auditActionLabel(action: AuditAction): string {
  return AUDIT_ACTION_LABELS[action] ?? action;
}

export interface AuditEntry {
  id: string;
  contractId: string;
  action: AuditAction;
  userId: string;
  /** ISO timestamp. */
  createdAt: string;
  /** Field affected by the change (when applicable). */
  field?: string;
  oldValue?: string | null;
  newValue?: string | null;
}

/* ─── Seed: contracts ─────────────────────────────────────────────────── */

export const CONTRACTS: Contract[] = [
  {
    id: 'ctr-001',
    folio: 'CLM-2026-001',
    title: 'Servicios de consultoría TI',
    vendorName: 'Innovatech, S.A. de C.V.',
    status: 'SIGNED',
    areaId: 'area-compras',
    responsibleId: 'usr-001',
    createdAt: '2026-01-08T09:00:00.000Z',
    updatedAt: '2026-02-02T16:30:00.000Z',
  },
  {
    id: 'ctr-002',
    folio: 'CLM-2026-002',
    title: 'Arrendamiento de oficinas corporativas',
    vendorName: 'Inmuebles del Centro, S.A.',
    status: 'APPROVED',
    areaId: 'area-finanzas',
    responsibleId: 'usr-002',
    createdAt: '2026-01-12T11:15:00.000Z',
    updatedAt: '2026-02-10T10:00:00.000Z',
  },
  {
    id: 'ctr-003',
    folio: 'CLM-2026-003',
    title: 'Suministro de equipo de cómputo',
    vendorName: 'CompuMax Distribuciones',
    status: 'LAWYER_REVIEW',
    areaId: 'area-compras',
    responsibleId: 'usr-003',
    createdAt: '2026-01-15T14:40:00.000Z',
    updatedAt: '2026-02-14T09:20:00.000Z',
  },
  {
    id: 'ctr-004',
    folio: 'CLM-2026-004',
    title: 'Convenio de confidencialidad proveedor',
    vendorName: 'Datacore Solutions',
    status: 'DRAFT',
    areaId: 'area-legal',
    responsibleId: 'usr-004',
    createdAt: '2026-01-20T08:30:00.000Z',
    updatedAt: '2026-01-20T08:30:00.000Z',
  },
  {
    id: 'ctr-005',
    folio: 'CLM-2026-005',
    title: 'Servicios de reclutamiento especializado',
    vendorName: 'TalentBridge, S.C.',
    status: 'SUBMITTED',
    areaId: 'area-rrhh',
    responsibleId: 'usr-005',
    createdAt: '2026-01-22T13:05:00.000Z',
    updatedAt: '2026-02-01T12:00:00.000Z',
  },
  {
    id: 'ctr-006',
    folio: 'CLM-2026-006',
    title: 'Póliza de seguro de gastos médicos',
    vendorName: 'Aseguradora Continental',
    status: 'APPROVAL_PENDING',
    areaId: 'area-rrhh',
    responsibleId: 'usr-001',
    createdAt: '2026-01-25T10:10:00.000Z',
    updatedAt: '2026-02-12T15:45:00.000Z',
  },
  {
    id: 'ctr-007',
    folio: 'CLM-2026-007',
    title: 'Servicios de auditoría financiera',
    vendorName: 'KP Auditores Asociados',
    status: 'ADMIN_REVIEW',
    areaId: 'area-finanzas',
    responsibleId: 'usr-006',
    createdAt: '2026-01-28T09:50:00.000Z',
    updatedAt: '2026-02-08T11:30:00.000Z',
  },
  {
    id: 'ctr-008',
    folio: 'CLM-2026-008',
    title: 'Mantenimiento de flotilla vehicular',
    vendorName: 'AutoServicio Express',
    status: 'CANCELLED',
    areaId: 'area-compras',
    responsibleId: 'usr-002',
    createdAt: '2026-02-01T16:20:00.000Z',
    updatedAt: '2026-02-09T10:15:00.000Z',
  },
  {
    id: 'ctr-009',
    folio: 'CLM-2026-009',
    title: 'Licenciamiento de software ERP',
    vendorName: 'Global ERP Systems',
    status: 'SIGNING',
    areaId: 'area-compras',
    responsibleId: 'usr-003',
    createdAt: '2026-02-03T12:00:00.000Z',
    updatedAt: '2026-02-18T14:00:00.000Z',
  },
  {
    id: 'ctr-010',
    folio: 'CLM-2026-010',
    title: 'Asesoría jurídica corporativa',
    vendorName: 'Bufete Morales & Asociados',
    status: 'REJECTED',
    areaId: 'area-legal',
    responsibleId: 'usr-004',
    createdAt: '2026-02-05T08:00:00.000Z',
    updatedAt: '2026-02-15T17:10:00.000Z',
  },
  {
    id: 'ctr-011',
    folio: 'CLM-2026-011',
    title: 'Servicios de limpieza corporativa',
    vendorName: 'CleanPro Servicios',
    status: 'APPROVED',
    areaId: 'area-compras',
    responsibleId: 'usr-005',
    createdAt: '2026-02-07T10:30:00.000Z',
    updatedAt: '2026-02-19T09:00:00.000Z',
  },
  {
    id: 'ctr-012',
    folio: 'CLM-2026-012',
    title: 'Capacitación en liderazgo gerencial',
    vendorName: 'Desarrollo Humano Integral',
    status: 'SUBMITTED',
    areaId: 'area-rrhh',
    responsibleId: 'usr-006',
    createdAt: '2026-02-10T11:45:00.000Z',
    updatedAt: '2026-02-16T13:20:00.000Z',
  },
  {
    id: 'ctr-013',
    folio: 'CLM-2026-013',
    title: 'Línea de crédito revolvente',
    vendorName: 'Banco Industrial Mexicano',
    status: 'LAWYER_REVIEW',
    areaId: 'area-finanzas',
    responsibleId: 'usr-001',
    createdAt: '2026-02-12T09:15:00.000Z',
    updatedAt: '2026-02-20T10:40:00.000Z',
  },
  {
    id: 'ctr-014',
    folio: 'CLM-2026-014',
    title: 'Suministro de papelería y consumibles',
    vendorName: 'Distribuidora La Oficina',
    status: 'DRAFT',
    areaId: 'area-compras',
    responsibleId: 'usr-002',
    createdAt: '2026-02-14T14:00:00.000Z',
    updatedAt: '2026-02-14T14:00:00.000Z',
  },
];

/* ─── Seed: audit entries ─────────────────────────────────────────────── */
// Stored unsorted by design; hooks sort newest-first.

export const AUDIT_LOG: AuditEntry[] = [
  // ctr-001 — full lifecycle up to SIGNED
  {
    id: 'aud-001',
    contractId: 'ctr-001',
    action: 'CREATED',
    userId: 'usr-001',
    createdAt: '2026-01-08T09:00:00.000Z',
  },
  {
    id: 'aud-002',
    contractId: 'ctr-001',
    action: 'EDITED',
    userId: 'usr-001',
    createdAt: '2026-01-09T10:20:00.000Z',
    field: 'vendorName',
    oldValue: 'Innovatech S.A.',
    newValue: 'Innovatech, S.A. de C.V.',
  },
  {
    id: 'aud-003',
    contractId: 'ctr-001',
    action: 'SUBMITTED',
    userId: 'usr-001',
    createdAt: '2026-01-10T11:00:00.000Z',
    field: 'status',
    oldValue: 'DRAFT',
    newValue: 'SUBMITTED',
  },
  {
    id: 'aud-004',
    contractId: 'ctr-001',
    action: 'ADMIN_APPROVED',
    userId: 'usr-006',
    createdAt: '2026-01-14T15:30:00.000Z',
    field: 'status',
    oldValue: 'ADMIN_REVIEW',
    newValue: 'LAWYER_REVIEW',
  },
  {
    id: 'aud-005',
    contractId: 'ctr-001',
    action: 'LAWYER_APPROVED',
    userId: 'usr-004',
    createdAt: '2026-01-20T09:45:00.000Z',
    field: 'status',
    oldValue: 'LAWYER_REVIEW',
    newValue: 'APPROVAL_PENDING',
  },
  {
    id: 'aud-006',
    contractId: 'ctr-001',
    action: 'APPROVED',
    userId: 'usr-003',
    createdAt: '2026-01-27T12:10:00.000Z',
    field: 'status',
    oldValue: 'APPROVAL_PENDING',
    newValue: 'APPROVED',
  },
  {
    id: 'aud-007',
    contractId: 'ctr-001',
    action: 'SIGNED',
    userId: 'usr-005',
    createdAt: '2026-02-02T16:30:00.000Z',
    field: 'status',
    oldValue: 'SIGNING',
    newValue: 'SIGNED',
  },

  // ctr-002 — up to APPROVED
  {
    id: 'aud-010',
    contractId: 'ctr-002',
    action: 'CREATED',
    userId: 'usr-002',
    createdAt: '2026-01-12T11:15:00.000Z',
  },
  {
    id: 'aud-011',
    contractId: 'ctr-002',
    action: 'SUBMITTED',
    userId: 'usr-002',
    createdAt: '2026-01-18T10:00:00.000Z',
    field: 'status',
    oldValue: 'DRAFT',
    newValue: 'SUBMITTED',
  },
  {
    id: 'aud-012',
    contractId: 'ctr-002',
    action: 'ADMIN_APPROVED',
    userId: 'usr-006',
    createdAt: '2026-01-25T14:00:00.000Z',
    field: 'status',
    oldValue: 'ADMIN_REVIEW',
    newValue: 'LAWYER_REVIEW',
  },
  {
    id: 'aud-013',
    contractId: 'ctr-002',
    action: 'LAWYER_APPROVED',
    userId: 'usr-004',
    createdAt: '2026-02-03T11:30:00.000Z',
    field: 'status',
    oldValue: 'LAWYER_REVIEW',
    newValue: 'APPROVAL_PENDING',
  },
  {
    id: 'aud-014',
    contractId: 'ctr-002',
    action: 'APPROVED',
    userId: 'usr-003',
    createdAt: '2026-02-10T10:00:00.000Z',
    field: 'status',
    oldValue: 'APPROVAL_PENDING',
    newValue: 'APPROVED',
  },

  // ctr-003 — in lawyer review, with document upload
  {
    id: 'aud-020',
    contractId: 'ctr-003',
    action: 'CREATED',
    userId: 'usr-003',
    createdAt: '2026-01-15T14:40:00.000Z',
  },
  {
    id: 'aud-021',
    contractId: 'ctr-003',
    action: 'DOCUMENT_UPLOADED',
    userId: 'usr-003',
    createdAt: '2026-01-17T09:30:00.000Z',
    field: 'document',
    oldValue: null,
    newValue: 'cotizacion.pdf',
  },
  {
    id: 'aud-022',
    contractId: 'ctr-003',
    action: 'SUBMITTED',
    userId: 'usr-003',
    createdAt: '2026-01-22T16:00:00.000Z',
    field: 'status',
    oldValue: 'DRAFT',
    newValue: 'SUBMITTED',
  },
  {
    id: 'aud-023',
    contractId: 'ctr-003',
    action: 'ADMIN_APPROVED',
    userId: 'usr-006',
    createdAt: '2026-02-14T09:20:00.000Z',
    field: 'status',
    oldValue: 'ADMIN_REVIEW',
    newValue: 'LAWYER_REVIEW',
  },

  // ctr-004 — draft only
  {
    id: 'aud-030',
    contractId: 'ctr-004',
    action: 'CREATED',
    userId: 'usr-004',
    createdAt: '2026-01-20T08:30:00.000Z',
  },

  // ctr-005 — submitted
  {
    id: 'aud-040',
    contractId: 'ctr-005',
    action: 'CREATED',
    userId: 'usr-005',
    createdAt: '2026-01-22T13:05:00.000Z',
  },
  {
    id: 'aud-041',
    contractId: 'ctr-005',
    action: 'EDITED',
    userId: 'usr-005',
    createdAt: '2026-01-28T10:15:00.000Z',
    field: 'title',
    oldValue: 'Reclutamiento',
    newValue: 'Servicios de reclutamiento especializado',
  },
  {
    id: 'aud-042',
    contractId: 'ctr-005',
    action: 'SUBMITTED',
    userId: 'usr-005',
    createdAt: '2026-02-01T12:00:00.000Z',
    field: 'status',
    oldValue: 'DRAFT',
    newValue: 'SUBMITTED',
  },

  // ctr-006 — approval pending
  {
    id: 'aud-050',
    contractId: 'ctr-006',
    action: 'CREATED',
    userId: 'usr-001',
    createdAt: '2026-01-25T10:10:00.000Z',
  },
  {
    id: 'aud-051',
    contractId: 'ctr-006',
    action: 'SUBMITTED',
    userId: 'usr-001',
    createdAt: '2026-01-30T09:00:00.000Z',
    field: 'status',
    oldValue: 'DRAFT',
    newValue: 'SUBMITTED',
  },
  {
    id: 'aud-052',
    contractId: 'ctr-006',
    action: 'ADMIN_APPROVED',
    userId: 'usr-006',
    createdAt: '2026-02-04T13:20:00.000Z',
    field: 'status',
    oldValue: 'ADMIN_REVIEW',
    newValue: 'LAWYER_REVIEW',
  },
  {
    id: 'aud-053',
    contractId: 'ctr-006',
    action: 'LAWYER_APPROVED',
    userId: 'usr-004',
    createdAt: '2026-02-12T15:45:00.000Z',
    field: 'status',
    oldValue: 'LAWYER_REVIEW',
    newValue: 'APPROVAL_PENDING',
  },

  // ctr-007 — admin review
  {
    id: 'aud-060',
    contractId: 'ctr-007',
    action: 'CREATED',
    userId: 'usr-006',
    createdAt: '2026-01-28T09:50:00.000Z',
  },
  {
    id: 'aud-061',
    contractId: 'ctr-007',
    action: 'SUBMITTED',
    userId: 'usr-006',
    createdAt: '2026-02-08T11:30:00.000Z',
    field: 'status',
    oldValue: 'DRAFT',
    newValue: 'SUBMITTED',
  },

  // ctr-008 — cancelled
  {
    id: 'aud-070',
    contractId: 'ctr-008',
    action: 'CREATED',
    userId: 'usr-002',
    createdAt: '2026-02-01T16:20:00.000Z',
  },
  {
    id: 'aud-071',
    contractId: 'ctr-008',
    action: 'SUBMITTED',
    userId: 'usr-002',
    createdAt: '2026-02-05T10:00:00.000Z',
    field: 'status',
    oldValue: 'DRAFT',
    newValue: 'SUBMITTED',
  },
  {
    id: 'aud-072',
    contractId: 'ctr-008',
    action: 'CANCELLED',
    userId: 'usr-006',
    createdAt: '2026-02-09T10:15:00.000Z',
    field: 'status',
    oldValue: 'ADMIN_REVIEW',
    newValue: 'CANCELLED',
  },

  // ctr-009 — signing
  {
    id: 'aud-080',
    contractId: 'ctr-009',
    action: 'CREATED',
    userId: 'usr-003',
    createdAt: '2026-02-03T12:00:00.000Z',
  },
  {
    id: 'aud-081',
    contractId: 'ctr-009',
    action: 'SUBMITTED',
    userId: 'usr-003',
    createdAt: '2026-02-06T09:30:00.000Z',
    field: 'status',
    oldValue: 'DRAFT',
    newValue: 'SUBMITTED',
  },
  {
    id: 'aud-082',
    contractId: 'ctr-009',
    action: 'ADMIN_APPROVED',
    userId: 'usr-006',
    createdAt: '2026-02-10T14:00:00.000Z',
    field: 'status',
    oldValue: 'ADMIN_REVIEW',
    newValue: 'LAWYER_REVIEW',
  },
  {
    id: 'aud-083',
    contractId: 'ctr-009',
    action: 'LAWYER_APPROVED',
    userId: 'usr-004',
    createdAt: '2026-02-14T11:00:00.000Z',
    field: 'status',
    oldValue: 'LAWYER_REVIEW',
    newValue: 'APPROVAL_PENDING',
  },
  {
    id: 'aud-084',
    contractId: 'ctr-009',
    action: 'APPROVED',
    userId: 'usr-005',
    createdAt: '2026-02-18T14:00:00.000Z',
    field: 'status',
    oldValue: 'APPROVAL_PENDING',
    newValue: 'SIGNING',
  },

  // ctr-010 — rejected (ping-pong)
  {
    id: 'aud-090',
    contractId: 'ctr-010',
    action: 'CREATED',
    userId: 'usr-004',
    createdAt: '2026-02-05T08:00:00.000Z',
  },
  {
    id: 'aud-091',
    contractId: 'ctr-010',
    action: 'SUBMITTED',
    userId: 'usr-004',
    createdAt: '2026-02-08T10:00:00.000Z',
    field: 'status',
    oldValue: 'DRAFT',
    newValue: 'SUBMITTED',
  },
  {
    id: 'aud-092',
    contractId: 'ctr-010',
    action: 'ADMIN_APPROVED',
    userId: 'usr-006',
    createdAt: '2026-02-11T13:00:00.000Z',
    field: 'status',
    oldValue: 'ADMIN_REVIEW',
    newValue: 'LAWYER_REVIEW',
  },
  {
    id: 'aud-093',
    contractId: 'ctr-010',
    action: 'LAWYER_REJECTED',
    userId: 'usr-004',
    createdAt: '2026-02-15T17:10:00.000Z',
    field: 'status',
    oldValue: 'LAWYER_REVIEW',
    newValue: 'REJECTED',
  },

  // ctr-011 — approved
  {
    id: 'aud-100',
    contractId: 'ctr-011',
    action: 'CREATED',
    userId: 'usr-005',
    createdAt: '2026-02-07T10:30:00.000Z',
  },
  {
    id: 'aud-101',
    contractId: 'ctr-011',
    action: 'SUBMITTED',
    userId: 'usr-005',
    createdAt: '2026-02-11T09:00:00.000Z',
    field: 'status',
    oldValue: 'DRAFT',
    newValue: 'SUBMITTED',
  },
  {
    id: 'aud-102',
    contractId: 'ctr-011',
    action: 'ADMIN_APPROVED',
    userId: 'usr-006',
    createdAt: '2026-02-14T12:00:00.000Z',
    field: 'status',
    oldValue: 'ADMIN_REVIEW',
    newValue: 'LAWYER_REVIEW',
  },
  {
    id: 'aud-103',
    contractId: 'ctr-011',
    action: 'LAWYER_APPROVED',
    userId: 'usr-004',
    createdAt: '2026-02-17T10:00:00.000Z',
    field: 'status',
    oldValue: 'LAWYER_REVIEW',
    newValue: 'APPROVAL_PENDING',
  },
  {
    id: 'aud-104',
    contractId: 'ctr-011',
    action: 'APPROVED',
    userId: 'usr-003',
    createdAt: '2026-02-19T09:00:00.000Z',
    field: 'status',
    oldValue: 'APPROVAL_PENDING',
    newValue: 'APPROVED',
  },

  // ctr-012 — submitted
  {
    id: 'aud-110',
    contractId: 'ctr-012',
    action: 'CREATED',
    userId: 'usr-006',
    createdAt: '2026-02-10T11:45:00.000Z',
  },
  {
    id: 'aud-111',
    contractId: 'ctr-012',
    action: 'SUBMITTED',
    userId: 'usr-006',
    createdAt: '2026-02-16T13:20:00.000Z',
    field: 'status',
    oldValue: 'DRAFT',
    newValue: 'SUBMITTED',
  },

  // ctr-013 — lawyer review, reassigned
  {
    id: 'aud-120',
    contractId: 'ctr-013',
    action: 'CREATED',
    userId: 'usr-002',
    createdAt: '2026-02-12T09:15:00.000Z',
  },
  {
    id: 'aud-121',
    contractId: 'ctr-013',
    action: 'ASSIGNED',
    userId: 'usr-006',
    createdAt: '2026-02-13T10:00:00.000Z',
    field: 'responsibleId',
    oldValue: 'Luis Hernández',
    newValue: 'Ana Torres',
  },
  {
    id: 'aud-122',
    contractId: 'ctr-013',
    action: 'SUBMITTED',
    userId: 'usr-001',
    createdAt: '2026-02-15T11:30:00.000Z',
    field: 'status',
    oldValue: 'DRAFT',
    newValue: 'SUBMITTED',
  },
  {
    id: 'aud-123',
    contractId: 'ctr-013',
    action: 'ADMIN_APPROVED',
    userId: 'usr-006',
    createdAt: '2026-02-20T10:40:00.000Z',
    field: 'status',
    oldValue: 'ADMIN_REVIEW',
    newValue: 'LAWYER_REVIEW',
  },

  // ctr-014 — draft only
  {
    id: 'aud-130',
    contractId: 'ctr-014',
    action: 'CREATED',
    userId: 'usr-002',
    createdAt: '2026-02-14T14:00:00.000Z',
  },
];
