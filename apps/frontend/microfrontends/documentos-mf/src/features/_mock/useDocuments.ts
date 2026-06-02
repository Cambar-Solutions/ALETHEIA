'use client';

import { useCallback, useEffect, useState } from 'react';
import { readStore, writeStore } from './documents';
import type { DocumentKey, DocumentRecord, ProviderType } from './types';

/** Cross-component sync event so every mounted hook stays in sync. */
const SYNC_EVENT = 'aletheia_documents_sync';

function emitSync(records: DocumentRecord[]) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<DocumentRecord[]>(SYNC_EVENT, { detail: records }));
}

export interface UploadInput {
  contractId: string;
  key: DocumentKey;
  providerType: ProviderType;
  fileName: string;
  size: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: string;
  expiryDate?: string;
}

export interface AddVersionInput {
  documentId: string;
  fileName: string;
  size: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: string;
  expiryDate?: string;
}

/**
 * Mock data hook backing all documentos-mf features.
 * Reads/writes the localStorage store and exposes list / upload / addVersion.
 */
export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDocuments(readStore());
    setReady(true);
    const onSync = (e: Event) => {
      const detail = (e as CustomEvent<DocumentRecord[]>).detail;
      if (detail) setDocuments(detail);
    };
    window.addEventListener(SYNC_EVENT, onSync);
    return () => window.removeEventListener(SYNC_EVENT, onSync);
  }, []);

  const persist = useCallback((next: DocumentRecord[]) => {
    writeStore(next);
    setDocuments(next);
    emitSync(next);
  }, []);

  /** Returns documents, optionally filtered by contract. */
  const list = useCallback(
    (contractId?: string) =>
      contractId ? documents.filter((d) => d.contractId === contractId) : documents,
    [documents],
  );

  /** Finds the document for a given contract + catalog key. */
  const find = useCallback(
    (contractId: string, key: DocumentKey) =>
      documents.find((d) => d.contractId === contractId && d.key === key),
    [documents],
  );

  /** Creates a document (its first version) for a required slot. */
  const upload = useCallback(
    (input: UploadInput) => {
      const existing = documents.find(
        (d) => d.contractId === input.contractId && d.key === input.key,
      );
      if (existing) {
        // Already exists -> treat as a new version instead of duplicating.
        const next = documents.map((d) =>
          d.id === existing.id
            ? {
                ...d,
                currentVersion: d.currentVersion + 1,
                expiryDate: input.expiryDate ?? d.expiryDate,
                versions: [
                  ...d.versions,
                  {
                    version: d.currentVersion + 1,
                    fileName: input.fileName,
                    size: input.size,
                    mimeType: input.mimeType,
                    uploadedBy: input.uploadedBy,
                    uploadedAt: input.uploadedAt,
                  },
                ],
              }
            : d,
        );
        persist(next);
        return;
      }

      const record: DocumentRecord = {
        id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        contractId: input.contractId,
        key: input.key,
        providerType: input.providerType,
        currentVersion: 1,
        expiryDate: input.expiryDate,
        versions: [
          {
            version: 1,
            fileName: input.fileName,
            size: input.size,
            mimeType: input.mimeType,
            uploadedBy: input.uploadedBy,
            uploadedAt: input.uploadedAt,
          },
        ],
      };
      persist([...documents, record]);
    },
    [documents, persist],
  );

  /** Adds a new version to an existing document and makes it active. */
  const addVersion = useCallback(
    (input: AddVersionInput) => {
      const next = documents.map((d) => {
        if (d.id !== input.documentId) return d;
        const nextVersion = d.currentVersion + 1;
        return {
          ...d,
          currentVersion: nextVersion,
          expiryDate: input.expiryDate ?? d.expiryDate,
          versions: [
            ...d.versions,
            {
              version: nextVersion,
              fileName: input.fileName,
              size: input.size,
              mimeType: input.mimeType,
              uploadedBy: input.uploadedBy,
              uploadedAt: input.uploadedAt,
            },
          ],
        };
      });
      persist(next);
    },
    [documents, persist],
  );

  /** Resets the store back to the seed data (handy in the demo). */
  const reset = useCallback(() => {
    if (typeof window !== 'undefined') window.localStorage.removeItem('aletheia_documents');
    const seeded = readStore();
    persist(seeded);
  }, [persist]);

  return { documents, ready, list, find, upload, addVersion, reset };
}
