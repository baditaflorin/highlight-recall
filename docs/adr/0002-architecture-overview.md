# 0002 - Architecture Overview

## Status

Accepted

## Context

The app needs import, storage, review, search, and optional local AI while remaining static on GitHub Pages.

## Decision

Use feature folders for UI workflows and domain folders for reusable logic. `src/importers` parses files, `src/storage` owns IndexedDB, `src/domain` owns types and scheduling, `src/search` owns lexical indexing, and `src/ai` owns lazy local AI modules.

## Consequences

The runtime has clear browser-only boundaries. Heavy modules stay off the first load path. Tests can focus on domain logic without booting the UI.

## Alternatives Considered

A monolithic app file was rejected because import, review, and search change at different speeds.
