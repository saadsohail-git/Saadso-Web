# saadso.com

Personal website for Muhammad Saad Sohail.

## Structure

- `index.html` — Home page
- `about.html` — About page
- `assets/` — Brand assets (favicon, symbol SVGs)

## Deployment

Static site served via nginx on a Hetzner VPS. Sync files with:

```bash
rsync -avz --exclude='.git' --exclude='.claude' --exclude='.github' \
  -e "ssh -i ~/.ssh/hetzner_key" ./ root@77.42.90.166:/var/www/html/
```
