'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@aletheia/frontend-commons';
import Link from 'next/link';
import { useMemo } from 'react';
import { EmptyState } from '../../../components/EmptyState';
import { PageShell } from '../../../components/PageShell';
import { GaugeIcon } from '../../../components/ui/icons';
import { SlaBadge, SlaIndicator } from '../../../components/ui/sla-indicator';
import { SLA_TRACKED_STATUSES } from '../../_mock/workflow';
import { BASE_NOW } from '../../_shared/now';
import { useWorkflow } from '../../_shared/useWorkflow';
import {
  STATUS_LABELS,
  type SlaLevel,
  computeSla,
  formatDuration,
} from '../../_shared/workflow-rules';
import { SlaSummary } from './SlaSummary';

export function SlaDashboard() {
  const wf = useWorkflow();

  const rows = useMemo(() => {
    if (!wf.hydrated) return [];
    return (
      wf
        .listByStatus(SLA_TRACKED_STATUSES)
        .map((c) => ({ contract: c, sla: computeSla(c.status, c.enteredAt, BASE_NOW) }))
        // worst SLA first (highest consumed ratio)
        .sort((a, b) => (b.sla.ratio ?? 0) - (a.sla.ratio ?? 0))
    );
  }, [wf]);

  const counts = useMemo(() => {
    const acc: Record<SlaLevel, number> = { green: 0, yellow: 0, red: 0, none: 0 };
    for (const r of rows) acc[r.sla.level] += 1;
    return acc;
  }, [rows]);

  return (
    <PageShell
      title="Semáforo SLA"
      subtitle={`Tiempo de cada contrato en su etapa actual frente al SLA (base ${BASE_NOW.toLocaleDateString('es-MX')})`}
      active="sla"
    >
      {!wf.hydrated ? (
        <EmptyState title="Cargando indicadores…" />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={<GaugeIcon className="h-10 w-10" />}
          title="No hay contratos en revisión"
          description="No existen contratos en etapas con SLA para mostrar."
        />
      ) : (
        <>
          <SlaSummary counts={counts} />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <GaugeIcon className="h-5 w-5" />
                Contratos en revisión ({rows.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Folio</TableHead>
                    <TableHead>Etapa</TableHead>
                    <TableHead>Transcurrido</TableHead>
                    <TableHead>SLA</TableHead>
                    <TableHead>Consumo</TableHead>
                    <TableHead className="text-right">Indicador</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map(({ contract, sla }) => (
                    <TableRow key={contract.id}>
                      <TableCell>
                        <Link
                          href={`/timeline?contract=${contract.id}`}
                          className="font-heading hover:underline"
                        >
                          {contract.folio}
                        </Link>
                        <span className="block text-xs text-foreground/50">
                          {contract.provider}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{STATUS_LABELS[contract.status]}</Badge>
                      </TableCell>
                      <TableCell>{formatDuration(sla.elapsedHours)}</TableCell>
                      <TableCell>{sla.slaHours} h</TableCell>
                      <TableCell className="min-w-40">
                        <SlaIndicator sla={sla} />
                      </TableCell>
                      <TableCell className="text-right">
                        <SlaBadge sla={sla} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <p className="font-mono text-xs text-foreground/50">
            Verde: menos del 60% del SLA consumido · Amarillo: entre 60% y 100% · Rojo: SLA superado
            (100% o más). El cálculo usa el momento en que el contrato entró a su etapa actual.
          </p>

          <div>
            <Link href="/">
              <Button variant="neutral" size="sm">
                Ir al panel de revisión
              </Button>
            </Link>
          </div>
        </>
      )}
    </PageShell>
  );
}
