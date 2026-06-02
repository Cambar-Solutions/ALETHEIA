'use client';

import { Badge, Button, Input, ROLES, type Role } from '@aletheia/frontend-commons';
import { useEffect, useState } from 'react';
import { Label } from '../../../components/ui/label';
import { Modal } from '../../../components/ui/modal';
import { Select } from '../../../components/ui/select';
import type { WorkflowStage } from '../../_mock/admin';

export interface StageFormValues {
  name: string;
  role: Role;
  slaHours: number;
}

interface StageFormModalProps {
  open: boolean;
  initial?: WorkflowStage | null;
  onClose: () => void;
  onSubmit: (values: StageFormValues) => void;
}

export function StageFormModal({ open, initial, onClose, onSubmit }: StageFormModalProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>(ROLES[0].id);
  const [slaHours, setSlaHours] = useState('24');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? '');
    setRole(initial?.role ?? ROLES[0].id);
    setSlaHours(initial ? String(initial.slaHours) : '24');
    setError(null);
  }, [open, initial]);

  const handleSubmit = () => {
    if (!name.trim()) return setError('El nombre de la etapa es obligatorio.');
    const sla = Number(slaHours);
    if (!Number.isFinite(sla) || sla <= 0) return setError('El SLA debe ser un número mayor a 0.');
    onSubmit({ name: name.trim(), role, slaHours: sla });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Editar etapa' : 'Nueva etapa'}
      description={
        initial ? 'Actualiza la etapa del flujo.' : 'Agrega una etapa al final del flujo.'
      }
      footer={
        <>
          <Button variant="neutral" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>{initial ? 'Guardar cambios' : 'Crear etapa'}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="stage-name">Nombre</Label>
          <Input
            id="stage-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Revisión Abogado"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="stage-role">Rol asignado</Label>
          <Select id="stage-role" value={role} onChange={(e) => setRole(e.target.value as Role)}>
            {ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="stage-sla">SLA (horas)</Label>
          <Input
            id="stage-sla"
            type="number"
            min={1}
            value={slaHours}
            onChange={(e) => setSlaHours(e.target.value)}
            placeholder="24"
          />
        </div>

        {error ? (
          <Badge variant="destructive" className="block w-full py-2 text-center normal-case">
            {error}
          </Badge>
        ) : null}
      </div>
    </Modal>
  );
}
