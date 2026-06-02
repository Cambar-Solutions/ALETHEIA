'use client';

import { useRole } from '@aletheia/frontend-commons';
import * as React from 'react';
import { type Contract, type ContractStatus, USER_AREA, computeSla } from '../../_mock/contracts';

export interface ContractFilters {
  search: string;
  status: ContractStatus | 'ALL';
  area: string | 'ALL';
}

const INITIAL: ContractFilters = { search: '', status: 'ALL', area: 'ALL' };

/**
 * Applies RBAC view-scoping + UI filters.
 * - CONTRACT_VIEW_ALL  → sees everything.
 * - CONTRACT_VIEW_AREA → restricted to the user's fixed mock area.
 */
export function useContractFilters(contracts: Contract[]) {
  const { can } = useRole();
  const [filters, setFilters] = React.useState<ContractFilters>(INITIAL);

  const viewAll = can('CONTRACT_VIEW_ALL');
  const viewAreaOnly = !viewAll && can('CONTRACT_VIEW_AREA');

  const scoped = React.useMemo(() => {
    if (viewAll) return contracts;
    if (viewAreaOnly) return contracts.filter((c) => c.area === USER_AREA);
    return [];
  }, [contracts, viewAll, viewAreaOnly]);

  const filtered = React.useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return scoped.filter((c) => {
      if (filters.status !== 'ALL' && c.status !== filters.status) return false;
      if (filters.area !== 'ALL' && c.area !== filters.area) return false;
      if (q) {
        const haystack = `${c.folio} ${c.title} ${c.providerName}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [scoped, filters]);

  const withSla = React.useMemo(
    () => filtered.map((c) => ({ contract: c, sla: computeSla(c) })),
    [filtered],
  );

  const update = React.useCallback((patch: Partial<ContractFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = React.useCallback(() => setFilters(INITIAL), []);

  return {
    filters,
    update,
    reset,
    rows: withSla,
    scopedCount: scoped.length,
    viewAll,
    viewAreaOnly,
    noAccess: !viewAll && !viewAreaOnly,
  };
}
