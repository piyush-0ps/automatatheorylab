# Architecture

## Scope

This repository currently contains one browser application. A monorepo or backend should be introduced only when a concrete requirement makes either necessary.

## Dependency direction

```text
app -> features -> domain
 |         |          |
 +---------+----------+-> shared
```

`domain` is the core of the product. It should model machines, validate definitions, execute input, and produce trace data without importing React or browser APIs.

`features` turns domain capabilities into workflows such as building a machine, stepping through a simulation, and running a test suite.

`app` owns composition concerns such as routing and global providers. `shared` contains generic code that has no automata-specific business behavior.

## Initial quality gates

- Strict TypeScript checks
- Oxlint static analysis
- Prettier formatting checks
- Vitest unit/component tests
- Playwright browser tests

Architectural decisions that meaningfully constrain future work should be recorded in `docs/decisions/`.
