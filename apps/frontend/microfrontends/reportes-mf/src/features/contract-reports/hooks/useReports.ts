'use client';

import { useMemo, useState } from 'react';
import {
  CONTRACTS,
  CONTRACT_STATUSES,
  type Contract,
  type ContractStatus,
  areaName,
  statusLabel,
  userName,
} from '../../_mock/reports';

export interface ReportFilters {
  /** '' => all */
  status: ContractStatus | '';
  areaId: string;
  responsibleId: string;
}

const EMPTY_FILTERS: ReportFilters = { status: '', areaId: '', responsibleId: '' };

export interface StatusKpi {
  status: ContractStatus;
  label: string;
  count: number;
}

/* ─── CSV helpers ─────────────────────────────────────────────────────── */

const CSV_HEADERS = [
  'Folio',
  'Título',
  'Proveedor',
  'Estado',
  'Área',
  'Responsable',
  'Creado',
] as const;

/** Escapes a value for RFC-4180 CSV (quote when it contains , " or newline). */
function escapeCsv(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function contractToRow(c: Contract): string[] {
  return [
    c.folio,
    c.title,
    c.vendorName,
    statusLabel(c.status),
    areaName(c.areaId),
    userName(c.responsibleId),
    new Date(c.createdAt).toISOString().slice(0, 10),
  ];
}

/** Builds the CSV text (with header) for the given contracts. */
export function buildCsv(contracts: Contract[]): string {
  const lines = [CSV_HEADERS.join(',')];
  for (const c of contracts) {
    lines.push(contractToRow(c).map(escapeCsv).join(','));
  }
  return lines.join('\r\n');
}

/* ─── Hook ────────────────────────────────────────────────────────────── */

export function useReports() {
  const [filters, setFilters] = useState<ReportFilters>(EMPTY_FILTERS);

  const setFilter = <K extends keyof ReportFilters>(key: K, value: ReportFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(EMPTY_FILTERS);

  const hasActiveFilters =
    filters.status !== '' || filters.areaId !== '' || filters.responsibleId !== '';

  const filtered = useMemo(() => {
    return CONTRACTS.filter((c) => {
      if (filters.status && c.status !== filters.status) return false;
      if (filters.areaId && c.areaId !== filters.areaId) return false;
      if (filters.responsibleId && c.responsibleId !== filters.responsibleId) return false;
      return true;
    });
  }, [filters]);

  // KPI totals per status, computed over the filtered set, only for statuses present.
  const kpis = useMemo<StatusKpi[]>(() => {
    const counts = new Map<ContractStatus, number>();
    for (const c of filtered) {
      counts.set(c.status, (counts.get(c.status) ?? 0) + 1);
    }
    return CONTRACT_STATUSES.filter((s) => counts.has(s.id)).map((s) => ({
      status: s.id,
      label: s.label,
      count: counts.get(s.id) ?? 0,
    }));
  }, [filtered]);

  /** Generates the CSV text for the current filtered result. */
  const toCsv = () => buildCsv(filtered);

  return {
    filters,
    setFilter,
    resetFilters,
    hasActiveFilters,
    contracts: filtered,
    total: filtered.length,
    kpis,
    toCsv,
  };
}
