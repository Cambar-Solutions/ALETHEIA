// Domain types shared across the documentos-mf features.
// All UI text is in Spanish; code stays in English.

/** Provider type drives which documents are required. */
export type ProviderType = 'PERSONA_FISICA' | 'PERSONA_MORAL';

/** Catalog key for a required document (stable identifier). */
export type DocumentKey =
  | 'INE'
  | 'RFC'
  | 'CURP'
  | 'COMPROBANTE_DOMICILIO'
  | 'CEDULA_FISCAL'
  | 'CARATULA_ESTADO_CUENTA'
  | 'ACTA_CONSTITUTIVA'
  | 'PODER_NOTARIAL';

/** A single uploaded version of a document. */
export interface DocumentVersion {
  /** Sequential version number, starting at 1. */
  version: number;
  fileName: string;
  /** File size in bytes. */
  size: number;
  mimeType: string;
  /** User who uploaded this version. */
  uploadedBy: string;
  /** ISO date string (yyyy-mm-dd) when it was uploaded. */
  uploadedAt: string;
}

/** A required document attached to a contract, with its version history. */
export interface DocumentRecord {
  id: string;
  /** Contract this document belongs to. */
  contractId: string;
  /** Catalog key (INE, RFC, ...). */
  key: DocumentKey;
  /** Provider type the document was requested for. */
  providerType: ProviderType;
  /** Active (latest) version number. */
  currentVersion: number;
  /** Optional expiry date (ISO yyyy-mm-dd). */
  expiryDate?: string;
  /** Full version history (latest last). */
  versions: DocumentVersion[];
}

/** Vigencia (expiry) status computed against the base "today". */
export type ExpiryStatus = 'VIGENTE' | 'PROXIMO' | 'VENCIDO' | 'SIN_VIGENCIA';

/** Upload status for a required-document slot. */
export type UploadStatus = 'PENDIENTE' | 'CARGADO';
