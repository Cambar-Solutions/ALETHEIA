'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@aletheia/frontend-commons';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { EmptyState } from '../../../components/EmptyState';
import { PageShell } from '../../../components/PageShell';
import { TimelineIcon } from '../../../components/ui/icons';
import { useWorkflow } from '../../_shared/useWorkflow';
import { STATUS_LABELS, statusBadgeVariant } from '../../_shared/workflow-rules';
import { TimelineList } from './TimelineList';

export function WorkflowTimeline() {
  const wf = useWorkflow();
  const searchParams = useSearchParams();
  const initial = searchParams.get('contract');

  const [selectedId, setSelectedId] = useState<string | null>(initial);

  // Default to the first contract once hydrated if nothing is selected.
  useEffect(() => {
    if (!wf.hydrated) return;
    if (selectedId && wf.getContract(selectedId)) return;
    const first = wf.contracts[0];
    setSelectedId(first ? first.id : null);
  }, [wf.hydrated, wf.contracts, wf.getContract, selectedId]);

  const contract = selectedId ? wf.getContract(selectedId) : undefined;
  const transitions = useMemo(
    () => (selectedId ? wf.transitionsFor(selectedId) : []),
    [wf, selectedId],
  );

  return (
    <PageShell
      title="Línea de tiempo del flujo"
      subtitle="Historial cronológico de transiciones de un contrato"
      active="timeline"
    >
      {!wf.hydrated ? (
        <EmptyState title="Cargando historial…" />
      ) : wf.contracts.length === 0 ? (
        <EmptyState
          icon={<TimelineIcon className="h-10 w-10" />}
          title="No hay contratos"
          description="No existen contratos para mostrar su historial."
        />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Selecciona un contrato</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {wf.contracts.map((c) => {
                  const isActive = c.id === selectedId;
                  return (
                    <Button
                      key={c.id}
                      variant={isActive ? 'default' : 'neutral'}
                      size="sm"
                      onClick={() => setSelectedId(c.id)}
                    >
                      {c.folio}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {contract ? (
            <Card>
              <CardHeader className="gap-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{contract.folio}</CardTitle>
                    <p className="font-mono text-sm text-foreground/80">{contract.provider}</p>
                    <p className="font-mono text-xs text-foreground/50">
                      {contract.society} · {contract.area} · Solicitó {contract.requestedBy}
                    </p>
                  </div>
                  <Badge variant={statusBadgeVariant(contract.status)}>
                    {STATUS_LABELS[contract.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {transitions.length === 0 ? (
                  <p className="font-mono text-sm text-foreground/50">
                    Este contrato aún no tiene transiciones registradas.
                  </p>
                ) : (
                  <>
                    <p className="mb-6 font-mono text-xs text-foreground/50">
                      {transitions.length} transicion{transitions.length === 1 ? '' : 'es'} · orden
                      cronológico (más antigua arriba)
                    </p>
                    <TimelineList transitions={transitions} />
                  </>
                )}
              </CardContent>
            </Card>
          ) : null}

          <div>
            <Link href="/">
              <Button variant="neutral" size="sm">
                Volver al panel de revisión
              </Button>
            </Link>
          </div>
        </>
      )}
    </PageShell>
  );
}
