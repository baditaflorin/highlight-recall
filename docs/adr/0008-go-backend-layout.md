# 0008 - Go Backend Layout

## Status

Accepted

## Context

The prompt defines Go backend layout for Modes B and C.

## Decision

Skip Go backend scaffolding in Mode A. There is no `cmd`, `internal`, `pkg`, `api`, `configs`, or runtime server in v1.

## Consequences

The repository remains smaller and the public attack surface stays static.

## Alternatives Considered

A Go CLI importer was rejected because browser import is the core value proposition.
