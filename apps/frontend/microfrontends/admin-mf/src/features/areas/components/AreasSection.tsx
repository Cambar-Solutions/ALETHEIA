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
import { Building2, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '../../../components/ui/states';
import { Switch } from '../../../components/ui/switch';
import { type Area, useAreas } from '../../_mock/admin';
import { AreaFormModal, type AreaFormValues } from './AreaFormModal';

export function AreasSection() {
  const { areas, create, update, toggleActive } = useAreas();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Area | null>(null);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (area: Area) => {
    setEditing(area);
    setModalOpen(true);
  };

  const handleSubmit = (values: AreaFormValues) => {
    if (editing) update(editing.id, values);
    else create(values);
    setModalOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1.5">
          <CardTitle>Áreas</CardTitle>
          <CardDescription>
            Áreas de la organización ({areas.length}). Una área inactiva no se puede asignar.
          </CardDescription>
        </div>
        <Button onClick={openCreate}>
          <Plus /> Nueva área
        </Button>
      </CardHeader>
      <CardContent>
        {areas.length === 0 ? (
          <EmptyState
            icon={<Building2 className="h-5 w-5" />}
            title="Sin áreas"
            description="Crea la primera área."
            action={
              <Button onClick={openCreate} size="sm">
                <Plus /> Nueva área
              </Button>
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {areas.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-base">{a.name}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <Switch
                        checked={a.active}
                        onCheckedChange={() => toggleActive(a.id)}
                        aria-label={a.active ? 'Desactivar área' : 'Activar área'}
                      />
                      <Badge variant={a.active ? 'default' : 'neutral'}>
                        {a.active ? 'Activa' : 'Inactiva'}
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

      <AreaFormModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </Card>
  );
}
