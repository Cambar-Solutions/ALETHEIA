'use client';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@aletheia/frontend-commons';
import { Download } from 'lucide-react';
import { downloadTextFile } from '../../../lib/download';
import { useReports } from '../hooks/useReports';
import { ContractsTable } from './ContractsTable';
import { ReportFiltersBar } from './ReportFiltersBar';
import { ReportKpis } from './ReportKpis';

export function ContractReportsPanel() {
  const { filters, setFilter, resetFilters, hasActiveFilters, contracts, total, kpis, toCsv } =
    useReports();

  const handleExport = () => {
    const csv = toCsv();
    const stamp = new Date().toISOString().slice(0, 10);
    downloadTextFile(csv, `reporte-contratos-${stamp}.csv`);
  };

  return (
    <div className="space-y-6">
      <ReportKpis total={total} kpis={kpis} />

      <Card>
        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
          <div className="space-y-1.5">
            <CardTitle>Reporte de contratos</CardTitle>
            <CardDescription>
              Filtra por estado, área y responsable. Exporta el resultado a CSV.
            </CardDescription>
          </div>
          <Button onClick={handleExport} disabled={total === 0}>
            <Download /> Exportar CSV
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <ReportFiltersBar
            filters={filters}
            hasActiveFilters={hasActiveFilters}
            onChange={setFilter}
            onReset={resetFilters}
          />
          <ContractsTable contracts={contracts} />
        </CardContent>
      </Card>
    </div>
  );
}
