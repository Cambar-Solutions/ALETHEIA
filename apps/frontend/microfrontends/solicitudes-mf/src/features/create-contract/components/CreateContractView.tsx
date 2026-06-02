'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  useRole,
} from '@aletheia/frontend-commons';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { Field } from '../../../components/ui/field';
import { RadioCards } from '../../../components/ui/radio-cards';
import { Select } from '../../../components/ui/select';
import {
  AREAS,
  PROVIDER_TYPE_LABEL,
  type ProviderType,
  SOCIETIES,
  useContracts,
} from '../../_mock/contracts';
import { PageHeader } from '../../_shared/components/PageHeader';
import { RequiredDocsList } from '../../_shared/components/RequiredDocsList';

interface FormState {
  title: string;
  society: string;
  providerName: string;
  providerEmail: string;
  providerType: ProviderType;
  area: string;
}

const EMPTY: FormState = {
  title: '',
  society: SOCIETIES[0],
  providerName: '',
  providerEmail: '',
  providerType: 'PERSONA_FISICA',
  area: AREAS[0],
};

type Errors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (!form.title.trim()) errors.title = 'El título es obligatorio.';
  if (!form.providerName.trim()) errors.providerName = 'El nombre del proveedor es obligatorio.';
  if (!form.providerEmail.trim()) {
    errors.providerEmail = 'El email es obligatorio.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.providerEmail.trim())) {
    errors.providerEmail = 'Email inválido.';
  }
  return errors;
}

export function CreateContractView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');

  const { ready, getById, createContract, updateContract, nextFolioPreview } = useContracts();
  const { can } = useRole();

  const [form, setForm] = React.useState<FormState>(EMPTY);
  const [errors, setErrors] = React.useState<Errors>({});
  const [loaded, setLoaded] = React.useState(false);

  const existing = editId ? getById(editId) : undefined;
  const isEdit = Boolean(editId);

  // Hydrate the form in edit mode once the store is ready.
  React.useEffect(() => {
    if (!ready) return;
    if (isEdit && existing && !loaded) {
      setForm({
        title: existing.title,
        society: existing.society,
        providerName: existing.providerName,
        providerEmail: existing.providerEmail,
        providerType: existing.providerType,
        area: existing.area,
      });
      setLoaded(true);
    }
  }, [ready, isEdit, existing, loaded]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    if (isEdit && existing) {
      updateContract(existing.id, form);
      router.push(`/${existing.id}`);
    } else {
      const created = createContract(form);
      router.push(`/${created.id}`);
    }
  };

  // Permission / state guards ------------------------------------------------
  if (!can('CONTRACT_CREATE')) {
    return (
      <main className="bg-grid min-h-screen p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <PageHeader title="Nueva solicitud" />
          <Card>
            <CardContent className="p-6">
              <Badge variant="destructive">Sin permiso para crear solicitudes</Badge>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (isEdit && ready && (!existing || existing.status !== 'DRAFT')) {
    return (
      <main className="bg-grid min-h-screen p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <PageHeader title="Editar solicitud" />
          <Card>
            <CardContent className="space-y-4 p-6">
              <p className="font-mono text-sm text-foreground/70">
                {existing
                  ? 'Solo las solicitudes en estado Borrador pueden editarse.'
                  : 'Solicitud no encontrada.'}
              </p>
              <Button variant="neutral" size="sm" onClick={() => router.push('/')}>
                <ArrowLeft className="h-4 w-4" /> Volver al listado
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-grid min-h-screen p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <PageHeader
          title={isEdit ? 'Editar solicitud' : 'Nueva solicitud'}
          subtitle={isEdit ? existing?.folio : 'Folio generado automáticamente'}
          actions={
            <Button variant="neutral" size="sm" onClick={() => router.push('/')}>
              <ArrowLeft className="h-4 w-4" /> Volver
            </Button>
          }
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Datos de la solicitud</CardTitle>
              <CardDescription>
                Folio: {isEdit ? existing?.folio : nextFolioPreview()} · Estado inicial: Borrador
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <Field label="Título del contrato" htmlFor="title" required error={errors.title}>
                <Input
                  id="title"
                  placeholder="Ej. Suministro de equipo de cómputo"
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                />
              </Field>

              <Field label="Sociedad" htmlFor="society" required>
                <Select
                  id="society"
                  value={form.society}
                  onChange={(e) => set('society', e.target.value)}
                >
                  {SOCIETIES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Nombre del proveedor"
                  htmlFor="providerName"
                  required
                  error={errors.providerName}
                >
                  <Input
                    id="providerName"
                    placeholder="Razón social o nombre"
                    value={form.providerName}
                    onChange={(e) => set('providerName', e.target.value)}
                  />
                </Field>

                <Field
                  label="Email del proveedor"
                  htmlFor="providerEmail"
                  required
                  error={errors.providerEmail}
                >
                  <Input
                    id="providerEmail"
                    type="email"
                    placeholder="contacto@proveedor.mx"
                    value={form.providerEmail}
                    onChange={(e) => set('providerEmail', e.target.value)}
                  />
                </Field>
              </div>

              <Field label="Tipo de proveedor" required>
                <RadioCards
                  name="providerType"
                  value={form.providerType}
                  onChange={(v) => set('providerType', v)}
                  options={[
                    {
                      value: 'PERSONA_FISICA',
                      label: PROVIDER_TYPE_LABEL.PERSONA_FISICA,
                      hint: 'Individuo con actividad económica',
                    },
                    {
                      value: 'PERSONA_MORAL',
                      label: PROVIDER_TYPE_LABEL.PERSONA_MORAL,
                      hint: 'Empresa / sociedad mercantil',
                    },
                  ]}
                />
              </Field>

              <Field label="Área requirente" htmlFor="area" required>
                <Select id="area" value={form.area} onChange={(e) => set('area', e.target.value)}>
                  {AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </Select>
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documentos requeridos</CardTitle>
              <CardDescription>
                Lista dinámica según el tipo de proveedor (informativo)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RequiredDocsList providerType={form.providerType} />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="neutral" onClick={() => router.push('/')}>
              Cancelar
            </Button>
            <Button type="submit">{isEdit ? 'Guardar cambios' : 'Crear solicitud'}</Button>
          </div>
        </form>
      </div>
    </main>
  );
}
