'use client';

import { Badge, Button, useRole } from '@aletheia/frontend-commons';
import { useMemo, useState } from 'react';
import { EmptyState } from '../../../components/EmptyState';
import { PageShell } from '../../../components/PageShell';
import { InboxIcon } from '../../../components/ui/icons';
import type { WorkflowContract } from '../../_mock/workflow';
import { BASE_NOW } from '../../_shared/now';
import { useWorkflow } from '../../_shared/useWorkflow';
import {
  PRIVILEGE_NOT_GRANTED,
  ROLE_REVIEW_PRIVILEGE,
  STATUS_LABELS,
  queueStatusesForRole,
} from '../../_shared/workflow-rules';
import { type ReviewActionKind, ReviewActionModal } from './ReviewActionModal';
import { ReviewContractCard } from './ReviewContractCard';

// Display name used as `performedBy` when the current user acts.
const ACTOR_BY_ROLE: Record<string, string> = {
  ADMINISTRADOR: 'Carlos Admin',
  ABOGADO: 'Mariana Abogada',
  APROBADOR: 'Roberto Aprobador',
};

export function ReviewPanel() {
  const { role, can } = useRole();
  const wf = useWorkflow();

  const [modalKind, setModalKind] = useState<ReviewActionKind | null>(null);
  const [target, setTarget] = useState<WorkflowContract | null>(null);

  const queueStatuses = queueStatusesForRole(role);
  const queue = useMemo(
    () => (wf.hydrated ? wf.listByStatus(queueStatuses) : []),
    [wf, queueStatuses],
  );

  const reviewPrivilege = role ? ROLE_REVIEW_PRIVILEGE[role] : undefined;
  const hasReviewRole = queueStatuses.length > 0;
  const canReview = reviewPrivilege ? can(reviewPrivilege) : false;

  const openAction = (kind: ReviewActionKind, contract: WorkflowContract) => {
    setTarget(contract);
    setModalKind(kind);
  };

  const closeModal = () => {
    setModalKind(null);
    setTarget(null);
  };

  const handleConfirm = (comment: string) => {
    if (!target || !modalKind || !role) return;
    const performedBy = ACTOR_BY_ROLE[role] ?? role;
    if (modalKind === 'approve') wf.approve(target.id, { performedBy, comment });
    else if (modalKind === 'return') wf.returnToDraft(target.id, { performedBy, comment });
    else if (modalKind === 'reject') wf.reject(target.id, { performedBy, comment });
    closeModal();
  };

  const subtitle = hasReviewRole
    ? `Contratos en ${queueStatuses.map((s) => STATUS_LABELS[s]).join(' / ')}`
    : 'Revisión del flujo de contratos';

  return (
    <PageShell
      title="Panel de revisión"
      subtitle={subtitle}
      active="panel"
      actions={
        <Button variant="neutral" size="sm" onClick={wf.reset} title="Restaurar datos de demo">
          Reiniciar demo
        </Button>
      }
    >
      {!wf.hydrated ? (
        <EmptyState title="Cargando contratos…" />
      ) : !hasReviewRole ? (
        <EmptyState
          icon={<InboxIcon className="h-10 w-10" />}
          title="Tu rol no participa en la revisión"
          description={`El rol ${role ?? 'actual'} no tiene una cola de revisión asignada. Los roles de revisión son Administrador, Abogado y Aprobador.`}
        />
      ) : !canReview ? (
        <EmptyState
          icon={<InboxIcon className="h-10 w-10" />}
          title="Sin privilegio de revisión"
          description={PRIVILEGE_NOT_GRANTED}
        />
      ) : queue.length === 0 ? (
        <EmptyState
          icon={<InboxIcon className="h-10 w-10" />}
          title="No hay contratos pendientes"
          description="No tienes contratos esperando tu revisión en este momento."
        />
      ) : (
        <>
          <div className="flex items-center gap-2 font-mono text-sm text-foreground/60">
            <Badge variant="default">{queue.length}</Badge>
            <span>contrato{queue.length === 1 ? '' : 's'} en tu cola</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {queue.map((contract) => (
              <ReviewContractCard
                key={contract.id}
                contract={contract}
                role={role!}
                now={BASE_NOW}
                onAction={openAction}
              />
            ))}
          </div>
        </>
      )}

      <ReviewActionModal
        open={modalKind !== null}
        kind={modalKind}
        contract={target}
        onClose={closeModal}
        onConfirm={handleConfirm}
      />
    </PageShell>
  );
}
