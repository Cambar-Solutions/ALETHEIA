'use client';

import { Button, cn } from '@aletheia/frontend-commons';
import { Bold, Code2, Eye, Italic, List, ListOrdered, Pilcrow } from 'lucide-react';
import * as React from 'react';
import { Textarea } from './textarea';

/* ─── Sanitizado mínimo (mock, sin backend) ───────────────────────────── */
// Para una app real se usaría DOMPurify; aquí basta con remover <script>,
// manejadores on* y javascript: para mantener limpia la consola y el preview.
function sanitizeHtml(html: string): string {
  return html
    .replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '')
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}

type Mode = 'edit' | 'html' | 'preview';

interface ToolbarButtonProps {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}

function ToolbarButton({ label, onClick, children }: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant="neutral"
      size="sm"
      className="h-8 px-2"
      aria-label={label}
      title={label}
      // Evita que el contenteditable pierda el foco/selección al hacer clic.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  /** Permite alternar a vista de código HTML. Default: true. */
  allowHtmlSource?: boolean;
  className?: string;
  ariaLabel?: string;
}

/**
 * Editor de texto enriquecido sencillo (WYSIWYG-lite).
 * - contenteditable con botones de formato básicos (negrita, itálica, listas).
 * - Toggle de vista de código HTML (editable) y vista previa.
 * Local al MF; reutilizado por template-editor y contract-editor.
 */
export function RichTextEditor({
  value,
  onChange,
  allowHtmlSource = true,
  className,
  ariaLabel = 'Editor de contenido',
}: RichTextEditorProps) {
  const [mode, setMode] = React.useState<Mode>('edit');
  const editorRef = React.useRef<HTMLDivElement>(null);

  // Sincroniza el DOM del contenteditable cuando el valor cambia desde fuera
  // (p. ej. al cargar una plantilla) sin pisar lo que el usuario escribe.
  React.useEffect(() => {
    if (mode !== 'edit') return;
    const el = editorRef.current;
    if (el && el.innerHTML !== value) {
      el.innerHTML = value;
    }
  }, [value, mode]);

  const exec = (command: string) => {
    if (typeof document === 'undefined') return;
    document.execCommand(command, false);
    const el = editorRef.current;
    if (el) onChange(sanitizeHtml(el.innerHTML));
  };

  const formatBlock = (tag: string) => {
    if (typeof document === 'undefined') return;
    document.execCommand('formatBlock', false, tag);
    const el = editorRef.current;
    if (el) onChange(sanitizeHtml(el.innerHTML));
  };

  const handleInput = () => {
    const el = editorRef.current;
    if (el) onChange(sanitizeHtml(el.innerHTML));
  };

  return (
    <div
      className={cn('rounded-base border-2 border-border bg-background shadow-shadow', className)}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b-2 border-border p-2">
        {mode === 'edit' && (
          <>
            <ToolbarButton label="Negrita" onClick={() => exec('bold')}>
              <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton label="Itálica" onClick={() => exec('italic')}>
              <Italic className="h-4 w-4" />
            </ToolbarButton>
            <span className="mx-1 h-5 w-[2px] bg-border" aria-hidden />
            <ToolbarButton label="Párrafo" onClick={() => formatBlock('p')}>
              <Pilcrow className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton label="Subtítulo" onClick={() => formatBlock('h3')}>
              <span className="font-heading text-xs">H3</span>
            </ToolbarButton>
            <span className="mx-1 h-5 w-[2px] bg-border" aria-hidden />
            <ToolbarButton label="Lista con viñetas" onClick={() => exec('insertUnorderedList')}>
              <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton label="Lista numerada" onClick={() => exec('insertOrderedList')}>
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
          </>
        )}

        <div className="ml-auto flex items-center gap-1">
          <ToolbarButton label="Editar" onClick={() => setMode('edit')}>
            <span className={cn('text-xs', mode === 'edit' && 'underline')}>Editar</span>
          </ToolbarButton>
          {allowHtmlSource && (
            <ToolbarButton label="Código HTML" onClick={() => setMode('html')}>
              <Code2 className={cn('h-4 w-4', mode === 'html' && 'text-main')} />
            </ToolbarButton>
          )}
          <ToolbarButton label="Vista previa" onClick={() => setMode('preview')}>
            <Eye className={cn('h-4 w-4', mode === 'preview' && 'text-main')} />
          </ToolbarButton>
        </div>
      </div>

      {/* Body */}
      {mode === 'edit' && (
        <div
          ref={editorRef}
          role="textbox"
          aria-multiline="true"
          aria-label={ariaLabel}
          tabIndex={0}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          className="prose-clm min-h-[260px] max-w-none px-4 py-3 text-sm font-sans outline-none"
        />
      )}

      {mode === 'html' && (
        <Textarea
          value={value}
          aria-label="Código HTML"
          onChange={(e) => onChange(sanitizeHtml(e.target.value))}
          className="min-h-[260px] rounded-none border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      )}

      {mode === 'preview' && (
        <div
          className="prose-clm min-h-[260px] max-w-none px-4 py-3 text-sm font-sans"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: contenido controlado por el autor y saneado por sanitizeHtml (mock sin backend).
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(value) }}
        />
      )}
    </div>
  );
}
