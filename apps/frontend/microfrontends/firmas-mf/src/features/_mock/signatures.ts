// Mock data layer for the Firmas (signatures) microfrontend.
//
// In the real CLM these contracts and signatures come from the backend.
// Here everything is seeded data persisted in localStorage under the key
// `aletheia_signatures`, so changes survive page reloads within the browser.

export type ContractStatus = 'SIGNING' | 'SIGNED';

/** A legal representative (apoderado) authorized to sign on behalf of a society. */
export interface Attorney {
  id: string;
  name: string;
  /** Tipo de poder legal (e.g. "Poder general para actos de administración"). */
  legalPower: string;
}

/** A registered signature: the base64 image plus its metadata. */
export interface SignatureRecord {
  /** base64 dataURL produced by canvas.toDataURL(). */
  image: string;
  /** Apoderado asociado a la firma. */
  attorneyId: string;
  /** Quién firmó (nombre del firmante). */
  signedBy: string;
  /** Fecha ISO de la firma. */
  signedAt: string;
}

/** A contract that can be signed. */
export interface SignatureContract {
  id: string;
  /** Folio legible del contrato. */
  folio: string;
  /** Proveedor / contraparte. */
  provider: string;
  /** Sociedad firmante. */
  society: string;
  status: ContractStatus;
  /** Presente sólo cuando status === 'SIGNED'. */
  signature?: SignatureRecord;
}

/** Catálogo mock de apoderados. */
export const ATTORNEYS: Attorney[] = [
  {
    id: 'apo-001',
    name: 'Lic. María Fernanda Robles',
    legalPower: 'Poder general para actos de administración',
  },
  { id: 'apo-002', name: 'Lic. Jorge Alberto Núñez', legalPower: 'Poder para actos de dominio' },
  {
    id: 'apo-003',
    name: 'Lic. Sofía Hernández Vega',
    legalPower: 'Poder para pleitos y cobranzas',
  },
  {
    id: 'apo-004',
    name: 'Lic. Ricardo Mendoza Salas',
    legalPower: 'Poder general limitado a contratos',
  },
];

/** Resuelve un apoderado por id. */
export function attorneyById(id: string | undefined): Attorney | undefined {
  if (!id) return undefined;
  return ATTORNEYS.find((a) => a.id === id);
}

// Pequeño dataURL PNG de ejemplo (un trazo simple) para los contratos ya firmados.
// Es válido para <img src=...> sin depender del backend.
const SAMPLE_SIGNATURE_DATAURL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAAAAXNSR0IArs4c6QAAAUlJREFUeF7t1jEKwkAQRuG3KQQrwQt4Bm9g5wU8gKWVjYWVlYWFhYWVjY2NhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYUDi0gSTYIQ1mRn5/3LzM5kU0qpxQ0BAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQGB/wMfQ4D+vP+t5wAAAABJRU5ErkJggg==';

/** Semilla inicial: 3 contratos en SIGNING y 2 ya SIGNED. */
export function seedContracts(): SignatureContract[] {
  return [
    {
      id: 'ctr-1001',
      folio: 'CLM-2026-0142',
      provider: 'Suministros Industriales del Norte, S.A.',
      society: 'Aletheia Holding, S.A. de C.V.',
      status: 'SIGNING',
    },
    {
      id: 'ctr-1002',
      folio: 'CLM-2026-0157',
      provider: 'Tecnología y Servicios Lumen, S. de R.L.',
      society: 'Aletheia Servicios, S.A. de C.V.',
      status: 'SIGNING',
    },
    {
      id: 'ctr-1003',
      folio: 'CLM-2026-0163',
      provider: 'Logística Integral Pacífico, S.A.P.I.',
      society: 'Aletheia Logística, S. de R.L.',
      status: 'SIGNING',
    },
    {
      id: 'ctr-1004',
      folio: 'CLM-2026-0118',
      provider: 'Constructora Vértice, S.A. de C.V.',
      society: 'Aletheia Inmobiliaria, S.A.P.I.',
      status: 'SIGNING',
    },
    {
      id: 'ctr-0987',
      folio: 'CLM-2026-0098',
      provider: 'Papelera Continental, S.A. de C.V.',
      society: 'Aletheia Holding, S.A. de C.V.',
      status: 'SIGNED',
      signature: {
        image: SAMPLE_SIGNATURE_DATAURL,
        attorneyId: 'apo-001',
        signedBy: 'Firmante Demo',
        signedAt: '2026-05-21T16:42:00.000Z',
      },
    },
    {
      id: 'ctr-0962',
      folio: 'CLM-2026-0071',
      provider: 'Energía Renovable del Bajío, S.A.P.I.',
      society: 'Aletheia Servicios, S.A. de C.V.',
      status: 'SIGNED',
      signature: {
        image: SAMPLE_SIGNATURE_DATAURL,
        attorneyId: 'apo-002',
        signedBy: 'Firmante Demo',
        signedAt: '2026-05-19T11:15:00.000Z',
      },
    },
  ];
}

export const STORAGE_KEY = 'aletheia_signatures';
