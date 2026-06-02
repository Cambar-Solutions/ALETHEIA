'use client';

import { DEFAULT_PAGE_SETUP, type PageSetup } from '@aletheia/frontend-commons';
import { useCallback, useEffect, useState } from 'react';
import { type Template, generateId, readTemplates, writeTemplates } from './templates';

export interface TemplateInput {
  name: string;
  societyId: string | null;
  content: string;
  active?: boolean;
  header?: string;
  footer?: string;
  pageSetup?: PageSetup;
}

/**
 * Hook de acceso al store mock de plantillas (localStorage).
 * Expone list + operaciones CRUD-lite (sin eliminar, según HU-18).
 */
export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTemplates(readTemplates());
    setReady(true);
  }, []);

  const persist = useCallback((next: Template[]) => {
    setTemplates(next);
    writeTemplates(next);
  }, []);

  const getById = useCallback(
    (id: string) => templates.find((t) => t.id === id) ?? null,
    [templates],
  );

  const create = useCallback(
    (input: TemplateInput): Template => {
      const ts = new Date().toISOString();
      const template: Template = {
        id: generateId(),
        name: input.name.trim(),
        societyId: input.societyId,
        content: input.content,
        header: input.header ?? '',
        footer: input.footer ?? '',
        pageSetup: input.pageSetup ?? DEFAULT_PAGE_SETUP,
        active: input.active ?? true,
        createdAt: ts,
        updatedAt: ts,
      };
      persist([template, ...templates]);
      return template;
    },
    [templates, persist],
  );

  const update = useCallback(
    (id: string, input: Partial<TemplateInput>): Template | null => {
      const patch: Partial<Template> = { updatedAt: new Date().toISOString() };
      if (input.name !== undefined) patch.name = input.name.trim();
      if ('societyId' in input) patch.societyId = input.societyId ?? null;
      if (input.content !== undefined) patch.content = input.content;
      if (input.active !== undefined) patch.active = input.active;
      if (input.header !== undefined) patch.header = input.header;
      if (input.footer !== undefined) patch.footer = input.footer;
      if (input.pageSetup !== undefined) patch.pageSetup = input.pageSetup;

      let updated: Template | null = null;
      const next = templates.map((t) => {
        if (t.id !== id) return t;
        updated = { ...t, ...patch };
        return updated;
      });
      persist(next);
      return updated;
    },
    [templates, persist],
  );

  const toggleActive = useCallback(
    (id: string) => {
      const next = templates.map((t) =>
        t.id === id ? { ...t, active: !t.active, updatedAt: new Date().toISOString() } : t,
      );
      persist(next);
    },
    [templates, persist],
  );

  return { templates, ready, getById, create, update, toggleActive };
}
