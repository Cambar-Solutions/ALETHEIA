# Ejecutar el Proyecto — Desarrollo Local

Guía paso a paso para levantar ALETHEIA (CLM) en local: infraestructura (PostgreSQL + Redis), gateway, microservicios y microfrontends.

---

## Prerequisitos

| Herramienta | Versión | Notas |
|---|---|---|
| Node.js | ≥ 20 LTS | Ver `.nvmrc`. Usa `nvm use` si tienes nvm. |
| pnpm | **10.8.1** | Gestor único del monorepo (`corepack enable` o `npm i -g pnpm@10.8.1`). |
| Docker + Docker Compose | reciente | Para PostgreSQL 16 y Redis 7. |

> Todo se ejecuta **desde la raíz del repositorio** (`ALETHEIA/`), que es también la raíz del monorepo Turborepo. Ya no existe la carpeta `clm-system/`.

---

## Paso 1 — Instalar dependencias

```bash
pnpm install
```

Instala todas las apps y paquetes del workspace en una sola pasada. No debe aparecer el error `prepare: .git can't be found` (Husky encuentra `.git` porque el monorepo está aplanado a la raíz).

---

## Paso 2 — Variables de entorno

Copia el ejemplo y ajusta si hace falta:

```bash
cp .env.example .env
```

Variables clave (valores por defecto del compose):

```
DATABASE_URL=postgresql://clm_user:clm_pass@localhost:5432/clm_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=<tu-secreto>
JWT_REFRESH_SECRET=<tu-secreto-refresh>
```

Cada microservicio apunta a su schema con `?schema=<nombre>` (`auth`, `contracts`, `workflow`, `documents`) sobre la misma `DATABASE_URL`.

---

## Paso 3 — Levantar la infraestructura

```bash
pnpm infra:up
```

Equivale a `docker compose -f infra/docker/compose/docker-compose.dev.yml up -d` y deja corriendo:

- **PostgreSQL 16** en `localhost:5432` (base `clm_dev`, schemas `auth`/`contracts`/`workflow`/`documents`).
- **Redis 7** en `localhost:6379` (transporte pub/sub entre gateway y servicios).

Verifica con `docker ps` que ambos contenedores estén `Up`.

---

## Paso 4 — Migraciones y seed

Aplica las migraciones de Prisma de cada servicio y siembra roles/privilegios y catálogos base:

```bash
pnpm db:migrate   # corre prisma migrate de los 4 servicios
pnpm db:seed      # 5 roles, 19 privilegios, RolePrivilege, Area y Society base
```

---

## Paso 5 — Levantar las apps

### Opción A — Recomendada en laptop: `dev:core`

Levanta solo el subconjunto necesario para el módulo funcional de referencia:
gateway + `auth-service` + `contracts-service` + `workflow-service` + `web-shell` + `solicitudes-mf` + `flujo-mf`.

```bash
pnpm dev:core
```

### Opción B — Todo el sistema

Levanta gateway + 4 microservicios + web-shell + los 7 microfrontends (~15 procesos; pesado en una laptop):

```bash
pnpm dev
```

Ambos comandos usan Turborepo para arrancar las apps en paralelo.

---

## Paso 6 — Verificar

| Qué | URL |
|---|---|
| Swagger (API REST del gateway) | http://localhost:3000/api/docs |
| Gateway (API) | http://localhost:3000 |
| web-shell (host de microfrontends) | http://localhost:4000 |

Prueba el flujo de auth desde Swagger:

```
POST /auth/login  →  { accessToken, refreshToken, privileges[] }
```

La petición entra por el gateway, que valida y la reenvía a `auth-service` vía Redis.

---

## Comandos útiles

| Comando | Qué hace |
|---|---|
| `pnpm infra:up` | Levanta postgres + redis (docker compose). |
| `pnpm infra:down` | Detiene la infraestructura. |
| `pnpm dev:core` | Apps core (gateway + auth/contracts/workflow + web-shell + solicitudes/flujo MF). |
| `pnpm dev` | Todas las apps. |
| `pnpm build` | Build de todo el monorepo (Turborepo). |
| `pnpm lint` | Lint con Biome. |
| `pnpm db:migrate` / `pnpm db:seed` | Migraciones y seed. |

Para correr una sola app: `pnpm --filter <nombre-app> dev`
(p.ej. `pnpm --filter gateway dev`, `pnpm --filter solicitudes-mf dev`).

---

## Solución de problemas

- **`prepare: .git can't be found`:** asegúrate de ejecutar `pnpm install` desde la raíz `ALETHEIA/` (no desde una subcarpeta).
- **El gateway no responde / timeouts 503-504:** revisa que Redis esté arriba (`docker ps`) y que `REDIS_URL` sea correcta; el gateway devuelve `503/504` cuando no alcanza a un microservicio.
- **Errores de Prisma por schema inexistente:** corre `pnpm db:migrate`; cada servicio crea su propio schema (`multiSchema`).
- **Puerto ocupado:** libera `3000` (gateway), `4000` (web-shell), `5432` (postgres) o `6379` (redis).
