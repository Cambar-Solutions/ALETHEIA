'use client';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  useRole,
} from '@aletheia/frontend-commons';
import { ArrowLeft, Pencil, RotateCcw, Send, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import {
  type Contract,
  PROVIDER_TYPE_LABEL,
  computeSla,
  useContracts,
} from '../../_mock/contracts';
import { CancelContractModal } from '../../_shared/components/CancelContractModal';
import { PageHeader } from '../../_shared/components/PageHeader';
import { RequiredDocsList } from '../../_shared/components/RequiredDocsList';
import { SlaIndicator } from '../../_shared/components/SlaIndicator';
import { StatusBadge } from '../../_shared/components/StatusBadge';
import { formatDate } from '../../_shared/lib/format';
import { AuditTimeline } from './AuditTimeline';

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b-2 border-border/40 py-2 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="font-heading text-xs tracking-widest uppercase text-foreground/60">
        {label}
      </span>
      <span className="font-mono text-sm">{children}</span>
    </div>
  );
}

export function ContractDetailView({ contractId }: { contractId: string }) {
  const router = useRouter();
  const { ready, getById, submitContract, cancelContract, recoverContract } = useContracts();
  const { can } = useRole();
  const [cancelOpen, setCancelOpen] = React.useState(false);

  const contract = getById(contractId) as Contract | undefined;

  if (!ready) {
    return (
      <main className="bg-grid min-h-screen p-6">
        <div className="mx-auto max-w-4xl">
          <p className="font-mono text-sm text-foreground/40">Cargando…</p>
        </div>
      </main>
    );
  }

  if (!contract) {
    return (
      <main className="bg-grid min-h-screen p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <PageHeader title="Solicitud" />
          <Card>
            <CardContent className="space-y-4 p-6">
              <p className="font-mono text-sm text-foreground/70">Solicitud no encontrada.</p>
              <Button variant="neutral" size="sm" onClick={() => router.push('/')}>
                <ArrowLeft className="h-4 w-4" /> Volver al listado
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const isDraft = contract.status === 'DRAFT';
  const isCancelled = contract.status === 'CANCELLED';
  const isTerminal =
    contract.status === 'SIGNED' ||
    contract.status === 'CANCELLED' ||
    contract.status === 'REJECTED';

  const canEdit = can('CONTRACT_EDIT') && isDraft;
  const canSubmit = can('CONTRACT_SUBMIT') && isDraft;
  const canCancel = can('CONTRACT_CANCEL') && !isTerminal;
  const canRecover = can('CONTRACT_RECOVER') && isCancelled;
  const hasActions = canEdit || canSubmit || canCancel || canRecover;

  const sla = computeSla(contract);

  return (
    <main className="bg-grid min-h-screen p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <PageHeader
          title={contract.title}
          subtitle={contract.folio}
          actions={
            <Button variant="neutral" size="sm" onClick={() => router.push('/')}>
              <ArrowLeft className="h-4 w-4" /> Volver
            </Button>
          }
        />

        {/* Status + SLA strip */}
        <div className="flex flex-wrap items-center gap-3 rounded-base border-2 border-border bg-background px-4 py-3 shadow-shadow">
          <span className="font-heading text-xs tracking-widest uppercase text-foreground/60">
            Estado
          </span>
          <StatusBadge status={contract.status} />
          <span className="mx-1 h-5 w-[2px] bg-border" aria-hidden />
          <span className="font-heading text-xs tracking-widest uppercase text-foreground/60">
            SLA
          </span>
          <SlaIndicator level={sla} />
        </div>

        {/* Action bar */}
        {hasActions && (
          <div className="flex flex-wrap gap-2">
            {canEdit && (
              <Button
                variant="neutral"
                size="sm"
                onClick={() => router.push(`/crear?id=${contract.id}`)}
              >
                <Pencil className="h-4 w-4" /> Editar
              </Button>
            )}
            {canSubmit && (
              <Button size="sm" onClick={() => submitContract(contract.id)}>
                <Send className="h-4 w-4" /> Enviar a revisión
              </Button>
            )}
            {canRecover && (
              <Button variant="secondary" size="sm" onClick={() => recoverContract(contract.id)}>
                <RotateCcw className="h-4 w-4" /> Recuperar
              </Button>
            )}
            {canCancel && (
              <Button variant="destructive" size="sm" onClick={() => setCancelOpen(true)}>
                <XCircle className="h-4 w-4" /> Cancelar
              </Button>
            )}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-5">
          {/* General data */}
          <div className="space-y-6 lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Datos generales</CardTitle>
              </CardHeader>
              <CardContent>
                <InfoRow label="Folio">{contract.folio}</InfoRow>
                <InfoRow label="Sociedad">{contract.society}</InfoRow>
                <InfoRow label="Área requirente">{contract.area}</InfoRow>
                <InfoRow label="Proveedor">{contract.providerName}</InfoRow>
                <InfoRow label="Email">{contract.providerEmail}</InfoRow>
                <InfoRow label="Tipo de proveedor">
                  {PROVIDER_TYPE_LABEL[contract.providerType]}
                </InfoRow>
                <InfoRow label="Creada">{formatDate(contract.createdAt)}</InfoRow>
                <InfoRow label="Actualizada">{formatDate(contract.updatedAt)}</InfoRow>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documentos requeridos</CardTitle>
                <CardDescription>Según tipo de proveedor (informativo)</CardDescription>
              </CardHeader>
              <CardContent>
                <RequiredDocsList providerType={contract.providerType} />
              </CardContent>
            </Card>
          </div>

          {/* Bitácora */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Bitácora</CardTitle>
                <CardDescription>Historial cronológico</CardDescription>
              </CardHeader>
              <CardContent>
                <AuditTimeline entries={contract.log} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CancelContractModal
        contract={cancelOpen ? contract : null}
        onClose={() => setCancelOpen(false)}
        onConfirm={(reason) => {
          cancelContract(contract.id, reason);
          setCancelOpen(false);
        }}
      />
    </main>
  );
}
