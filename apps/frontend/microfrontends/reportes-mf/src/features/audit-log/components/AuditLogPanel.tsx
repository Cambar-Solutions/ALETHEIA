'use client';

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@aletheia/frontend-commons';
import { useState } from 'react';
import { Select } from '../../../components/ui/select';
import { CONTRACTS, statusMeta } from '../../_mock/reports';
import { useAuditLog } from '../hooks/useAuditLog';
import { AuditTimeline } from './AuditTimeline';

const CONTRACT_OPTIONS = CONTRACTS.map((c) => ({
  value: c.id,
  label: `${c.folio} · ${c.title}`,
}));

export function AuditLogPanel() {
  const [contractId, setContractId] = useState('');
  const { contract, entries } = useAuditLog(contractId);

  return (
    <Card>
      <CardHeader className="space-y-1.5">
        <CardTitle>Bitácora de auditoría</CardTitle>
        <CardDescription>
          Selecciona un contrato para ver su historial completo de acciones (más reciente primero).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <label htmlFor="audit-contract" className="flex max-w-xl flex-col gap-1.5">
          <span className="font-heading text-xs uppercase tracking-widest text-foreground/60">
            Contrato
          </span>
          <Select
            id="audit-contract"
            options={CONTRACT_OPTIONS}
            placeholder="Selecciona un contrato…"
            value={contractId}
            onChange={(e) => setContractId(e.target.value)}
          />
        </label>

        {contract && (
          <div className="flex flex-wrap items-center gap-3 rounded-base border-2 border-border bg-secondary-background/40 p-4">
            <span className="font-heading text-lg">{contract.folio}</span>
            <span className="font-mono text-sm text-foreground/70">{contract.title}</span>
            <Badge variant={statusMeta(contract.status).variant}>
              {statusMeta(contract.status).label}
            </Badge>
            <span className="ml-auto font-mono text-xs text-foreground/50">
              {entries.length} {entries.length === 1 ? 'acción' : 'acciones'}
            </span>
          </div>
        )}

        {contractId ? (
          <AuditTimeline entries={entries} />
        ) : (
          <div className="rounded-base border-2 border-dashed border-border bg-secondary-background/40 p-10 text-center font-mono text-sm text-foreground/60">
            Selecciona un contrato para consultar su bitácora.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
