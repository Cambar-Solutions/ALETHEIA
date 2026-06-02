'use client';

import { Button } from '@aletheia/frontend-commons';
import { X } from 'lucide-react';
import { Select } from '../../../components/ui/select';
import { AREAS, CONTRACT_STATUSES, USERS } from '../../_mock/reports';
import type { ReportFilters } from '../hooks/useReports';

interface ReportFiltersBarProps {
  filters: ReportFilters;
  hasActiveFilters: boolean;
  onChange: <K extends keyof ReportFilters>(key: K, value: ReportFilters[K]) => void;
  onReset: () => void;
}

const STATUS_OPTIONS = CONTRACT_STATUSES.map((s) => ({ value: s.id, label: s.label }));
const AREA_OPTIONS = AREAS.map((a) => ({ value: a.id, label: a.name }));
const USER_OPTIONS = USERS.map((u) => ({ value: u.id, label: u.name }));

export function ReportFiltersBar({
  filters,
  hasActiveFilters,
  onChange,
  onReset,
}: ReportFiltersBarProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <label htmlFor="filter-status" className="flex flex-col gap-1.5">
        <span className="font-heading text-xs uppercase tracking-widest text-foreground/60">
          Estado
        </span>
        <Select
          id="filter-status"
          options={STATUS_OPTIONS}
          placeholder="Todos"
          value={filters.status}
          onChange={(e) => onChange('status', e.target.value as ReportFilters['status'])}
        />
      </label>

      <label htmlFor="filter-area" className="flex flex-col gap-1.5">
        <span className="font-heading text-xs uppercase tracking-widest text-foreground/60">
          Área
        </span>
        <Select
          id="filter-area"
          options={AREA_OPTIONS}
          placeholder="Todas"
          value={filters.areaId}
          onChange={(e) => onChange('areaId', e.target.value)}
        />
      </label>

      <label htmlFor="filter-responsible" className="flex flex-col gap-1.5">
        <span className="font-heading text-xs uppercase tracking-widest text-foreground/60">
          Responsable
        </span>
        <Select
          id="filter-responsible"
          options={USER_OPTIONS}
          placeholder="Todos"
          value={filters.responsibleId}
          onChange={(e) => onChange('responsibleId', e.target.value)}
        />
      </label>

      <div className="flex items-end">
        <Button variant="neutral" className="w-full" onClick={onReset} disabled={!hasActiveFilters}>
          <X /> Limpiar filtros
        </Button>
      </div>
    </div>
  );
}
