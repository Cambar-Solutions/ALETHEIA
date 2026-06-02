'use client';

import { CONTRACTS } from '../features/_mock/documents';
import { Select } from './ui/select';

interface ContractSelectorProps {
  value: string;
  onChange: (contractId: string) => void;
  id?: string;
}

/** Shared dropdown to pick the active contract across features. */
export function ContractSelector({ value, onChange, id = 'contract' }: ContractSelectorProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="font-mono text-xs uppercase tracking-wide text-foreground/60">
        Contrato
      </label>
      <Select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {CONTRACTS.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
