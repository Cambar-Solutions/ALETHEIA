'use client';

import { Badge, Button, Checkbox, Input } from '@aletheia/frontend-commons';
import { useEffect, useState } from 'react';
import { Label } from '../../../components/ui/label';
import { Modal } from '../../../components/ui/modal';
import type { Apoderado } from '../../_mock/admin';

export interface ApoderadoFormValues {
  name: string;
  power: string;
  active: boolean;
}

interface ApoderadoFormModalProps {
  open: boolean;
  initial?: Apoderado | null;
  onClose: () => void;
  onSubmit: (values: ApoderadoFormValues) => void;
}

export function ApoderadoFormModal({ open, initial, onClose, onSubmit }: ApoderadoFormModalProps) {
  const [name, setName] = useState('');
  const [power, setPower] = useState('');
  const [active, setActive] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? '');
    setPower(initial?.power ?? '');
    setActive(initial?.active ?? true);
    setError(null);
  }, [open, initial]);

  const handleSubmit = () => {
    if (!name.trim()) return setError('El nombre es obligatorio.');
    if (!power.trim()) return setError('Describe el poder legal.');
    onSubmit({ name: name.trim(), power: power.trim(), active });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Editar apoderado' : 'Nuevo apoderado'}
      description={
        initial ? 'Actualiza los datos del apoderado.' : 'Registra un nuevo apoderado legal.'
      }
      footer={
        <>
          <Button variant="neutral" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>{initial ? 'Guardar cambios' : 'Crear apoderado'}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="apo-name">Nombre</Label>
          <Input
            id="apo-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre completo"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="apo-power">Descripción del poder legal</Label>
          <textarea
            id="apo-power"
            value={power}
            onChange={(e) => setPower(e.target.value)}
            rows={3}
            placeholder="Ej. Poder general para actos de administración y dominio."
            className="flex w-full rounded-base border-2 border-border bg-background px-3 py-2 text-sm font-mono shadow-shadow transition-all placeholder:font-mono placeholder:text-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
          />
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            id="apo-active"
            checked={active}
            onCheckedChange={(v) => setActive(Boolean(v))}
          />
          <Label htmlFor="apo-active" className="cursor-pointer">
            Apoderado activo
          </Label>
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
