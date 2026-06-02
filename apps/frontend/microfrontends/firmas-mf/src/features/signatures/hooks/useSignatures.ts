'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  STORAGE_KEY,
  type SignatureContract,
  type SignatureRecord,
  seedContracts,
} from '../../_mock/signatures';

/** Payload requerido para registrar una firma. */
export interface SignPayload {
  /** base64 dataURL del canvas. */
  image: string;
  attorneyId: string;
  signedBy: string;
}

function loadContracts(): SignatureContract[] {
  if (typeof window === 'undefined') return seedContracts();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = seedContracts();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as SignatureContract[];
  } catch {
    return seedContracts();
  }
}

function persist(contracts: SignatureContract[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(contracts));
  } catch {
    // ignore quota / serialization errors in this mock layer
  }
}

/**
 * Hook de firmas (mock). Lee/escribe en localStorage `aletheia_signatures`.
 * Expone los contratos por firmar, los ya firmados y la acción de firmar.
 */
export function useSignatures() {
  const [contracts, setContracts] = useState<SignatureContract[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setContracts(loadContracts());
    setReady(true);
  }, []);

  /** Contratos en estado SIGNING (pendientes de firma). */
  const listToSign = contracts.filter((c) => c.status === 'SIGNING');

  /** Contratos ya firmados (SIGNED). */
  const listSigned = contracts.filter((c) => c.status === 'SIGNED');

  /** Resuelve un contrato por id (cualquier estado). */
  const getById = useCallback((id: string) => contracts.find((c) => c.id === id), [contracts]);

  /**
   * Firma un contrato: registra la firma y mueve el contrato a SIGNED.
   * Sólo aplica a contratos en estado SIGNING.
   */
  const sign = useCallback((contractId: string, payload: SignPayload) => {
    setContracts((prev) => {
      const next = prev.map((c) => {
        if (c.id !== contractId || c.status !== 'SIGNING') return c;
        const signature: SignatureRecord = {
          image: payload.image,
          attorneyId: payload.attorneyId,
          signedBy: payload.signedBy,
          signedAt: new Date().toISOString(),
        };
        return { ...c, status: 'SIGNED' as const, signature };
      });
      persist(next);
      return next;
    });
  }, []);

  return { ready, contracts, listToSign, listSigned, getById, sign };
}
