'use client';

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CookiePrivilegeGuard,
} from '@aletheia/frontend-commons';
import { useMemo, useState } from 'react';
import { ContractSelector } from '../../../components/ContractSelector';
import { Select } from '../../../components/ui/select';
import { PROVIDER_TYPE_LABELS, getRequiredDocuments } from '../../_mock/data/requirements';
import { CONTRACTS } from '../../_mock/documents';
import { CURRENT_USER, UPLOAD_DATE } from '../../_mock/session';
import type { ProviderType } from '../../_mock/types';
import { useDocuments } from '../../_mock/useDocuments';
import { DocumentUploadRow } from './DocumentUploadRow';

export function DocumentUploadView() {
  const { ready, list, find, upload } = useDocuments();
  const [contractId, setContractId] = useState(CONTRACTS[0].id);
  const [providerType, setProviderType] = useState<ProviderType>('PERSONA_FISICA');

  const requirements = useMemo(() => getRequiredDocuments(providerType), [providerType]);
  const contractDocs = list(contractId);

  const uploadedCount = requirements.filter((r) => find(contractId, r.key)).length;
  const total = requirements.length;

  return (
    <CookiePrivilegeGuard
      privilege="DOCUMENT_UPLOAD"
      fallback={
        <Card>
          <CardHeader>
            <CardTitle>Carga de documentos</CardTitle>
            <CardDescription>
              Necesitas el privilegio DOCUMENT_UPLOAD para cargar documentos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">Sin permiso para esta sección</Badge>
          </CardContent>
        </Card>
      }
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Carga de documentos requeridos</CardTitle>
            <CardDescription>
              Selecciona el contrato y el tipo de proveedor para ver la lista dinámica de
              documentos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <ContractSelector value={contractId} onChange={setContractId} />
              <div className="space-y-1.5">
                <label
                  htmlFor="provider-type"
                  className="font-mono text-xs uppercase tracking-wide text-foreground/60"
                >
                  Tipo de proveedor
                </label>
                <Select
                  id="provider-type"
                  value={providerType}
                  onChange={(e) => setProviderType(e.target.value as ProviderType)}
                >
                  {(Object.keys(PROVIDER_TYPE_LABELS) as ProviderType[]).map((pt) => (
                    <option key={pt} value={pt}>
                      {PROVIDER_TYPE_LABELS[pt]}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-base border-2 border-border bg-secondary-background/40 px-4 py-3">
              <span className="font-mono text-xs text-foreground/70">
                Progreso de carga &middot; {PROVIDER_TYPE_LABELS[providerType]}
              </span>
              <Badge variant={uploadedCount === total ? 'default' : 'secondary'}>
                {uploadedCount} / {total} documentos
              </Badge>
            </div>
          </CardContent>
        </Card>

        {!ready ? (
          <p className="font-mono text-sm text-foreground/50">Cargando documentos…</p>
        ) : (
          <div className="space-y-3">
            {requirements.map((req) => {
              const doc = contractDocs.find((d) => d.key === req.key);
              return (
                <DocumentUploadRow
                  key={req.key}
                  requirement={req}
                  document={doc}
                  onUpload={(file, expiryDate) =>
                    upload({
                      contractId,
                      key: req.key,
                      providerType,
                      fileName: file.name,
                      size: file.size,
                      mimeType: file.type || 'application/octet-stream',
                      uploadedBy: CURRENT_USER,
                      uploadedAt: UPLOAD_DATE,
                      expiryDate,
                    })
                  }
                />
              );
            })}
          </div>
        )}
      </div>
    </CookiePrivilegeGuard>
  );
}
