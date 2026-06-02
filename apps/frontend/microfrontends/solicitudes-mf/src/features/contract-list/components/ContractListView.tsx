'use client';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CookiePrivilegeGuard,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@aletheia/frontend-commons';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { Select } from '../../../components/ui/select';
import {
  AREAS,
  type Contract,
  type ContractStatus,
  PROVIDER_TYPE_LABEL,
  STATUS_LABEL,
  STATUS_ORDER,
  USER_AREA,
  useContracts,
} from '../../_mock/contracts';
import { CancelContractModal } from '../../_shared/components/CancelContractModal';
import { PageHeader } from '../../_shared/components/PageHeader';
import { SlaIndicator } from '../../_shared/components/SlaIndicator';
import { StatusBadge } from '../../_shared/components/StatusBadge';
import { useContractFilters } from '../hooks/useContractFilters';
import { ContractRowActions } from './ContractRowActions';

export function ContractListView() {
  const router = useRouter();
  const { contracts, ready, submitContract, cancelContract, recoverContract } = useContracts();
  const { filters, update, reset, rows, viewAll, viewAreaOnly, noAccess } =
    useContractFilters(contracts);

  const [cancelTarget, setCancelTarget] = React.useState<Contract | null>(null);

  const goDetail = (c: Contract) => router.push(`/${c.id}`);

  return (
    <main className="bg-grid min-h-screen p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <PageHeader
          title="Solicitudes"
          subtitle="Gestión de solicitudes y contratos (CLM)"
          actions={
            <CookiePrivilegeGuard privilege="CONTRACT_CREATE">
              <Button size="sm" onClick={() => router.push('/crear')}>
                <Plus className="h-4 w-4" /> Nueva solicitud
              </Button>
            </CookiePrivilegeGuard>
          }
        />

        {viewAreaOnly && (
          <div className="rounded-base border-2 border-border bg-secondary-background px-4 py-2 font-mono text-xs text-foreground/70">
            Vista limitada a tu área: <strong>{USER_AREA}</strong>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Listado de contratos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-[220px] flex-1">
                <label className="mb-1 block font-heading text-xs tracking-widest uppercase text-foreground/70">
                  Buscar
                </label>
                <Input
                  placeholder="Folio, título o proveedor…"
                  value={filters.search}
                  onChange={(e) => update({ search: e.target.value })}
                />
              </div>

              <div className="w-44">
                <label className="mb-1 block font-heading text-xs tracking-widest uppercase text-foreground/70">
                  Estado
                </label>
                <Select
                  value={filters.status}
                  onChange={(e) => update({ status: e.target.value as ContractStatus | 'ALL' })}
                >
                  <option value="ALL">Todos</option>
                  {STATUS_ORDER.concat(['CANCELLED', 'REJECTED']).map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s as ContractStatus]}
                    </option>
                  ))}
                </Select>
              </div>

              {viewAll && (
                <div className="w-44">
                  <label className="mb-1 block font-heading text-xs tracking-widest uppercase text-foreground/70">
                    Área
                  </label>
                  <Select value={filters.area} onChange={(e) => update({ area: e.target.value })}>
                    <option value="ALL">Todas</option>
                    {AREAS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </Select>
                </div>
              )}

              <Button variant="neutral" size="sm" onClick={reset}>
                Limpiar
              </Button>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-base border-2 border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Folio</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>SLA</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!ready ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-24 text-center font-mono text-foreground/40"
                      >
                        Cargando…
                      </TableCell>
                    </TableRow>
                  ) : noAccess ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-24 text-center font-mono text-foreground/40"
                      >
                        No tienes privilegios para ver contratos.
                      </TableCell>
                    </TableRow>
                  ) : rows.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-24 text-center font-mono text-foreground/40"
                      >
                        Sin resultados.
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map(({ contract, sla }) => (
                      <TableRow
                        key={contract.id}
                        className="cursor-pointer"
                        onClick={() => goDetail(contract)}
                      >
                        <TableCell className="text-xs text-foreground/60">
                          {contract.folio}
                        </TableCell>
                        <TableCell className="font-base">{contract.title}</TableCell>
                        <TableCell>
                          <span className="block">{contract.providerName}</span>
                          <span className="block text-[11px] text-foreground/50">
                            {PROVIDER_TYPE_LABEL[contract.providerType]}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">{contract.area}</TableCell>
                        <TableCell>
                          <StatusBadge status={contract.status} />
                        </TableCell>
                        <TableCell>
                          <SlaIndicator level={sla} />
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <ContractRowActions
                            contract={contract}
                            onView={goDetail}
                            onEdit={(c) => router.push(`/crear?id=${c.id}`)}
                            onSubmit={(c) => submitContract(c.id)}
                            onCancel={(c) => setCancelTarget(c)}
                            onRecover={(c) => recoverContract(c.id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <p className="font-mono text-xs text-foreground/40">{rows.length} contrato(s)</p>
          </CardContent>
        </Card>
      </div>

      <CancelContractModal
        contract={cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={(reason) => {
          if (cancelTarget) cancelContract(cancelTarget.id, reason);
          setCancelTarget(null);
        }}
      />
    </main>
  );
}
