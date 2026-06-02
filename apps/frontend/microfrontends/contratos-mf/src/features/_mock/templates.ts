// Mock template store — persisted in localStorage (key: aletheia_templates).
// No backend: this module is the single source of truth for templates in the MF.

import { DEFAULT_PAGE_SETUP, type PageSetup } from '@aletheia/frontend-commons';

export interface Template {
  id: string;
  name: string;
  /** societyId asociado, o null => plantilla "General" (aplica a cualquiera). */
  societyId: string | null;
  active: boolean;
  /** Contenido HTML del cuerpo de la plantilla (cláusulas tipo contrato). */
  content: string;
  /** HTML del encabezado (logo + texto). */
  header: string;
  /** HTML del pie de página (admite el token {{page}}). */
  footer: string;
  /** Tamaño de página + márgenes. */
  pageSetup: PageSetup;
  createdAt: string;
  updatedAt: string;
}

type SeedTemplate = Omit<Template, 'header' | 'footer' | 'pageSetup'>;

const SEED_HEADER = '<p style="text-align:center"><strong>ALETHEIA</strong></p>';
const SEED_FOOTER = '<p style="text-align:center">Documento confidencial · Página {{page}}</p>';

/** Rellena los campos de diseño faltantes (migración suave de registros viejos). */
function normalizeTemplate(t: Partial<Template> & SeedTemplate): Template {
  return {
    ...t,
    header: typeof t.header === 'string' ? t.header : '',
    footer: typeof t.footer === 'string' ? t.footer : '',
    pageSetup:
      t.pageSetup && typeof t.pageSetup === 'object' && 'size' in t.pageSetup
        ? t.pageSetup
        : DEFAULT_PAGE_SETUP,
  };
}

export const TEMPLATES_STORAGE_KEY = 'aletheia_templates';

/* ─── Seed data ───────────────────────────────────────────────────────── */

const now = '2026-01-15T10:00:00.000Z';

const RAW_SEED_TEMPLATES: SeedTemplate[] = [
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

/* ─── Plantilla destacada: bien diseñada (colores + tabla + imágenes) ──── */

// Logos/imagen embebidos como SVG en base64 (data URI) — autocontenidos.
const SHOWCASE_LOGO =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iNDAiPjxyZWN0IHg9IjIiIHk9IjIiIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiIgcng9IjYiIGZpbGw9IiMxNUE4QjUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIzIi8+PHRleHQgeD0iMjAiIHk9IjI4IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjIiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BPC90ZXh0Pjx0ZXh0IHg9IjQ2IiB5PSIyNyIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzBmMTcyYSI+QUxFVEhFSUE8L3RleHQ+PC9zdmc+';
const SHOWCASE_PHOTO =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIj48cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iMTk0IiBoZWlnaHQ9IjE0NCIgcng9IjEwIiBmaWxsPSIjZThmN2Y5IiBzdHJva2U9IiMxNUE4QjUiIHN0cm9rZS13aWR0aD0iMyIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjU2IiByPSIyNCIgZmlsbD0iIzE1QThCNSIvPjxwYXRoIGQ9Ik02MiAxMjQgcTM4IC00MCA3NiAwIHoiIGZpbGw9IiMxNUE4QjUiLz48dGV4dCB4PSIxMDAiIHk9IjE0MiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjMGYxNzJhIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Gb3RvZ3JhZmlhIGRlbCB0YWxlbnRvPC90ZXh0Pjwvc3ZnPg==';

const SHOWCASE_HEADER = `<p style="text-align:center"><img src="${SHOWCASE_LOGO}" alt="ALETHEIA"></p>
<p style="text-align:center"><span style="color: #15A8B5"><strong>ALETHEIA LEGAL</strong></span> — Cesión de Derechos de Imagen</p>`;

const SHOWCASE_FOOTER =
  '<p style="text-align:center"><span style="color: #64748B">Confidencial — uso interno · Página {{page}}</span></p>';

const SHOWCASE_BODY = `<h1 style="text-align:center"><span style="color: #0F172A">CONTRATO DE CESIÓN DE DERECHOS DE IMAGEN</span></h1>
<p style="text-align:center"><em>entre <strong>el Talento</strong> y <strong style="color: #15A8B5">la Empresa</strong></em></p>
<p>En la Ciudad de México, comparecen para celebrar el presente <strong>Contrato de Cesión de Derechos de Imagen</strong> (el «Contrato»):</p>
<p>De una parte, <strong>[NOMBRE DEL MODELO]</strong> (en adelante, <span style="color: #15A8B5"><strong>«el Talento»</strong></span>); y de la otra, <strong>[RAZÓN SOCIAL]</strong> (en adelante, <span style="color: #15A8B5"><strong>«la Empresa»</strong></span>), al tenor de las siguientes cláusulas.</p>
<table><tbody><tr><th>Concepto</th><th>Detalle</th></tr><tr><td>Objeto</td><td>Uso de imagen, rostro y voz del Talento</td></tr><tr><td>Medios</td><td>Digital, impreso, redes sociales y vía pública</td></tr><tr><td>Territorio</td><td>República Mexicana</td></tr><tr><td>Vigencia</td><td>12 meses a partir de la firma</td></tr></tbody></table>
<h3 style="color: #15A8B5">Primera. Objeto</h3>
<p>El Talento <strong>cede</strong> a la Empresa el uso de su <mark>imagen, rostro, voz y semejanza</mark> (la «Imagen») con fines de promoción y publicidad, conforme a lo descrito en este Contrato.</p>
<p style="text-align:center"><img src="${SHOWCASE_PHOTO}" alt="Fotografía del talento"></p>
<p style="text-align:center"><span style="color: #64748B"><em>Material de referencia autorizado por el Talento</em></span></p>
<h3 style="color: #15A8B5">Segunda. Alcance y medios</h3>
<ul><li>Campañas digitales, redes sociales y sitio web de la Empresa.</li><li>Material impreso: folletos, carteles y empaques.</li><li>Publicidad en vía pública dentro del Territorio.</li></ul>
<h3 style="color: #15A8B5">Tercera. Territorio y vigencia</h3>
<p>La cesión aplica en <strong>la República Mexicana</strong> por un plazo de <strong>doce (12) meses</strong>, renovable por acuerdo escrito de las partes.</p>
<h3 style="color: #15A8B5">Cuarta. Contraprestación</h3>
<p>La Empresa pagará al Talento la cantidad de <strong>$[MONTO] MXN</strong> como contraprestación única por la cesión aquí pactada.</p>
<h3 style="color: #DC2626">Quinta. Limitaciones</h3>
<p>La Empresa <strong>no podrá</strong> usar la Imagen en contextos <span style="color: #DC2626"><strong>difamatorios, ilícitos o que dañen la reputación</strong></span> del Talento. Cualquier uso fuera del alcance pactado requerirá <u>autorización previa y por escrito</u>.</p>
<h3 style="color: #15A8B5">Sexta. Confidencialidad</h3>
<p>Las partes guardarán reserva sobre los términos económicos del presente Contrato.</p>
<p style="text-align:center">_______________________________&nbsp;&nbsp;&nbsp;&nbsp;_______________________________</p>
<p style="text-align:center"><strong>El Talento</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>la Empresa</strong></p>`;

const SHOWCASE_TEMPLATE: Template = {
  id: 'tpl-006',
  name: 'Cesión de Derechos de Imagen (Modelo)',
  societyId: null,
  active: true,
  content: SHOWCASE_BODY,
  header: SHOWCASE_HEADER,
  footer: SHOWCASE_FOOTER,
  pageSetup: DEFAULT_PAGE_SETUP,
  createdAt: now,
  updatedAt: now,
};

/** Plantillas semilla: las base + la plantilla destacada (bien diseñada). */
export const SEED_TEMPLATES: Template[] = [
  ...RAW_SEED_TEMPLATES.map((t) => ({
    ...t,
    header: SEED_HEADER,
    footer: SEED_FOOTER,
    pageSetup: DEFAULT_PAGE_SETUP,
  })),
  SHOWCASE_TEMPLATE,
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
    const parsed = JSON.parse(raw) as Array<Partial<Template> & SeedTemplate>;
    const stored = Array.isArray(parsed) ? parsed.map(normalizeTemplate) : [];
    // Fusiona seeds nuevas (por id) sin pisar lo que el usuario ya editó.
    const storedIds = new Set(stored.map((t) => t.id));
    const withSeeds = [...stored, ...SEED_TEMPLATES.filter((s) => !storedIds.has(s.id))];
    if (withSeeds.length !== stored.length) {
      window.localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(withSeeds));
    }
    return withSeeds.length ? withSeeds : SEED_TEMPLATES;
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
