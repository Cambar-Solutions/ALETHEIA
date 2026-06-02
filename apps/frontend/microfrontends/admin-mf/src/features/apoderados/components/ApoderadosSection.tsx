'use client';

import {
  Badge,
  Button,
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
import { Pencil, Plus, Scale } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '../../../components/ui/states';
import { Switch } from '../../../components/ui/switch';
import { type Apoderado, useApoderados } from '../../_mock/admin';
import { ApoderadoFormModal, type ApoderadoFormValues } from './ApoderadoFormModal';

export function ApoderadosSection() {
  const { apoderados, create, update, toggleActive } = useApoderados();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Apoderado | null>(null);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (apoderado: Apoderado) => {
    setEditing(apoderado);
    setModalOpen(true);
  };

  const handleSubmit = (values: ApoderadoFormValues) => {
    if (editing) update(editing.id, values);
    else create(values);
    setModalOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1.5">
          <CardTitle>Apoderados</CardTitle>
          <CardDescription>
            Apoderados legales y el alcance de su poder ({apoderados.length}).
          </CardDescription>
        </div>
        <Button onClick={openCreate}>
          <Plus /> Nuevo apoderado
        </Button>
      </CardHeader>
      <CardContent>
        {apoderados.length === 0 ? (
          <EmptyState
            icon={<Scale className="h-5 w-5" />}
            title="Sin apoderados"
            description="Registra el primer apoderado."
            action={
              <Button onClick={openCreate} size="sm">
                <Plus /> Nuevo apoderado
              </Button>
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Poder legal</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apoderados.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-base">{a.name}</TableCell>
                  <TableCell className="max-w-md text-foreground/70">{a.power}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <Switch
                        checked={a.active}
                        onCheckedChange={() => toggleActive(a.id)}
                        aria-label={a.active ? 'Desactivar apoderado' : 'Activar apoderado'}
                      />
                      <Badge variant={a.active ? 'default' : 'neutral'}>
                        {a.active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="neutral" size="sm" onClick={() => openEdit(a)}>
                      <Pencil /> Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <ApoderadoFormModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </Card>
  );
}
