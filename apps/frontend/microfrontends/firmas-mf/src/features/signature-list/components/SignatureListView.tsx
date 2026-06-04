'use client';

import {
  BackButton,
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
import { useListContractsQuery } from '../../signatures/api/signaturesApi';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function SignatureListView() {
  const router = useRouter();
  const { role, privileges } = useRole();

  const {
    data: toSign,
    isLoading: loadingToSign,
    isError: errorToSign,
  } = useListContractsQuery({ status: 'SIGNING' });
  const {
    data: signed,
    isLoading: loadingSigned,
    isError: errorSigned,
  } = useListContractsQuery({ status: 'SIGNED' });

  const listToSign = toSign ?? [];
  const listSigned = signed ?? [];

  return (
    <main className="bg-grid min-h-screen p-4 sm:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-heading">Firmas</h1>
            <p className="mt-1 font-sans text-xs text-muted-foreground">
              {role ?? 'sin sesión'} &middot; {privileges.length} privilegios
            </p>
          </div>
          <BackButton crossZone label="Inicio" />
        </header>

        {/* Contratos por firmar */}
        <Card>
          <CardHeader>
            <CardTitle>Contratos por firmar</CardTitle>
            <CardDescription>Contratos en estado SIGNING pendientes de tu firma.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingToSign ? (
              <p className="font-sans text-sm text-muted-foreground">Cargando…</p>
            ) : errorToSign ? (
              <Badge variant="destructive">No se pudieron cargar los contratos por firmar.</Badge>
            ) : listToSign.length === 0 ? (
              <p className="font-sans text-sm text-muted-foreground">
                No hay contratos pendientes de firma.
              </p>
            ) : (
              <div className="overflow-x-auto">
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
                        <TableCell>{c.vendorName}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {c.society?.name ?? '—'}
                        </TableCell>
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
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contratos firmados */}
        <Card>
          <CardHeader>
            <CardTitle>Contratos firmados</CardTitle>
            <CardDescription>Historial de contratos en estado SIGNED.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingSigned ? (
              <p className="font-sans text-sm text-muted-foreground">Cargando…</p>
            ) : errorSigned ? (
              <Badge variant="destructive">No se pudieron cargar los contratos firmados.</Badge>
            ) : listSigned.length === 0 ? (
              <p className="font-sans text-sm text-muted-foreground">
                Aún no hay firmas registradas.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table className="min-w-[640px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Folio</TableHead>
                      <TableHead>Proveedor</TableHead>
                      <TableHead>Sociedad</TableHead>
                      <TableHead>Actualizado</TableHead>
                      <TableHead className="text-right">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listSigned.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-heading">{c.folio}</TableCell>
                        <TableCell>{c.vendorName}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {c.society?.name ?? '—'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(c.updatedAt)}
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
