'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@aletheia/frontend-commons';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { attorneyById } from '../../_mock/signatures';
import { useSignatures } from '../../signatures/hooks/useSignatures';

interface SignatureDetailViewProps {
  contractId: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('es-MX', {
    dateStyle: 'long',
    timeStyle: 'short',
  });
}

export function SignatureDetailView({ contractId }: SignatureDetailViewProps) {
  const router = useRouter();
  const { ready, getById } = useSignatures();
  const contract = useMemo(() => getById(contractId), [getById, contractId]);

  const attorney = attorneyById(contract?.signature?.attorneyId);

  return (
    <main className="bg-grid min-h-screen p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-4xl font-heading">Detalle de firma</h1>
          <Button variant="outline" size="sm" onClick={() => router.push('/')}>
            &larr; Volver
          </Button>
        </header>

        {!ready ? (
          <Card>
            <CardContent className="p-6">
              <p className="font-mono text-sm text-foreground/50">Cargando…</p>
            </CardContent>
          </Card>
        ) : !contract ? (
          <Card>
            <CardContent className="space-y-4 p-6">
              <Badge variant="secondary">Contrato no encontrado</Badge>
              <div>
                <Button variant="neutral" size="sm" onClick={() => router.push('/')}>
                  Ir a firmas
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : !contract.signature ? (
          <Card>
            <CardContent className="space-y-4 p-6">
              <Badge variant="secondary">Este contrato aún no ha sido firmado</Badge>
              <div>
                <Button size="sm" onClick={() => router.push(`/firmar/${contract.id}`)}>
                  Firmar ahora
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{contract.folio}</CardTitle>
                <Badge variant="default">FIRMADO</Badge>
              </div>
              <CardDescription>
                {contract.provider} &middot; {contract.society}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Imagen de la firma (base64) */}
              <div className="space-y-2">
                <span className="text-xs font-heading uppercase tracking-widest text-foreground/70">
                  Firma
                </span>
                <div className="rounded-base border-2 border-border bg-background p-4 shadow-shadow">
                  <img
                    src={contract.signature.image}
                    alt={`Firma del contrato ${contract.folio}`}
                    className="mx-auto block max-h-56 w-auto"
                  />
                </div>
              </div>

              {/* Metadatos de la firma */}
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <dt className="text-xs font-heading uppercase tracking-widest text-foreground/70">
                    Apoderado
                  </dt>
                  <dd className="font-mono text-sm">{attorney?.name ?? '—'}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs font-heading uppercase tracking-widest text-foreground/70">
                    Poder legal
                  </dt>
                  <dd className="font-mono text-sm text-foreground/70">
                    {attorney?.legalPower ?? '—'}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs font-heading uppercase tracking-widest text-foreground/70">
                    Firmado por
                  </dt>
                  <dd className="font-mono text-sm">{contract.signature.signedBy}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs font-heading uppercase tracking-widest text-foreground/70">
                    Fecha
                  </dt>
                  <dd className="font-mono text-sm">{formatDate(contract.signature.signedAt)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
