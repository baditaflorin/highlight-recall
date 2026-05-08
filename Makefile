.PHONY: help install-hooks dev build data test test-integration smoke lint fmt pages-preview release clean hooks-pre-commit hooks-commit-msg hooks-pre-push

help:
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "%-22s %s\n", $$1, $$2}'

install-hooks: ## Wire local git hooks
	git config core.hooksPath .githooks
	chmod +x .githooks/*

dev: ## Run the frontend dev server
	npm run dev

build: ## Build GitHub Pages-ready frontend into docs/
	npm run build
	node scripts/verify-pages.mjs

data: ## Mode A has no static data pipeline
	@echo "Mode A: user data is imported and stored locally in the browser."

test: ## Run unit tests
	npm run test

test-integration: ## No integration suite in Mode A v1
	@echo "Mode A: integration tests are covered by smoke/e2e."

smoke: ## Build, preview, and run the browser smoke test
	bash scripts/smoke.sh

lint: ## Run linters and static checks
	npm run lint
	npm run fmt:check
	npm run typecheck

fmt: ## Format code and docs
	npm run fmt

pages-preview: ## Serve docs/ locally with the same base path as GitHub Pages
	npm run preview -- --port 4173

release: ## Tag the current commit as v$$(node -p "require('./package.json').version")
	git tag "v$$(node -p "require('./package.json').version")"
	git push origin "v$$(node -p "require('./package.json').version")"

clean: ## Remove generated local artifacts but keep tracked docs source
	rm -rf docs/assets docs/index.html docs/404.html docs/manifest.webmanifest docs/sw.js docs/favicon.svg docs/app-icon.svg coverage test-results playwright-report

hooks-pre-commit:
	.githooks/pre-commit

hooks-commit-msg:
	.githooks/commit-msg .git/COMMIT_EDITMSG

hooks-pre-push:
	.githooks/pre-push
