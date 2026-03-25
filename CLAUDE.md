# saadso.com — CLAUDE.md

## Project Overview
Personal website for saadso.com. Nuxt 3 SSR app (not statically generated). Deployed on a Hetzner VPS via GitHub Actions CI/CD. PM2 manages the Node.js process; nginx reverse-proxies from 443 → 3000.

## Stack
- **Framework**: Nuxt 3 (SSR mode — `nuxt build`, not `nuxt generate`)
- **Styling**: Scoped `<style>` per component + global `app/assets/css/common.css`
- **Fonts**: Cormorant Garamond (headings), Geist Mono (body/code), Amiri (Arabic) — loaded from Google Fonts
- **Markdown rendering**: `marked` (client-side, in admin preview and blog post pages)
- **Content module**: `@nuxt/content` is installed but **do not use `queryCollection`** for blog or links — it reads from a stale SQLite DB built at startup and won't reflect runtime writes. Use the custom API routes instead.
- **Database**: PostgreSQL — used for zikr entries. Connection via `server/utils/db.ts` singleton. Migration runs via `server/plugins/migrate.ts` at startup.
- **Process manager**: PM2 (`pm2 restart saadso`)
- **Reverse proxy**: nginx on VPS

## Design System
- **Theme**: Light mode default. CSS variables toggle via `:root.dark` class on `<html>`.
- **Colors** (light): `--bg: #f5f2fa`, `--ink: #1a1528`, `--muted: #8a80a0`, `--lilac: #7b6aa0`
- **Colors** (dark): `--bg: #0c0917`, `--ink: #ede8fb`, `--muted: #5c5278`, `--lilac: #b8a9d9`
- **Lilac** is the accent color used for highlights, borders, and interactive elements
- `--lilac-border` and `--lilac-dim` are used for subtle borders and backgrounds
- **Theme toggle**: stored in `localStorage('theme')`, applied before hydration via inline script in `nuxt.config.ts` head
- **Noise overlay**: subtle SVG fractal noise applied via `body::before` in common.css
- **Animations**: `fadeUp` keyframe, elements animate in with `opacity: 0 → 1` + `translateY`

## Auth
- **Admin password**: `sui` — set via `ADMIN_PASSWORD` env var (in `.env` locally, GitHub secret on VPS)
- `runtimeConfig.adminPassword` defaults to `'sui'` if env var not set
- Auth endpoint: `POST /api/auth` — returns `{ ok: true }` or 401
- Password is entered once at the gate and reused for subsequent publish/delete operations

## Pages
| Route | File | Notes |
|-------|------|-------|
| `/` | `app/pages/index.vue` | Home |
| `/about` | `app/pages/about.vue` | |
| `/blog` | `app/pages/blog/index.vue` | Fetches from `GET /api/blog` |
| `/blog/[slug]` | `app/pages/blog/[...slug].vue` | Fetches from `GET /api/blog/[slug]`, renders with `marked` |
| `/links` | `app/pages/links.vue` | Canvas markdown editor, reads/writes `content/links.md` |
| `/admin` | `app/pages/admin.vue` | Password-gated blog CMS |
| `/arabic` | `app/pages/arabic.vue` | Zikr viewer — not in navbar, accessible at /arabic |
| `/api-docs` | `app/pages/api-docs.vue` | API documentation — not in navbar |

## API Routes (`server/api/`)
| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| `POST` | `/api/auth` | — | Verify password |
| `GET` | `/api/blog` | — | List all posts (reads `.md` files from disk) |
| `POST` | `/api/blog` | ✓ | Publish/update a post |
| `DELETE` | `/api/blog` | ✓ | Delete a post |
| `GET` | `/api/blog/[slug]` | — | Fetch single post (frontmatter + body) |
| `GET` | `/api/links` | — | Read `content/links.md` |
| `POST` | `/api/links` | ✓ | Write `content/links.md` |
| `GET` | `/api/zikr` | — | List zikr entries (from Postgres) |
| `POST` | `/api/zikr` | ✓ | Save or delete a zikr entry |
| `POST` | `/api/zikr/upload` | ✓ | Upload image, returns `/uploads/zikr/...` URL |
| `GET` | `/api/sitemap` | — | JSON list of all API routes |

## Content & Data Storage
| Feature | Storage | Location |
|---------|---------|----------|
| Blog posts | Markdown files | `content/blog/*.md` |
| Links canvas | Markdown file | `content/links.md` |
| Zikr entries | PostgreSQL | `zikr_entries` table |
| Uploaded images | Disk (nginx-served) | `/var/www/saadso-uploads/zikr/` on VPS, `/uploads/zikr/` URL |

- Blog posts frontmatter: `title`, `description`, `date`, `tags`
- **Never use `@nuxt/content`'s `queryCollection`** — always use the API routes which read from disk directly

## Database (PostgreSQL)
- Connection utility: `server/utils/db.ts` — call `getDb()` to get the `postgres` client
- Migration plugin: `server/plugins/migrate.ts` — creates tables at startup if they don't exist
- Schema: `zikr_entries (id TEXT PK, arabic TEXT, translation TEXT, image_url TEXT, sort_order INT, created_at TIMESTAMPTZ)`
- Env var: `DATABASE_URL` — format `postgres://user:pass@localhost:5432/dbname`
- On VPS: Postgres installed via apt, DB/user created by deploy script

## Image Uploads
- Dev: files written to `{cwd}/public/uploads/zikr/` (served by Nuxt dev server at `/uploads/`)
- Production: files written to `/var/www/saadso-uploads/zikr/` (served by nginx at `/uploads/`)
- The `/uploads/` nginx location block is added automatically by the deploy script

## Deployment
- **VPS**: `77.42.90.166` (Hetzner), SSH key at `~/.ssh/hetzner_key`
- **Deploy path**: `/var/www/saadso/`
- **Uploads path**: `/var/www/saadso-uploads/` (separate from app, never wiped)
- **CI/CD**: GitHub Actions (`.github/workflows/deploy.yml`) — triggers on push to `main`
  - Builds with `npx nuxt build`
  - rsyncs `.output/` to VPS (excludes `content/blog` to preserve server-created posts)
  - rsyncs `content/` separately (additive, no delete)
  - Installs PostgreSQL, creates DB/user if needed
  - Adds nginx `/uploads/` location block if not present
  - Sets `ADMIN_PASSWORD` + `DATABASE_URL` env in `.env` on VPS
  - Restarts via `pm2 restart saadso`
- **GitHub Secrets needed**: `VPS_SSH_KEY`, `VPS_HOST`, `ADMIN_PASSWORD`, `DATABASE_URL`

## Key Conventions
- Do not commit `.data/` (nuxt/content SQLite), `dist/` symlink, or `.env`
- Blog post slugs must be URL-safe (lowercase, hyphens only)
- Slug is locked during edit (cannot be changed after publish — would break URLs)
- The `marked` library is used for rendering; no sanitization needed (admin-only content)
- All buttons use `Geist Mono`, uppercase, `letter-spacing: 0.1em` style
- Heading fonts use `Cormorant Garamond`, `font-weight: 300`
- Arabic text uses `Amiri` font with `dir="rtl"`

## Current Branch Strategy
- `main` — production
- Feature branches merged via PR (e.g. `links-canvas`)
