// Mock persistence layer for documents — React state + localStorage.
// No backend: this is the single source of truth for the documentos-mf MF.
import type { DocumentRecord } from './types';

export const STORAGE_KEY = 'aletheia_documents';

/**
 * Base "today" used by every expiry calculation. Keeping it as a constant
 * makes the vigencia view deterministic regardless of the real wall clock.
 */
export const TODAY = '2026-06-02';

/** Demo contracts surfaced in selectors. */
export const CONTRACTS: { id: string; label: string }[] = [
  { id: 'CTR-2026-001', label: 'CTR-2026-001 · Servicios TI (PF)' },
  { id: 'CTR-2026-002', label: 'CTR-2026-002 · Suministros Industriales (PM)' },
];

/** Seed documents: a mix of vigente / próximo / vencido, with version history. */
export const SEED_DOCUMENTS: DocumentRecord[] = [
  // ── CTR-2026-001 · Persona Física ──────────────────────────────
  {
    id: 'doc-001',
    contractId: 'CTR-2026-001',
    key: 'INE',
    providerType: 'PERSONA_FISICA',
    currentVersion: 2,
    expiryDate: '2026-05-20', // VENCIDO
    versions: [
      {
        version: 1,
        fileName: 'ine_frente.pdf',
        size: 184_320,
        mimeType: 'application/pdf',
        uploadedBy: 'Ana Solís',
        uploadedAt: '2026-04-10',
      },
      {
        version: 2,
        fileName: 'ine_frente_v2.pdf',
        size: 192_004,
        mimeType: 'application/pdf',
        uploadedBy: 'Ana Solís',
        uploadedAt: '2026-04-28',
      },
    ],
  },
  {
    id: 'doc-002',
    contractId: 'CTR-2026-001',
    key: 'RFC',
    providerType: 'PERSONA_FISICA',
    currentVersion: 1,
    versions: [
      {
        version: 1,
        fileName: 'constancia_rfc.pdf',
        size: 96_512,
        mimeType: 'application/pdf',
        uploadedBy: 'Ana Solís',
        uploadedAt: '2026-04-10',
      },
    ],
  },
  {
    id: 'doc-003',
    contractId: 'CTR-2026-001',
    key: 'COMPROBANTE_DOMICILIO',
    providerType: 'PERSONA_FISICA',
    currentVersion: 1,
    expiryDate: '2026-06-15', // PROXIMO (dentro de 30 días)
    versions: [
      {
        version: 1,
        fileName: 'recibo_cfe.pdf',
        size: 210_944,
        mimeType: 'application/pdf',
        uploadedBy: 'Ana Solís',
        uploadedAt: '2026-05-01',
      },
    ],
  },
  {
    id: 'doc-004',
    contractId: 'CTR-2026-001',
    key: 'CARATULA_ESTADO_CUENTA',
    providerType: 'PERSONA_FISICA',
    currentVersion: 1,
    expiryDate: '2026-09-30', // VIGENTE
    versions: [
      {
        version: 1,
        fileName: 'caratula_bancomer.png',
        size: 512_000,
        mimeType: 'image/png',
        uploadedBy: 'Ana Solís',
        uploadedAt: '2026-05-03',
      },
    ],
  },

  // ── CTR-2026-002 · Persona Moral ───────────────────────────────
  {
    id: 'doc-005',
    contractId: 'CTR-2026-002',
    key: 'RFC',
    providerType: 'PERSONA_MORAL',
    currentVersion: 1,
    versions: [
      {
        version: 1,
        fileName: 'rfc_empresa.pdf',
        size: 128_000,
        mimeType: 'application/pdf',
        uploadedBy: 'Luis Maya',
        uploadedAt: '2026-04-15',
      },
    ],
  },
  {
    id: 'doc-006',
    contractId: 'CTR-2026-002',
    key: 'ACTA_CONSTITUTIVA',
    providerType: 'PERSONA_MORAL',
    currentVersion: 3,
    versions: [
      {
        version: 1,
        fileName: 'acta_v1.pdf',
        size: 1_048_576,
        mimeType: 'application/pdf',
        uploadedBy: 'Luis Maya',
        uploadedAt: '2026-04-15',
      },
      {
        version: 2,
        fileName: 'acta_v2.pdf',
        size: 1_120_000,
        mimeType: 'application/pdf',
        uploadedBy: 'Luis Maya',
        uploadedAt: '2026-04-22',
      },
      {
        version: 3,
        fileName: 'acta_v3_corregida.pdf',
        size: 1_133_456,
        mimeType: 'application/pdf',
        uploadedBy: 'Roberto Díaz',
        uploadedAt: '2026-05-05',
      },
    ],
  },
  {
    id: 'doc-007',
    contractId: 'CTR-2026-002',
    key: 'PODER_NOTARIAL',
    providerType: 'PERSONA_MORAL',
    currentVersion: 1,
    expiryDate: '2026-06-25', // PROXIMO
    versions: [
      {
        version: 1,
        fileName: 'poder_notarial.pdf',
        size: 765_432,
        mimeType: 'application/pdf',
        uploadedBy: 'Luis Maya',
        uploadedAt: '2026-05-02',
      },
    ],
  },
  {
    id: 'doc-008',
    contractId: 'CTR-2026-002',
    key: 'COMPROBANTE_DOMICILIO',
    providerType: 'PERSONA_MORAL',
    currentVersion: 1,
    expiryDate: '2026-03-31', // VENCIDO
    versions: [
      {
        version: 1,
        fileName: 'domicilio_fiscal.pdf',
        size: 198_000,
        mimeType: 'application/pdf',
        uploadedBy: 'Luis Maya',
        uploadedAt: '2026-02-20',
      },
    ],
  },
];

/** Reads the persisted store, seeding it on first run. */
export function readStore(): DocumentRecord[] {
  if (typeof window === 'undefined') return SEED_DOCUMENTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DOCUMENTS));
      return SEED_DOCUMENTS;
    }
    return JSON.parse(raw) as DocumentRecord[];
  } catch {
    return SEED_DOCUMENTS;
  }
}

/** Persists the store. */
export function writeStore(records: DocumentRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // ignore quota / serialization errors in the mock
  }
}
