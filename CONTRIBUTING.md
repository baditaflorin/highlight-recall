# Contributing

Thanks for helping improve Highlight Recall.

## Local Setup

```bash
npm install
make install-hooks
make dev
```

## Checks

Run these before pushing:

```bash
make lint
make test
make build
make smoke
```

Commits must use Conventional Commits, for example `feat: add epub import status`.

## Rules

- Do not commit secrets, `.env` files, private keys, or local browser exports containing personal reading data.
- Keep the app Mode A unless an ADR justifies a different deployment mode.
- Heavy parsing and AI dependencies must stay lazy-loaded.
- User data must remain local by default.
