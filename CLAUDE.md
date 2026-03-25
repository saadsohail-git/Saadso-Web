# saadso.com — CLAUDE.md

## Project Overview
Personal website for saadso.com. Nuxt 3 SSR app (not statically generated). Deployed on a Hetzner VPS via GitHub Actions CI/CD. PM2 manages the Node.js process; nginx reverse-proxies from 443 → 3000.

## Stack
- **Framework**: Nuxt 3 (SSR mode — `nuxt build`, not `nuxt generate`)
- **Styling**: Scoped `<style>` per component + global `app/assets/css/common.css`
- **Fonts**: Cormorant Garamond (headings), Geist Mono (body/code) — loaded from Google Fonts
- **Markdown rendering**: `marked` (client-side, in admin preview and blog post pages)
- **Content module**: `@nuxt/content` is installed but **do not use `queryCollection`** for blog or links — it reads from a stale SQLite DB built at startup and won't reflect runtime writes. Use the custom API routes instead.
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

## API Routes (`server/api/`)
| Method | Route | Purpose |
|--------|-------|---------|
| `POST` | `/api/auth` | Verify password |
| `GET` | `/api/blog` | List all posts (reads `.md` files from disk) |
| `POST` | `/api/blog` | Publish/update a post |
| `DELETE` | `/api/blog` | Delete a post |
| `GET` | `/api/blog/[slug]` | Fetch single post (frontmatter + body) |
| `GET` | `/api/links` | Read `content/links.md` |
| `POST` | `/api/links` | Write `content/links.md` (password-protected) |

## Content
- Blog posts: `content/blog/*.md` — frontmatter: `title`, `description`, `date`, `tags`
- Links canvas: `content/links.md` — free-form markdown, edited via `/links` page
- **Never use `@nuxt/content`'s `queryCollection`** for these — always use the API routes which read from disk directly

## Deployment
- **VPS**: `77.42.90.166` (Hetzner), SSH key at `~/.ssh/hetzner_key`
- **Deploy path**: `/var/www/saadso/`
- **CI/CD**: GitHub Actions (`.github/workflows/deploy.yml`) — triggers on push to `main`
  - Builds with `npx nuxt build`
  - rsyncs `.output/` to VPS (excludes `content/blog` to preserve server-created posts)
  - rsyncs `content/` separately (additive, no delete)
  - Sets `ADMIN_PASSWORD` env in `.env` on VPS
  - Restarts via `pm2 restart saadso`
- **GitHub Secrets needed**: `VPS_SSH_KEY`, `VPS_HOST`, `ADMIN_PASSWORD`

## Key Conventions
- Do not commit `.data/` (nuxt/content SQLite), `dist/` symlink, or `.env`
- Blog post slugs must be URL-safe (lowercase, hyphens only)
- Slug is locked during edit (cannot be changed after publish — would break URLs)
- The `marked` library is used for rendering; no sanitization needed (admin-only content)
- All buttons use `Geist Mono`, uppercase, `letter-spacing: 0.1em` style
- Heading fonts use `Cormorant Garamond`, `font-weight: 300`

## Current Branch Strategy
- `main` — production
- Feature branches merged via PR (e.g. `links-canvas`)
