// Mock template store — persisted in localStorage (key: aletheia_templates).
// No backend: this module is the single source of truth for templates in the MF.

export interface Template {
  id: string;
  name: string;
  /** societyId asociado, o null => plantilla "General" (aplica a cualquiera). */
  societyId: string | null;
  active: boolean;
  /** Contenido HTML del cuerpo de la plantilla (cláusulas tipo contrato). */
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const TEMPLATES_STORAGE_KEY = 'aletheia_templates';

/* ─── Seed data ───────────────────────────────────────────────────────── */

const now = '2026-01-15T10:00:00.000Z';

export const SEED_TEMPLATES: Template[] = [
  {
    id: 'tpl-001',
    name: 'Contrato de Prestación de Servicios',
    societyId: null,
    active: true,
    content: `<h2>Contrato de Prestación de Servicios</h2>
<p>En la Ciudad de México, a la fecha de su firma, comparecen las partes para celebrar el presente <strong>Contrato de Prestación de Servicios</strong>, al tenor de las siguientes cláusulas.</p>
<h3>Primera. Objeto</h3>
<p>El <strong>Prestador</strong> se obliga a prestar al <strong>Cliente</strong> los servicios descritos en el Anexo A, con la diligencia y calidad profesional exigibles.</p>
<h3>Segunda. Contraprestación</h3>
<p>El Cliente pagará la cantidad pactada conforme al calendario de pagos acordado por las partes.</p>
<h3>Tercera. Confidencialidad</h3>
<ul>
<li>Las partes guardarán reserva sobre la información intercambiada.</li>
<li>La obligación subsistirá por dos años tras la terminación del contrato.</li>
</ul>`,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'tpl-002',
    name: 'Contrato de Compraventa',
    societyId: 'soc-001',
    active: true,
    content: `<h2>Contrato de Compraventa</h2>
<p>Las partes celebran el presente <strong>Contrato de Compraventa</strong> respecto del bien identificado en el cuerpo del documento.</p>
<h3>Primera. Bien objeto</h3>
<p>El <strong>Vendedor</strong> transmite la propiedad del bien al <strong>Comprador</strong>, libre de todo gravamen.</p>
<h3>Segunda. Precio y forma de pago</h3>
<p>El precio total será cubierto en una sola exhibición contra entrega del bien.</p>
<h3>Tercera. Saneamiento</h3>
<p>El Vendedor responde por <em>evicción y vicios ocultos</em> en los términos de la legislación aplicable.</p>`,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'tpl-003',
    name: 'Contrato de Arrendamiento',
    societyId: 'soc-004',
    active: true,
    content: `<h2>Contrato de Arrendamiento</h2>
<p>El presente <strong>Contrato de Arrendamiento</strong> se rige por las siguientes cláusulas.</p>
<h3>Primera. Inmueble arrendado</h3>
<p>El <strong>Arrendador</strong> concede el uso y goce temporal del inmueble al <strong>Arrendatario</strong>.</p>
<h3>Segunda. Renta</h3>
<ul>
<li>La renta mensual se pagará dentro de los primeros cinco días de cada mes.</li>
<li>El depósito en garantía equivale a una mensualidad.</li>
</ul>
<h3>Tercera. Vigencia</h3>
<p>El contrato tendrá una vigencia forzosa de doce meses, prorrogable por acuerdo de las partes.</p>`,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'tpl-004',
    name: 'Convenio de Confidencialidad (NDA)',
    societyId: null,
    active: true,
    content: `<h2>Convenio de Confidencialidad</h2>
<p>Las partes suscriben el presente <strong>Convenio de Confidencialidad (NDA)</strong> para proteger la información que se revelen recíprocamente.</p>
<h3>Primera. Información confidencial</h3>
<p>Se considera confidencial toda información técnica, comercial o financiera marcada como tal o que por su naturaleza deba reputarse reservada.</p>
<h3>Segunda. Obligaciones</h3>
<ul>
<li>No divulgar la información a terceros sin consentimiento previo y por escrito.</li>
<li>Emplear la información únicamente para el propósito autorizado.</li>
</ul>
<h3>Tercera. Vigencia</h3>
<p>Las obligaciones subsistirán por <em>tres años</em> contados a partir de la última divulgación.</p>`,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'tpl-005',
    name: 'Contrato de Servicios Logísticos',
    societyId: 'soc-003',
    active: false,
    content: `<h2>Contrato de Servicios Logísticos</h2>
<p>El presente contrato regula la prestación de <strong>servicios de logística y transporte</strong> entre las partes.</p>
<h3>Primera. Alcance</h3>
<p>El Operador realizará la recolección, almacenamiento y entrega de mercancías conforme a las órdenes de servicio.</p>
<h3>Segunda. Responsabilidad</h3>
<p>El Operador responde por la integridad de la mercancía durante el trayecto, salvo caso fortuito o fuerza mayor.</p>`,
    createdAt: now,
    updatedAt: now,
  },
];

/* ─── localStorage helpers ────────────────────────────────────────────── */

export function readTemplates(): Template[] {
  if (typeof window === 'undefined') return SEED_TEMPLATES;
  try {
    const raw = window.localStorage.getItem(TEMPLATES_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(SEED_TEMPLATES));
      return SEED_TEMPLATES;
    }
    const parsed = JSON.parse(raw) as Template[];
    return Array.isArray(parsed) ? parsed : SEED_TEMPLATES;
  } catch {
    return SEED_TEMPLATES;
  }
}

export function writeTemplates(templates: Template[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
  } catch {
    /* ignore quota / serialization errors in mock mode */
  }
}

export function generateId(): string {
  return `tpl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}
