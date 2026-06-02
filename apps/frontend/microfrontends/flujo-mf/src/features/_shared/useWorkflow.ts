'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  type ContractStatus,
  type WorkflowContract,
  type WorkflowState,
  type WorkflowTransition,
  loadWorkflowState,
  resetWorkflowState,
  saveWorkflowState,
} from '../_mock/workflow';
import { nextStatusOnApprove } from './workflow-rules';

function uid(): string {
  return `tr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

interface ActorArgs {
  /** Display name of the user performing the action. */
  performedBy: string;
  /** Optional comment. */
  comment?: string;
}

/**
 * Central hook for the review workflow. Holds the mock state (hydrated from
 * localStorage), exposes the contract list and transition history, and the
 * mutating actions used by the review panel.
 *
 * Privilege gating is the caller's responsibility (UI guards) — this hook only
 * enforces the state machine.
 */
export function useWorkflow() {
  const [state, setState] = useState<WorkflowState>({ contracts: [], transitions: [] });
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount (avoids SSR/CSR mismatch).
  useEffect(() => {
    setState(loadWorkflowState());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: WorkflowState) => {
    setState(next);
    saveWorkflowState(next);
  }, []);

  /** All contracts. */
  const contracts = state.contracts;
  /** All transitions. */
  const transitions = state.transitions;

  /** Contracts filtered to a set of statuses (e.g. a role's queue). */
  const listByStatus = useCallback(
    (statuses: ContractStatus[]) => state.contracts.filter((c) => statuses.includes(c.status)),
    [state.contracts],
  );

  /** Transitions for one contract, chronological (oldest → newest). */
  const transitionsFor = useCallback(
    (contractId: string) =>
      state.transitions
        .filter((tr) => tr.contractId === contractId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    [state.transitions],
  );

  /** Lookup a single contract. */
  const getContract = useCallback(
    (id: string): WorkflowContract | undefined => state.contracts.find((c) => c.id === id),
    [state.contracts],
  );

  /** Internal: apply a status change and record a transition. */
  const transition = useCallback(
    (
      contractId: string,
      to: ContractStatus,
      action: WorkflowTransition['action'],
      { performedBy, comment }: ActorArgs,
    ): boolean => {
      const contract = state.contracts.find((c) => c.id === contractId);
      if (!contract) return false;

      const now = new Date().toISOString();
      const record: WorkflowTransition = {
        id: uid(),
        contractId,
        from: contract.status,
        to,
        action,
        performedBy,
        comment: comment?.trim() || undefined,
        timestamp: now,
      };

      const next: WorkflowState = {
        contracts: state.contracts.map((c) =>
          c.id === contractId ? { ...c, status: to, enteredAt: now } : c,
        ),
        transitions: [...state.transitions, record],
      };
      persist(next);
      return true;
    },
    [persist, state.contracts, state.transitions],
  );

  /** Advance a contract one stage (approve). Returns false if not advanceable. */
  const approve = useCallback(
    (contractId: string, args: ActorArgs): boolean => {
      const contract = state.contracts.find((c) => c.id === contractId);
      if (!contract) return false;
      const to = nextStatusOnApprove(contract.status);
      if (!to) return false;
      return transition(contractId, to, 'APPROVE', args);
    },
    [state.contracts, transition],
  );

  /** Return a contract to DRAFT with a mandatory comment. */
  const returnToDraft = useCallback(
    (contractId: string, args: ActorArgs): boolean => {
      if (!args.comment?.trim()) return false;
      return transition(contractId, 'DRAFT', 'RETURN', args);
    },
    [transition],
  );

  /** Definitive rejection (approver only) → REJECTED, mandatory comment. */
  const reject = useCallback(
    (contractId: string, args: ActorArgs): boolean => {
      if (!args.comment?.trim()) return false;
      return transition(contractId, 'REJECTED', 'REJECT', args);
    },
    [transition],
  );

  /** Reset to seed data (demo helper). */
  const reset = useCallback(() => {
    persist(resetWorkflowState());
  }, [persist]);

  const counts = useMemo(() => {
    const byStatus = {} as Record<ContractStatus, number>;
    for (const c of state.contracts) {
      byStatus[c.status] = (byStatus[c.status] ?? 0) + 1;
    }
    return byStatus;
  }, [state.contracts]);

  return {
    hydrated,
    contracts,
    transitions,
    counts,
    listByStatus,
    transitionsFor,
    getContract,
    approve,
    returnToDraft,
    reject,
    reset,
  };
}
