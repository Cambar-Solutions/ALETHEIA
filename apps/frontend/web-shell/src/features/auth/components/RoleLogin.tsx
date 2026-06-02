'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@aletheia/frontend-commons';
import { ROLES, ROLE_PRIVILEGES } from '../data/roles';
import { useAuth } from '../hooks/useAuth';

export function RoleLogin() {
  const { loginAs } = useAuth();

  return (
    <main className="bg-grid min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        <header className="text-center mb-10 animate-hero">
          <h1 className="text-6xl font-heading text-foreground tracking-tight">ALETHEIA</h1>
          <p className="font-mono text-foreground/60 mt-2">Contract Lifecycle Management</p>
          <div className="mt-4">
            <Badge variant="default">DEMO · inicia sesión con un rol (sin backend)</Badge>
          </div>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ROLES.map((r, i) => (
            <Card key={r.id} className={`flex flex-col animate-hero delay-${(i + 1) * 100}`}>
              <CardHeader>
                <CardTitle>{r.label}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 flex-1">
                <p className="font-mono text-sm text-foreground/70 flex-1">{r.description}</p>
                <Badge variant="secondary" className="self-start">
                  {ROLE_PRIVILEGES[r.id].length} privilegios
                </Badge>
                <Button type="button" className="w-full" onClick={() => loginAs(r.id)}>
                  Entrar como {r.label}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
