'use client';

import { useMemo } from 'react';
import { AUDIT_LOG, type AuditEntry, CONTRACTS } from '../../_mock/reports';

/**
 * Returns the full audit trail for a contract, sorted newest-first (HU-24).
 * `contractId` empty/unknown => empty list.
 */
export function useAuditLog(contractId: string) {
  const contract = useMemo(() => CONTRACTS.find((c) => c.id === contractId) ?? null, [contractId]);

  const entries = useMemo<AuditEntry[]>(() => {
    if (!contractId) return [];
    return AUDIT_LOG.filter((e) => e.contractId === contractId).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [contractId]);

  return { contract, entries };
}
