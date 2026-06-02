'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ROLES,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@aletheia/frontend-commons';
import { ArrowDown, ArrowUp, Clock, Pencil, Plus, Trash2, Workflow } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '../../../components/ui/confirm-dialog';
import { EmptyState } from '../../../components/ui/states';
import { type WorkflowStage, useWorkflowStages } from '../../_mock/admin';
import { StageFormModal, type StageFormValues } from './StageFormModal';

const roleLabel = (id: string) => ROLES.find((r) => r.id === id)?.label ?? id;

export function WorkflowConfigSection() {
  const { stages, create, update, remove, move } = useWorkflowStages();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<WorkflowStage | null>(null);
  const [toDelete, setToDelete] = useState<WorkflowStage | null>(null);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (stage: WorkflowStage) => {
    setEditing(stage);
    setModalOpen(true);
  };

  const handleSubmit = (values: StageFormValues) => {
    if (editing) update(editing.id, values);
    else create(values);
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (toDelete) remove(toDelete.id);
    setToDelete(null);
  };

  const totalSla = stages.reduce((sum, s) => sum + s.slaHours, 0);

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1.5">
          <CardTitle>Configuración del flujo</CardTitle>
          <CardDescription>
            Etapas del workflow, su rol responsable y SLA. SLA total: {totalSla} h.
          </CardDescription>
        </div>
        <Button onClick={openCreate}>
          <Plus /> Nueva etapa
        </Button>
      </CardHeader>
      <CardContent>
        {stages.length === 0 ? (
          <EmptyState
            icon={<Workflow className="h-5 w-5" />}
            title="Sin etapas"
            description="Define la primera etapa del flujo."
            action={
              <Button onClick={openCreate} size="sm">
                <Plus /> Nueva etapa
              </Button>
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Orden</TableHead>
                <TableHead>Etapa</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>SLA</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stages.map((s, i) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <Badge variant="neutral">{s.order}</Badge>
                  </TableCell>
                  <TableCell className="font-base">{s.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{roleLabel(s.role)}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-foreground/70">
                      <Clock className="h-3.5 w-3.5" /> {s.slaHours} h
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center justify-end gap-1">
                      <Button
                        variant="neutral"
                        size="icon"
                        disabled={i === 0}
                        onClick={() => move(s.id, 'up')}
                        aria-label="Subir etapa"
                      >
                        <ArrowUp />
                      </Button>
                      <Button
                        variant="neutral"
                        size="icon"
                        disabled={i === stages.length - 1}
                        onClick={() => move(s.id, 'down')}
                        aria-label="Bajar etapa"
                      >
                        <ArrowDown />
                      </Button>
                      <Button variant="neutral" size="sm" onClick={() => openEdit(s)}>
                        <Pencil /> Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => setToDelete(s)}
                        aria-label="Eliminar etapa"
                      >
                        <Trash2 />
                      </Button>
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <StageFormModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={toDelete !== null}
        title="Eliminar etapa"
        description={toDelete ? `Se eliminará la etapa "${toDelete.name}".` : undefined}
        confirmLabel="Eliminar"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </Card>
  );
}
