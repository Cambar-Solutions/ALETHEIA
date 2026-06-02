'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@aletheia/frontend-commons';
import { PRIVILEGES, type Privilege, ROLES } from '../data/roles';
import { useAuth } from '../hooks/useAuth';
import { PrivilegeGuard } from './PrivilegeGuard';

// Acciones del sistema, cada una gobernada por un privilegio.
// El dashboard las muestra/oculta según el rol → así se VALIDA el RBAC.
const ACTIONS: { privilege: Privilege; label: string; zone: string }[] = [
  { privilege: 'CONTRACT_CREATE', label: 'Crear solicitud', zone: '/solicitudes' },
  { privilege: 'CONTRACT_REVIEW_ADMIN', label: 'Revisar (Administrador)', zone: '/flujo' },
  { privilege: 'CONTRACT_REVIEW_LAWYER', label: 'Revisar (Abogado)', zone: '/flujo' },
  { privilege: 'CONTRACT_APPROVE', label: 'Aprobar contrato', zone: '/flujo' },
  { privilege: 'CONTRACT_SIGN', label: 'Firmar contrato', zone: '/firmas' },
  { privilege: 'DOCUMENT_UPLOAD', label: 'Subir documentos', zone: '/documentos' },
  { privilege: 'TEMPLATES_MANAGE', label: 'Gestionar plantillas', zone: '/contratos' },
  { privilege: 'REPORTS_VIEW', label: 'Ver reportes', zone: '/reportes' },
  { privilege: 'USERS_MANAGE', label: 'Gestionar usuarios', zone: '/admin' },
  { privilege: 'WORKFLOW_CONFIG', label: 'Configurar flujo', zone: '/admin' },
];

export function RoleDashboard() {
  const { role, privileges, logout } = useAuth();
  const roleMeta = ROLES.find((r) => r.id === role);

  return (
    <div className="min-h-screen bg-grid">
      {/* Navbar */}
      <header className="sticky top-0 z-10 border-b-2 border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-heading">ALETHEIA</span>
            <Badge variant="default">{roleMeta?.label ?? role}</Badge>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={logout}>
            Cerrar sesión
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 space-y-8">
        {/* Privilegios activos */}
        <Card>
          <CardHeader>
            <CardTitle>Privilegios activos ({privileges.length})</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {privileges.map((p) => (
              <Badge key={p} variant="secondary">
                {PRIVILEGES[p]}
              </Badge>
            ))}
          </CardContent>
        </Card>

        {/* Acciones disponibles según privilegio (validación RBAC) */}
        <section>
          <h2 className="mb-4 text-2xl font-heading">Acciones disponibles para tu rol</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ACTIONS.map((a) => (
              <PrivilegeGuard key={`${a.privilege}-${a.label}`} privilege={a.privilege}>
                <a href={a.zone} className="block">
                  <Card className="transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
                    <CardContent className="p-5">
                      <p className="font-heading text-lg">{a.label}</p>
                      <p className="font-mono text-xs text-foreground/50 mt-1">{a.zone}</p>
                    </CardContent>
                  </Card>
                </a>
              </PrivilegeGuard>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
