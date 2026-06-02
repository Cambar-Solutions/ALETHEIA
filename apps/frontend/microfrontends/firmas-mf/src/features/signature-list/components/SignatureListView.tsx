'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CookiePrivilegeGuard,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useRole,
} from '@aletheia/frontend-commons';
import { useRouter } from 'next/navigation';
import { attorneyById } from '../../_mock/signatures';
import { useSignatures } from '../../signatures/hooks/useSignatures';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function SignatureListView() {
  const router = useRouter();
  const { role, privileges } = useRole();
  const { ready, listToSign, listSigned } = useSignatures();

  return (
    <main className="bg-grid min-h-screen p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-heading">Firmas</h1>
            <p className="mt-1 font-mono text-xs text-foreground/50">
              {role ?? 'sin sesión'} &middot; {privileges.length} privilegios
            </p>
          </div>
          <a href="/">
            <Button variant="outline" size="sm">
              &larr; Inicio
            </Button>
          </a>
        </header>

        {/* Contratos por firmar */}
        <Card>
          <CardHeader>
            <CardTitle>Contratos por firmar</CardTitle>
            <CardDescription>Contratos en estado SIGNING pendientes de tu firma.</CardDescription>
          </CardHeader>
          <CardContent>
            {!ready ? (
              <p className="font-mono text-sm text-foreground/50">Cargando…</p>
            ) : listToSign.length === 0 ? (
              <p className="font-mono text-sm text-foreground/50">
                No hay contratos pendientes de firma.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Folio</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Sociedad</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listToSign.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-heading">{c.folio}</TableCell>
                      <TableCell>{c.provider}</TableCell>
                      <TableCell className="text-foreground/60">{c.society}</TableCell>
                      <TableCell className="text-right">
                        <CookiePrivilegeGuard
                          privilege="CONTRACT_SIGN"
                          fallback={<Badge variant="secondary">Sin permiso</Badge>}
                        >
                          <Button size="sm" onClick={() => router.push(`/firmar/${c.id}`)}>
                            Firmar
                          </Button>
                        </CookiePrivilegeGuard>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Contratos firmados */}
        <Card>
          <CardHeader>
            <CardTitle>Contratos firmados</CardTitle>
            <CardDescription>Historial de firmas registradas.</CardDescription>
          </CardHeader>
          <CardContent>
            {!ready ? (
              <p className="font-mono text-sm text-foreground/50">Cargando…</p>
            ) : listSigned.length === 0 ? (
              <p className="font-mono text-sm text-foreground/50">Aún no hay firmas registradas.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Folio</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Apoderado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listSigned.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-heading">{c.folio}</TableCell>
                      <TableCell>{c.provider}</TableCell>
                      <TableCell className="text-foreground/60">
                        {attorneyById(c.signature?.attorneyId)?.name ?? '—'}
                      </TableCell>
                      <TableCell className="text-foreground/60">
                        {c.signature ? formatDate(c.signature.signedAt) : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="neutral"
                          size="sm"
                          onClick={() => router.push(`/detalle/${c.id}`)}
                        >
                          Ver detalle
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
