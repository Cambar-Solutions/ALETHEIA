'use client';

import { Badge } from '@aletheia/frontend-commons';
import { ArrowRight } from 'lucide-react';
import { formatDateTime } from '../../../lib/format';
import { type AuditEntry, auditActionLabel, userName } from '../../_mock/reports';

interface AuditTimelineProps {
  entries: AuditEntry[];
}

/** Renders the value-change diff (old → new) when the entry carries one. */
function ValueChange({ entry }: { entry: AuditEntry }) {
  if (entry.oldValue == null && entry.newValue == null) return null;
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-xs">
      {entry.field && <span className="text-foreground/50">{entry.field}:</span>}
      <span className="rounded-base border-2 border-border bg-secondary-background px-2 py-0.5 line-through opacity-70">
        {entry.oldValue ?? '∅'}
      </span>
      <ArrowRight className="h-3 w-3 text-foreground/50" />
      <span className="rounded-base border-2 border-border bg-main px-2 py-0.5 text-main-foreground">
        {entry.newValue ?? '∅'}
      </span>
    </div>
  );
}

export function AuditTimeline({ entries }: AuditTimelineProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-base border-2 border-dashed border-border bg-secondary-background/40 p-10 text-center font-mono text-sm text-foreground/60">
        Este contrato no tiene acciones registradas en la bitácora.
      </div>
    );
  }

  return (
    <ol className="relative space-y-4 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-0.5 before:bg-border">
      {entries.map((entry) => (
        <li key={entry.id} className="relative pl-8">
          <span className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-border bg-main" />
          <div className="rounded-base border-2 border-border bg-background p-4 shadow-shadow">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge variant="neutral" className="font-heading">
                {auditActionLabel(entry.action)}
              </Badge>
              <time className="font-mono text-xs text-foreground/60">
                {formatDateTime(entry.createdAt)}
              </time>
            </div>
            <div className="mt-2 font-mono text-sm text-foreground/70">
              Por {userName(entry.userId)}
            </div>
            <ValueChange entry={entry} />
          </div>
        </li>
      ))}
    </ol>
  );
}
