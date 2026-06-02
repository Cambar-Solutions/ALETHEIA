'use client';

import { Button } from '@aletheia/frontend-commons';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  /** href del botón de volver. Default: raíz del MF. */
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
}

/** Encabezado de página estándar del MF (local). */
export function PageHeader({
  title,
  backHref = '/',
  backLabel = 'Inicio',
  actions,
}: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <a href={backHref}>
          <Button variant="outline" size="sm">
            &larr; {backLabel}
          </Button>
        </a>
        <h1 className="text-4xl font-heading">{title}</h1>
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}
