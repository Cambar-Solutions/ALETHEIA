// Mock contracts used by the contract-editor flow (HU-19).
// A contract belongs to a society; only templates of that society (or General)
// are eligible to seed its document.

export interface MockContract {
  id: string;
  title: string;
  societyId: string | null;
  counterparty: string;
}

export const MOCK_CONTRACTS: MockContract[] = [
  {
    id: 'CLM-2026-0101',
    title: 'Servicios de consultoría — TechCorp',
    societyId: 'soc-001',
    counterparty: 'TechCorp México, S.A. de C.V.',
  },
  {
    id: 'CLM-2026-0102',
    title: 'Arrendamiento de bodega — Norte',
    societyId: 'soc-004',
    counterparty: 'Inmuebles del Norte, S.A.',
  },
  {
    id: 'CLM-2026-0103',
    title: 'Transporte de mercancías — Rutas MX',
    societyId: 'soc-003',
    counterparty: 'Rutas MX Logística, S. de R.L.',
  },
];

export const CONTRACT_DOCS_STORAGE_KEY = 'aletheia_contract_docs';

/** Lee el documento HTML guardado de un contrato (si existe). */
export function readContractDoc(contractId: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CONTRACT_DOCS_STORAGE_KEY);
    if (!raw) return null;
    const map = JSON.parse(raw) as Record<string, string>;
    return map[contractId] ?? null;
  } catch {
    return null;
  }
}

/** Persiste el documento HTML editado de un contrato. */
export function writeContractDoc(contractId: string, html: string): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(CONTRACT_DOCS_STORAGE_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, string>) : {};
    map[contractId] = html;
    window.localStorage.setItem(CONTRACT_DOCS_STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}
