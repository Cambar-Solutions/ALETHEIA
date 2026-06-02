'use client';

import { FileText } from 'lucide-react';
import { PROVIDER_TYPE_LABEL, type ProviderType, REQUIRED_DOCS } from '../../_mock/contracts';

// Informational list of required documents per provider type (this MF does not
// handle uploads — that lives in documentos-mf).

export function RequiredDocsList({ providerType }: { providerType: ProviderType }) {
  const docs = REQUIRED_DOCS[providerType];
  return (
    <div className="space-y-2">
      <p className="font-mono text-xs text-foreground/60">
        Documentos requeridos para {PROVIDER_TYPE_LABEL[providerType]}:
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {docs.map((doc) => (
          <li
            key={doc}
            className="flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-mono text-xs"
          >
            <FileText className="h-4 w-4 shrink-0 text-foreground/60" />
            {doc}
          </li>
        ))}
      </ul>
    </div>
  );
}
