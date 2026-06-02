'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DEFAULT_PAGE_SETUP,
  DocumentPreview,
  Input,
  type PageSetup,
  PageSetupControl,
  RichTextEditor,
  useRole,
} from '@aletheia/frontend-commons';
import { Eye, EyeOff, Power, PowerOff, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Label } from '../../../components/ui/label';
import { NoAccess } from '../../../components/ui/no-access';
import { PageHeader } from '../../../components/ui/page-header';
import { Select } from '../../../components/ui/select';
import { SOCIETIES } from '../../_mock/societies';
import { useTemplates } from '../../_mock/useTemplates';

const EMPTY_CONTENT = '<h2>Nueva plantilla</h2><p>Escribe aquí las cláusulas del contrato…</p>';
const DEFAULT_HEADER = '<p style="text-align:center"><strong>ALETHEIA</strong></p>';
const DEFAULT_FOOTER = '<p style="text-align:center">Documento confidencial · Página {{page}}</p>';

function ActiveToggleButton({
  active,
  disabled,
  onClick,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <Button variant={active ? 'outline' : 'default'} onClick={onClick} disabled={disabled}>
      {active ? (
        <>
          <PowerOff className="h-4 w-4" /> Desactivar
        </>
      ) : (
        <>
          <Power className="h-4 w-4" /> Activar
        </>
      )}
    </Button>
  );
}

interface TemplateFormProps {
  isEdit: boolean;
  name: string;
  societyId: string;
  content: string;
  header: string;
  footer: string;
  pageSetup: PageSetup;
  active: boolean;
  error: string | null;
  savedAt: string | null;
  onNameChange: (v: string) => void;
  onSocietyChange: (v: string) => void;
  onContentChange: (v: string) => void;
  onHeaderChange: (v: string) => void;
  onFooterChange: (v: string) => void;
  onPageSetupChange: (v: PageSetup) => void;
  onSave: () => void;
}

function TemplateForm(props: TemplateFormProps) {
  const {
    isEdit,
    name,
    societyId,
    content,
    header,
    footer,
    pageSetup,
    active,
    error,
    savedAt,
    onNameChange,
    onSocietyChange,
    onContentChange,
    onHeaderChange,
    onFooterChange,
    onPageSetupChange,
    onSave,
  } = props;

  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Datos de la plantilla</CardTitle>
          {isEdit ? (
            <Badge variant={active ? 'default' : 'secondary'}>
              {active ? 'Activa' : 'Inactiva'}
            </Badge>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="tpl-name">Nombre</Label>
              <Input
                id="tpl-name"
                placeholder="Ej. Contrato de Prestación de Servicios"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tpl-society">Sociedad asociada (opcional)</Label>
              <Select
                id="tpl-society"
                value={societyId}
                onChange={(e) => onSocietyChange(e.target.value)}
              >
                <option value="">General (todas las sociedades)</option>
                {SOCIETIES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          {error ? (
            <p className="font-mono text-xs text-red-600" role="alert">
              {error}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Diseño de página</CardTitle>
          <CardDescription>
            Tamaño, márgenes, encabezado y pie. El pie admite el token{' '}
            <code className="font-mono">{'{{page}}'}</code> para el número de página al imprimir.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <PageSetupControl value={pageSetup} onChange={onPageSetupChange} />
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Encabezado</Label>
              <RichTextEditor
                value={header}
                onChange={onHeaderChange}
                compact
                ariaLabel="Encabezado de la plantilla"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Pie de página</Label>
              <RichTextEditor
                value={footer}
                onChange={onFooterChange}
                compact
                ariaLabel="Pie de página de la plantilla"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contenido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RichTextEditor
            value={content}
            onChange={onContentChange}
            ariaLabel="Contenido de la plantilla"
          />
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={onSave}>
              <Save className="h-4 w-4" /> {isEdit ? 'Guardar cambios' : 'Crear plantilla'}
            </Button>
            <Button variant="neutral" onClick={() => setShowPreview((v) => !v)}>
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPreview ? 'Ocultar vista previa' : 'Ver documento'}
            </Button>
            {savedAt ? (
              <span className="font-mono text-xs text-foreground/50">Guardado a las {savedAt}</span>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {showPreview ? (
        <Card>
          <CardHeader>
            <CardTitle>Vista previa del documento</CardTitle>
            <CardDescription>Así se verá la plantilla impresa o en PDF.</CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentPreview body={content} header={header} footer={footer} pageSetup={pageSetup} />
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}

interface TemplateEditorViewProps {
  /** Si se provee, edita la plantilla existente; si no, crea una nueva. */
  templateId?: string;
}

export function TemplateEditorView({ templateId }: TemplateEditorViewProps) {
  const { can } = useRole();
  const { ready, getById, create, update, toggleActive } = useTemplates();
  const router = useRouter();

  const isEdit = Boolean(templateId);
  const [name, setName] = useState('');
  const [societyId, setSocietyId] = useState<string>('');
  const [content, setContent] = useState<string>(EMPTY_CONTENT);
  const [header, setHeader] = useState<string>(DEFAULT_HEADER);
  const [footer, setFooter] = useState<string>(DEFAULT_FOOTER);
  const [pageSetup, setPageSetup] = useState<PageSetup>(DEFAULT_PAGE_SETUP);
  const [active, setActive] = useState(true);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const loadedRef = useRef(false);

  // Carga inicial de la plantilla en modo edición.
  useEffect(() => {
    if (!ready || !isEdit || loadedRef.current || !templateId) return;
    const tpl = getById(templateId);
    if (tpl) {
      setName(tpl.name);
      setSocietyId(tpl.societyId ?? '');
      setContent(tpl.content);
      setHeader(tpl.header);
      setFooter(tpl.footer);
      setPageSetup(tpl.pageSetup);
      setActive(tpl.active);
    }
    loadedRef.current = true;
  }, [ready, isEdit, templateId, getById]);

  if (!can('TEMPLATES_MANAGE')) return <NoAccess />;

  const notFound = Boolean(
    isEdit && ready && loadedRef.current && templateId && !getById(templateId),
  );

  const handleSave = () => {
    if (!name.trim()) {
      setError('El nombre de la plantilla es obligatorio.');
      return;
    }
    setError(null);
    const payload = {
      name,
      societyId: societyId || null,
      content,
      header,
      footer,
      pageSetup,
      active,
    };
    if (isEdit && templateId) {
      update(templateId, payload);
    } else {
      const created = create(payload);
      router.push(`/plantillas/${created.id}`);
      return;
    }
    setSavedAt(new Date().toLocaleTimeString('es-MX'));
  };

  const handleToggleActive = () => {
    if (!templateId) return;
    toggleActive(templateId);
    setActive((a) => !a);
    setSavedAt(new Date().toLocaleTimeString('es-MX'));
  };

  return (
    <main className="bg-grid min-h-screen p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader
          title={isEdit ? 'Editar plantilla' : 'Nueva plantilla'}
          backHref="/plantillas"
          backLabel="Plantillas"
          actions={
            isEdit ? (
              <ActiveToggleButton
                active={active}
                disabled={notFound}
                onClick={handleToggleActive}
              />
            ) : null
          }
        />

        {notFound ? (
          <Card>
            <CardContent className="py-12 text-center font-mono text-foreground/60">
              La plantilla solicitada no existe.
            </CardContent>
          </Card>
        ) : (
          <TemplateForm
            isEdit={isEdit}
            name={name}
            societyId={societyId}
            content={content}
            header={header}
            footer={footer}
            pageSetup={pageSetup}
            active={active}
            error={error}
            savedAt={savedAt}
            onNameChange={setName}
            onSocietyChange={setSocietyId}
            onContentChange={setContent}
            onHeaderChange={setHeader}
            onFooterChange={setFooter}
            onPageSetupChange={setPageSetup}
            onSave={handleSave}
          />
        )}
      </div>
    </main>
  );
}
