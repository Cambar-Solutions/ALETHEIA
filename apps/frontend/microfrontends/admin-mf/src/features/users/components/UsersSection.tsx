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
import { Pencil, Plus, Users as UsersIcon } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '../../../components/ui/states';
import { Switch } from '../../../components/ui/switch';
import { type User, useUsers } from '../../_mock/admin';
import { UserFormModal, type UserFormValues } from './UserFormModal';

const roleLabel = (id: string) => ROLES.find((r) => r.id === id)?.label ?? id;

export function UsersSection() {
  const { users, areas, create, update, toggleActive } = useUsers();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  const areaName = (id: string) => areas.find((a) => a.id === id)?.name ?? '—';

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (user: User) => {
    setEditing(user);
    setModalOpen(true);
  };

  const handleSubmit = (values: UserFormValues) => {
    if (editing) update(editing.id, values);
    else create(values);
    setModalOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1.5">
          <CardTitle>Usuarios</CardTitle>
          <CardDescription>
            Gestiona usuarios, su área y los roles asignados ({users.length}).
          </CardDescription>
        </div>
        <Button onClick={openCreate}>
          <Plus /> Nuevo usuario
        </Button>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <EmptyState
            icon={<UsersIcon className="h-5 w-5" />}
            title="Sin usuarios"
            description="Crea el primer usuario para comenzar."
            action={
              <Button onClick={openCreate} size="sm">
                <Plus /> Nuevo usuario
              </Button>
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-base">{u.name}</TableCell>
                  <TableCell className="text-foreground/70">{u.email}</TableCell>
                  <TableCell>{areaName(u.areaId)}</TableCell>
                  <TableCell>
                    <span className="flex flex-wrap gap-1">
                      {u.roles.map((r) => (
                        <Badge key={r} variant="secondary">
                          {roleLabel(r)}
                        </Badge>
                      ))}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <Switch
                        checked={u.active}
                        onCheckedChange={() => toggleActive(u.id)}
                        aria-label={u.active ? 'Desactivar usuario' : 'Activar usuario'}
                      />
                      <Badge variant={u.active ? 'default' : 'neutral'}>
                        {u.active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="neutral" size="sm" onClick={() => openEdit(u)}>
                      <Pencil /> Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <UserFormModal
        open={modalOpen}
        initial={editing}
        areas={areas}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </Card>
  );
}
