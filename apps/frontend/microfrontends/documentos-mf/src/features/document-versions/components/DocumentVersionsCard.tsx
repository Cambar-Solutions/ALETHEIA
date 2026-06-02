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
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@aletheia/frontend-commons';
import { useRef, useState } from 'react';
import { FileIcon, PlusIcon } from '../../../components/ui/icons';
import { getDocumentLabel } from '../../_mock/data/requirements';
import { formatBytes, formatDate, formatMimeType } from '../../_mock/format';
import type { DocumentRecord } from '../../_mock/types';

interface DocumentVersionsCardProps {
  document: DocumentRecord;
  onAddVersion: (file: File) => void;
}

/** Version history for one document + "subir nueva versión" control. */
export function DocumentVersionsCard({ document, onAddVersion }: DocumentVersionsCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  // Latest first for display.
  const ordered = [...document.versions].sort((a, b) => b.version - a.version);

  function handleAdd() {
    if (!pendingFile) return;
    onAddVersion(pendingFile);
    setPendingFile(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileIcon className="h-5 w-5" />
            <CardTitle className="text-xl">{getDocumentLabel(document.key)}</CardTitle>
          </div>
          <Badge variant="default">Versión activa: v{document.currentVersion}</Badge>
        </div>
        <CardDescription>
          {document.versions.length} versión(es) &middot; la más reciente es la activa.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Versión</TableHead>
              <TableHead>Archivo</TableHead>
              <TableHead>Tamaño</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordered.map((v) => {
              const isActive = v.version === document.currentVersion;
              return (
                <TableRow key={v.version} data-state={isActive ? 'selected' : undefined}>
                  <TableCell className="font-heading">v{v.version}</TableCell>
                  <TableCell className="max-w-[180px] truncate" title={v.fileName}>
                    {v.fileName}
                  </TableCell>
                  <TableCell>{formatBytes(v.size)}</TableCell>
                  <TableCell>{formatMimeType(v.mimeType)}</TableCell>
                  <TableCell>{v.uploadedBy}</TableCell>
                  <TableCell>{formatDate(v.uploadedAt)}</TableCell>
                  <TableCell>
                    {isActive ? (
                      <Badge variant="default">Activa</Badge>
                    ) : (
                      <Badge variant="outline">Histórica</Badge>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <CookiePrivilegeGuard
          privilege="DOCUMENT_VERSION"
          fallback={<Badge variant="secondary">Sin permiso para versionar</Badge>}
        >
          <div className="flex flex-col gap-2 border-t-2 border-border pt-4 sm:flex-row sm:items-center">
            <Input
              ref={inputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="sm:max-w-xs"
              onChange={(e) => setPendingFile(e.target.files?.[0] ?? null)}
            />
            <Button onClick={handleAdd} disabled={!pendingFile}>
              <PlusIcon className="h-4 w-4" />
              Subir nueva versión
            </Button>
          </div>
        </CookiePrivilegeGuard>
      </CardContent>
    </Card>
  );
}
