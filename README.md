# saadso.com

Personal website for Muhammad Saad Sohail. Built with Nuxt 3.

## Structure

- `app/pages/` — Page routes (index, about, blog, links)
- `app/components/` — Shared components (Navbar, Footer, ThemeToggle, Logo)
- `app/layouts/` — Default layout
- `app/assets/css/` — Global styles
- `public/` — Static assets (favicon, symbol SVGs)

## Development

```bash
npm install
npm run dev
```

## Deployment

Static site generated with `nuxt generate` and deployed via nginx on a Hetzner VPS. Push to `main` triggers CI/CD automatically.

blog time as well now