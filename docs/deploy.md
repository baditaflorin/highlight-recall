# Deploy

## Live URL

https://baditaflorin.github.io/highlight-recall/

## Publishing Strategy

GitHub Pages serves `main` branch `/docs`.

Build locally:

```bash
make build
git add docs package.json package-lock.json src public
git commit -m "build: publish pages assets"
git push origin main
```

GitHub Pages configuration:

- Source branch: `main`
- Source folder: `/docs`
- Base path: `/highlight-recall/`
- SPA fallback: `docs/404.html`

## Rollback

Revert the commit that changed `docs/`, then push `main`.

```bash
git revert <commit>
git push origin main
```

## Custom Domain

No custom domain is configured in v1. To add one, create `docs/CNAME` with the domain and point DNS to GitHub Pages per:

https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

## Pages Gotchas

- GitHub Pages does not support `_headers` or `_redirects`.
- The service worker scope must remain `/highlight-recall/`.
- Built asset URLs must include `/highlight-recall/`.
- `docs/` must stay tracked.
