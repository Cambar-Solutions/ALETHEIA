// Expiry (vigencia) helpers — pure functions over ISO date strings.
import { TODAY } from './documents';
import type { ExpiryStatus } from './types';

/** Days within which a document is considered "próximo a vencer". */
export const EXPIRY_WARNING_DAYS = 30;

/** Whole-day difference between two ISO dates (yyyy-mm-dd): to - from. */
export function daysBetween(fromIso: string, toIso: string): number {
  const from = new Date(`${fromIso}T00:00:00Z`).getTime();
  const to = new Date(`${toIso}T00:00:00Z`).getTime();
  return Math.round((to - from) / 86_400_000);
}

/** Classifies an expiry date against the base "today". */
export function getExpiryStatus(expiryDate?: string, today: string = TODAY): ExpiryStatus {
  if (!expiryDate) return 'SIN_VIGENCIA';
  const remaining = daysBetween(today, expiryDate);
  if (remaining < 0) return 'VENCIDO';
  if (remaining <= EXPIRY_WARNING_DAYS) return 'PROXIMO';
  return 'VIGENTE';
}

export const EXPIRY_STATUS_LABELS: Record<ExpiryStatus, string> = {
  VIGENTE: 'Vigente',
  PROXIMO: 'Próximo a vencer',
  VENCIDO: 'Vencido',
  SIN_VIGENCIA: 'Sin vigencia',
};

/** Badge variant per expiry status (Neobrutalism palette). */
export const EXPIRY_BADGE_VARIANT: Record<
  ExpiryStatus,
  'default' | 'secondary' | 'destructive' | 'neutral' | 'outline'
> = {
  VIGENTE: 'default',
  PROXIMO: 'secondary',
  VENCIDO: 'destructive',
  SIN_VIGENCIA: 'outline',
};
