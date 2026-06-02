'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@aletheia/frontend-commons';
import { useState } from 'react';
import { ContractSelector } from '../../../components/ContractSelector';
import { CONTRACTS } from '../../_mock/documents';
import { CURRENT_USER, UPLOAD_DATE } from '../../_mock/session';
import { useDocuments } from '../../_mock/useDocuments';
import { DocumentVersionsCard } from './DocumentVersionsCard';

export function DocumentVersionsView() {
  const { ready, list, addVersion } = useDocuments();
  const [contractId, setContractId] = useState(CONTRACTS[0].id);

  const docs = list(contractId);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Versiones de documento</CardTitle>
          <CardDescription>
            Historial de versiones por documento. Subir una nueva versión incrementa la versión
            activa sin perder el histórico.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <ContractSelector value={contractId} onChange={setContractId} />
          </div>
        </CardContent>
      </Card>

      {!ready ? (
        <p className="font-mono text-sm text-foreground/50">Cargando documentos…</p>
      ) : docs.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center font-mono text-sm text-foreground/50">
            Este contrato aún no tiene documentos cargados.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {docs.map((doc) => (
            <DocumentVersionsCard
              key={doc.id}
              document={doc}
              onAddVersion={(file) =>
                addVersion({
                  documentId: doc.id,
                  fileName: file.name,
                  size: file.size,
                  mimeType: file.type || 'application/octet-stream',
                  uploadedBy: CURRENT_USER,
                  uploadedAt: UPLOAD_DATE,
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
