# Architecture

## Scope

This repository currently contains one browser application. A monorepo or backend should be introduced only when a concrete requirement makes either necessary.

## Dependency direction

```text
app -> components -> rendering
 |        |
 +------> hooks ------> domain
          +-----------> domain
```

`domain` is the core of the product. It should model machines, validate definitions, execute input, and produce trace data without importing React or browser APIs.

`components` contains the React interface. `hooks` coordinates reusable interface state and workflows using domain types. `rendering` contains browser drawing operations that do not depend on React.

`app` owns composition concerns such as routing and global providers. Cross-cutting source files are organized by responsibility in top-level directories such as `styles` and `tests`.

## Initial quality gates

- Strict TypeScript checks
- Oxlint static analysis
- Prettier formatting checks
- Vitest unit/component tests
- Playwright browser tests

Architectural decisions that meaningfully constrain future work should be recorded in `docs/decisions/`.
