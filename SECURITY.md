# Security Policy

## Supported Versions

The latest tagged release is supported.

## Reporting A Vulnerability

Please report security issues to:

florinbadita@gmail.com

Do not open a public issue for vulnerabilities that expose user data.

## Baseline

- No runtime backend.
- No frontend secrets.
- No analytics.
- Gitleaks runs in the local pre-commit hook.
- User files and highlights stay in the browser profile unless the user exports JSON manually.
