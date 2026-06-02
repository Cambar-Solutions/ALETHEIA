'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  useRole,
} from '@aletheia/frontend-commons';
import { FileText, Save } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Label } from '../../../components/ui/label';
import { NoAccess } from '../../../components/ui/no-access';
import { PageHeader } from '../../../components/ui/page-header';
import { RichTextEditor } from '../../../components/ui/rich-text-editor';
import { Select } from '../../../components/ui/select';
import { MOCK_CONTRACTS, readContractDoc, writeContractDoc } from '../../_mock/contracts';
import { societyName } from '../../_mock/societies';
import { useTemplates } from '../../_mock/useTemplates';

export function ContractEditorView() {
  const { can } = useRole();
  const { templates, ready } = useTemplates();

  const [contractId, setContractId] = useState<string>(MOCK_CONTRACTS[0].id);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [doc, setDoc] = useState<string>('');
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  const contract = useMemo(
    () => MOCK_CONTRACTS.find((c) => c.id === contractId) ?? MOCK_CONTRACTS[0],
    [contractId],
  );

  // Plantillas elegibles: activas y (de la sociedad del contrato o generales).
  const eligibleTemplates = useMemo(
    () =>
      templates.filter(
        (t) => t.active && (t.societyId === null || t.societyId === contract.societyId),
      ),
    [templates, contract.societyId],
  );

  // Al cambiar de contrato: carga el documento guardado (si existe) y resetea.
  useEffect(() => {
    if (!ready) return;
    const existing = readContractDoc(contract.id);
    setDoc(existing ?? '');
    setSelectedTemplateId('');
    setDirty(false);
    setSavedAt(null);
  }, [contract.id, ready]);

  const canAccess = can('TEMPLATES_MANAGE') || can('CONTRACT_EDIT');
  if (!canAccess) {
    return <NoAccess title="Elaborar documento" />;
  }

  const applyTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tpl = eligibleTemplates.find((t) => t.id === templateId);
    if (!tpl) return;
    if (doc && dirty) {
      const ok = window.confirm('Esto reemplazará el contenido actual del documento. ¿Continuar?');
      if (!ok) {
        setSelectedTemplateId('');
        return;
      }
    }
    setDoc(tpl.content);
    setDirty(true);
  };

  const handleSave = () => {
    writeContractDoc(contract.id, doc);
    setSavedAt(new Date().toLocaleTimeString('es-MX'));
    setDirty(false);
  };

  return (
    <main className="bg-grid min-h-screen p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader title="Elaborar documento" backHref="/" backLabel="Inicio" />

        <Card>
          <CardHeader>
            <CardTitle>Contrato</CardTitle>
            <CardDescription>
              Selecciona el contrato y una plantilla para iniciar su documento (HU-19).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="contract-select">Contrato</Label>
                <Select
                  id="contract-select"
                  value={contractId}
                  onChange={(e) => setContractId(e.target.value)}
                >
                  {MOCK_CONTRACTS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id} · {c.title}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="template-select">Plantilla (filtrada por sociedad)</Label>
                <Select
                  id="template-select"
                  value={selectedTemplateId}
                  onChange={(e) => applyTemplate(e.target.value)}
                  disabled={!ready || eligibleTemplates.length === 0}
                >
                  <option value="">
                    {eligibleTemplates.length === 0
                      ? 'Sin plantillas activas para esta sociedad'
                      : 'Selecciona una plantilla…'}
                  </option>
                  {eligibleTemplates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                      {t.societyId === null ? ' (General)' : ''}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-foreground/60">
              <span>Sociedad:</span>
              <Badge variant="secondary">{societyName(contract.societyId)}</Badge>
              <span>· Contraparte:</span>
              <span>{contract.counterparty}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Documento del contrato</CardTitle>
            {dirty ? <Badge variant="outline">Sin guardar</Badge> : null}
          </CardHeader>
          <CardContent className="space-y-4">
            {doc ? (
              <RichTextEditor
                value={doc}
                onChange={(html) => {
                  setDoc(html);
                  setDirty(true);
                }}
                ariaLabel="Documento del contrato"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-base border-2 border-dashed border-border/50 py-12 text-center">
                <FileText className="h-8 w-8 text-foreground/40" />
                <p className="font-mono text-sm text-foreground/50">
                  Selecciona una plantilla para cargar el contenido inicial. Luego podrás editarlo
                  libremente.
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={handleSave} disabled={!doc}>
                <Save className="h-4 w-4" /> Guardar documento
              </Button>
              {savedAt ? (
                <span className="font-mono text-xs text-foreground/50">
                  Guardado a las {savedAt}
                </span>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
