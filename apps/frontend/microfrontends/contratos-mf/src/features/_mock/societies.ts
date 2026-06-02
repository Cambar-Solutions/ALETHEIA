// Mock societies (sociedades) shared across features.
// In the real CLM these come from the backend; here they are static seed data.

export interface Society {
  id: string;
  name: string;
}

export const SOCIETIES: Society[] = [
  { id: 'soc-001', name: 'Aletheia Holding, S.A. de C.V.' },
  { id: 'soc-002', name: 'Aletheia Servicios, S.A. de C.V.' },
  { id: 'soc-003', name: 'Aletheia Logística, S. de R.L.' },
  { id: 'soc-004', name: 'Aletheia Inmobiliaria, S.A.P.I.' },
];

/** Resuelve el nombre legible de una sociedad; null => "General". */
export function societyName(societyId: string | null): string {
  if (!societyId) return 'General';
  return SOCIETIES.find((s) => s.id === societyId)?.name ?? 'General';
}
