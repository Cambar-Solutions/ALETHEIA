// Catalog of required documents per provider type (HU-08).
import type { DocumentKey, ProviderType } from '../types';

export interface RequiredDocument {
  key: DocumentKey;
  /** Human label shown in the UI (Spanish). */
  label: string;
  /** Whether an expiry date is typically tracked for this document. */
  tracksExpiry: boolean;
}

const CATALOG: Record<DocumentKey, { label: string; tracksExpiry: boolean }> = {
  INE: { label: 'INE', tracksExpiry: true },
  RFC: { label: 'RFC', tracksExpiry: false },
  CURP: { label: 'CURP', tracksExpiry: false },
  COMPROBANTE_DOMICILIO: { label: 'Comprobante de domicilio', tracksExpiry: true },
  CEDULA_FISCAL: { label: 'Cédula fiscal', tracksExpiry: false },
  CARATULA_ESTADO_CUENTA: { label: 'Carátula de estado de cuenta', tracksExpiry: true },
  ACTA_CONSTITUTIVA: { label: 'Acta Constitutiva', tracksExpiry: false },
  PODER_NOTARIAL: { label: 'Poder Notarial', tracksExpiry: true },
};

const REQUIRED_KEYS: Record<ProviderType, DocumentKey[]> = {
  PERSONA_FISICA: [
    'INE',
    'RFC',
    'CURP',
    'COMPROBANTE_DOMICILIO',
    'CEDULA_FISCAL',
    'CARATULA_ESTADO_CUENTA',
  ],
  PERSONA_MORAL: [
    'RFC',
    'COMPROBANTE_DOMICILIO',
    'ACTA_CONSTITUTIVA',
    'PODER_NOTARIAL',
    'CEDULA_FISCAL',
    'CARATULA_ESTADO_CUENTA',
  ],
};

/** Returns the ordered list of required documents for a provider type. */
export function getRequiredDocuments(providerType: ProviderType): RequiredDocument[] {
  return REQUIRED_KEYS[providerType].map((key) => ({ key, ...CATALOG[key] }));
}

/** Looks up the human label for a document key. */
export function getDocumentLabel(key: DocumentKey): string {
  return CATALOG[key].label;
}

export const PROVIDER_TYPE_LABELS: Record<ProviderType, string> = {
  PERSONA_FISICA: 'Persona Física',
  PERSONA_MORAL: 'Persona Moral',
};
