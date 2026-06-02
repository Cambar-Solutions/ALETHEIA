'use client';

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@aletheia/frontend-commons';
import { useMemo, useState } from 'react';
import { AlertIcon, ClockIcon } from '../../../components/ui/icons';
import { Select } from '../../../components/ui/select';
import { PROVIDER_TYPE_LABELS, getDocumentLabel } from '../../_mock/data/requirements';
import { CONTRACTS, TODAY } from '../../_mock/documents';
import {
  EXPIRY_BADGE_VARIANT,
  EXPIRY_STATUS_LABELS,
  daysBetween,
  getExpiryStatus,
} from '../../_mock/expiry';
import { formatDate } from '../../_mock/format';
import type { ExpiryStatus } from '../../_mock/types';
import { useDocuments } from '../../_mock/useDocuments';

type StatusFilter = ExpiryStatus | 'TODOS';

const FILTER_LABELS: Record<StatusFilter, string> = {
  TODOS: 'Todos',
  VENCIDO: 'Vencidos',
  PROXIMO: 'Próximos a vencer',
  VIGENTE: 'Vigentes',
  SIN_VIGENCIA: 'Sin vigencia',
};

function remainingLabel(status: ExpiryStatus, expiryDate?: string): string {
  if (!expiryDate || status === 'SIN_VIGENCIA') return '—';
  const days = daysBetween(TODAY, expiryDate);
  if (status === 'VENCIDO') return `Hace ${Math.abs(days)} día(s)`;
  return `En ${days} día(s)`;
}

export function ExpiryAlertsView() {
  const { ready, documents } = useDocuments();
  const [filter, setFilter] = useState<StatusFilter>('TODOS');

  const rows = useMemo(
    () =>
      documents
        .map((d) => ({ doc: d, status: getExpiryStatus(d.expiryDate) }))
        .sort((a, b) => {
          // Vencido < Próximo < Vigente < Sin vigencia
          const order: ExpiryStatus[] = ['VENCIDO', 'PROXIMO', 'VIGENTE', 'SIN_VIGENCIA'];
          return order.indexOf(a.status) - order.indexOf(b.status);
        }),
    [documents],
  );

  const counts = useMemo(() => {
    const acc: Record<ExpiryStatus, number> = {
      VENCIDO: 0,
      PROXIMO: 0,
      VIGENTE: 0,
      SIN_VIGENCIA: 0,
    };
    for (const r of rows) acc[r.status] += 1;
    return acc;
  }, [rows]);

  const filtered = filter === 'TODOS' ? rows : rows.filter((r) => r.status === filter);

  const contractLabel = (id: string) => CONTRACTS.find((c) => c.id === id)?.id ?? id;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Control de vigencia</CardTitle>
          <CardDescription>
            Estado de vigencia calculado contra la fecha base ({formatDate(TODAY)}). Próximo a
            vencer = dentro de 30 días.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-base border-2 border-border bg-background p-3 shadow-shadow">
              <div className="flex items-center gap-2 font-mono text-xs text-foreground/60">
                <AlertIcon className="h-4 w-4" />
                Vencidos
              </div>
              <div className="mt-1 font-heading text-2xl">{counts.VENCIDO}</div>
            </div>
            <div className="rounded-base border-2 border-border bg-background p-3 shadow-shadow">
              <div className="flex items-center gap-2 font-mono text-xs text-foreground/60">
                <ClockIcon className="h-4 w-4" />
                Próximos
              </div>
              <div className="mt-1 font-heading text-2xl">{counts.PROXIMO}</div>
            </div>
            <div className="rounded-base border-2 border-border bg-background p-3 shadow-shadow">
              <div className="font-mono text-xs text-foreground/60">Vigentes</div>
              <div className="mt-1 font-heading text-2xl">{counts.VIGENTE}</div>
            </div>
            <div className="rounded-base border-2 border-border bg-background p-3 shadow-shadow">
              <div className="font-mono text-xs text-foreground/60">Sin vigencia</div>
              <div className="mt-1 font-heading text-2xl">{counts.SIN_VIGENCIA}</div>
            </div>
          </div>

          <div className="max-w-xs space-y-1.5">
            <label
              htmlFor="expiry-filter"
              className="font-mono text-xs uppercase tracking-wide text-foreground/60"
            >
              Filtrar por estado
            </label>
            <Select
              id="expiry-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value as StatusFilter)}
            >
              {(Object.keys(FILTER_LABELS) as StatusFilter[]).map((f) => (
                <option key={f} value={f}>
                  {FILTER_LABELS[f]}
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {!ready ? (
            <p className="font-mono text-sm text-foreground/50">Cargando documentos…</p>
          ) : filtered.length === 0 ? (
            <p className="py-8 text-center font-mono text-sm text-foreground/50">
              No hay documentos con este estado de vigencia.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Documento</TableHead>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Vigencia</TableHead>
                  <TableHead>Restante</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(({ doc, status }) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-heading">{getDocumentLabel(doc.key)}</TableCell>
                    <TableCell>{contractLabel(doc.contractId)}</TableCell>
                    <TableCell>{PROVIDER_TYPE_LABELS[doc.providerType]}</TableCell>
                    <TableCell>{formatDate(doc.expiryDate)}</TableCell>
                    <TableCell>{remainingLabel(status, doc.expiryDate)}</TableCell>
                    <TableCell>
                      <Badge variant={EXPIRY_BADGE_VARIANT[status]}>
                        {EXPIRY_STATUS_LABELS[status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
