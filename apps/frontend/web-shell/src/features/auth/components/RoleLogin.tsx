'use client';

import { Button, Input, Label, Logo } from '@aletheia/frontend-commons';
import { type FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const DEMO_USERS = [
  { email: 'admin@aletheia.com', label: 'Administrador' },
  { email: 'solicitante@aletheia.com', label: 'Solicitante' },
  { email: 'abogado@aletheia.com', label: 'Abogado' },
  { email: 'aprobador@aletheia.com', label: 'Aprobador' },
  { email: 'firmante@aletheia.com', label: 'Firmante' },
];
const DEMO_PASSWORD = 'password123';

export function RoleLogin() {
  const { login, isLoggingIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = async (mail: string, pass: string) => {
    setError(null);
    try {
      await login(mail, pass);
    } catch (err) {
      const status = (err as { status?: number })?.status;
      setError(
        status === 401 || status === 404
          ? 'Credenciales inválidas. Verifica tu correo y contraseña.'
          : 'No se pudo conectar con el servidor. Intenta de nuevo.',
      );
    }
  };

  return (
    <main className="flex min-h-screen">
      {/* ── Panel de marca (izquierda) ───────────────────────────── */}
      <div className="relative hidden w-[52%] flex-col justify-between overflow-hidden bg-foreground p-12 text-background select-none lg:flex xl:p-16">
        {/* Franja teal superior */}
        <div className="absolute inset-x-0 top-0 h-1" style={{ background: '#15a8b5' }} />
        {/* Acento coral inferior */}
        <div className="absolute inset-x-0 bottom-0 h-1" style={{ background: '#fb6a55' }} />
        {/* Patrón de puntos */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        />

        {/* Logo grande de la orca como protagonista */}
        <div className="relative z-10">
          {/* biome-ignore lint/a11y/useAltText: alt explícito */}
          <img
            src="/logo.png"
            alt="ALETHEIA"
            width={120}
            height={120}
            className="h-28 w-28 object-contain xl:h-32 xl:w-32"
          />
        </div>

        <div className="relative z-10">
          <h1
            className="mb-6 font-heading leading-[0.9] tracking-tight text-background"
            style={{ fontSize: 'clamp(3rem, 5vw, 5rem)' }}
          >
            LA VERDAD
            <br />
            DE CADA
            <br />
            <span style={{ color: '#15a8b5' }}>CONTRATO.</span>
          </h1>
          <p className="max-w-sm text-base leading-relaxed text-background/55">
            Gestión del ciclo de vida de contratos: de la solicitud a la firma, con trazabilidad
            completa y control por roles.
          </p>
        </div>

        <div className="relative z-10 border-t border-background/10 pt-6">
          <p className="mb-2 font-heading text-xs uppercase tracking-[0.16em] text-background/30">
            Módulos del sistema
          </p>
          <p className="text-sm leading-relaxed text-background/40">
            Solicitudes · Contratos · Documentos · Flujo de trabajo · Firmas · Reportes ·
            Administración
          </p>
        </div>
      </div>

      {/* ── Panel del formulario (derecha) ───────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-secondary-background px-6 py-12 sm:px-10">
        <div className="w-full max-w-[400px]">
          {/* Marca en móvil */}
          <div className="mb-8 flex flex-col items-center gap-3 lg:hidden">
            <Logo size={64} variant="mark" />
            <span className="font-heading text-3xl tracking-tight">ALETHEIA</span>
          </div>

          <div className="rounded-base border-2 border-border bg-background shadow-lg">
            <div className="border-b-2 border-border px-7 py-6">
              <h2 className="font-heading text-2xl leading-none">Iniciar sesión</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Ingresa tus credenciales para acceder
              </p>
            </div>

            <div className="px-7 py-6">
              <form
                onSubmit={(e: FormEvent) => {
                  e.preventDefault();
                  submit(email, password);
                }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@aletheia.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                {error && (
                  <div className="rounded-base border-2 border-destructive bg-destructive/10 px-3 py-2.5">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <Button type="submit" className="w-full" size="lg" isLoading={isLoggingIn}>
                  Entrar
                </Button>
              </form>

              <div className="mt-6 border-t-2 border-border pt-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Acceso rápido — demo</span>
                  <code className="rounded-base border-2 border-border bg-secondary-background px-2 py-0.5 text-xs">
                    password123
                  </code>
                </div>
                <div className="flex flex-wrap gap-2">
                  {DEMO_USERS.map((u) => (
                    <button
                      key={u.email}
                      type="button"
                      disabled={isLoggingIn}
                      onClick={() => {
                        setEmail(u.email);
                        setPassword(DEMO_PASSWORD);
                        submit(u.email, DEMO_PASSWORD);
                      }}
                      className="rounded-base border-2 border-border bg-background px-3 py-1.5 text-xs font-sans shadow-sm transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-secondary-background hover:shadow-none disabled:pointer-events-none disabled:opacity-40"
                    >
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
