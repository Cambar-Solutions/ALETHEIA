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
  useRole,
} from '@aletheia/frontend-commons';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Label } from '../../../components/ui/label';
import { Select } from '../../../components/ui/select';
import { ATTORNEYS, attorneyById } from '../../_mock/signatures';
import { useSignatures } from '../../signatures/hooks/useSignatures';
import { SignaturePad, type SignaturePadHandle } from './SignaturePad';

interface SignatureCanvasViewProps {
  contractId: string;
}

export function SignatureCanvasView({ contractId }: SignatureCanvasViewProps) {
  const router = useRouter();
  const { role } = useRole();
  const { ready, getById, sign } = useSignatures();

  const [pad, setPad] = useState<SignaturePadHandle | null>(null);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [attorneyId, setAttorneyId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const contract = useMemo(() => getById(contractId), [getById, contractId]);

  const handleSave = () => {
    setError(null);
    if (!pad || pad.isEmpty()) {
      setError('Dibuja la firma antes de guardar.');
      return;
    }
    if (!attorneyId) {
      setError('Selecciona el apoderado asociado.');
      return;
    }
    const image = pad.toDataURL();
    if (!image) {
      setError('No se pudo capturar la firma. Intenta de nuevo.');
      return;
    }
    sign(contractId, {
      image,
      attorneyId,
      signedBy: role ?? 'Firmante',
    });
    router.push(`/detalle/${contractId}`);
  };

  return (
    <main className="bg-grid min-h-screen p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-4xl font-heading">Canvas de firma</h1>
          <Button variant="outline" size="sm" onClick={() => router.push('/')}>
            &larr; Volver
          </Button>
        </header>

        <CookiePrivilegeGuard
          privilege="CONTRACT_SIGN"
          fallback={
            <Card>
              <CardContent className="p-6">
                <Badge variant="destructive">No tienes permiso para firmar contratos</Badge>
              </CardContent>
            </Card>
          }
        >
          {ready && !contract ? (
            <Card>
              <CardContent className="space-y-4 p-6">
                <Badge variant="secondary">Contrato no encontrado</Badge>
                <div>
                  <Button variant="neutral" size="sm" onClick={() => router.push('/')}>
                    Ir a contratos por firmar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {ready && contract && contract.status !== 'SIGNING' ? (
            <Card>
              <CardContent className="space-y-4 p-6">
                <Badge variant="secondary">Este contrato ya está firmado</Badge>
                <div>
                  <Button
                    variant="neutral"
                    size="sm"
                    onClick={() => router.push(`/detalle/${contract.id}`)}
                  >
                    Ver detalle de firma
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {ready && contract && contract.status === 'SIGNING' ? (
            <Card>
              <CardHeader>
                <CardTitle>{contract.folio}</CardTitle>
                <CardDescription>
                  {contract.provider} &middot; {contract.society}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="attorney">Apoderado</Label>
                  <Select
                    id="attorney"
                    value={attorneyId}
                    onChange={(e) => setAttorneyId(e.target.value)}
                  >
                    <option value="">Selecciona un apoderado…</option>
                    {ATTORNEYS.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} — {a.legalPower}
                      </option>
                    ))}
                  </Select>
                  {attorneyId ? (
                    <p className="font-mono text-xs text-foreground/50">
                      Poder legal: {attorneyById(attorneyId)?.legalPower}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label>Firma</Label>
                  <SignaturePad padRef={setPad} onDirtyChange={setHasDrawing} />
                </div>

                {error ? (
                  <div className="rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-mono text-xs text-foreground">
                    {error}
                  </div>
                ) : null}

                <div className="flex items-center justify-end gap-3">
                  <Button type="button" onClick={handleSave} disabled={!hasDrawing || !attorneyId}>
                    Guardar firma
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </CookiePrivilegeGuard>
      </div>
    </main>
  );
}
