# Automata Theory Lab

A web application for creating, simulating, and testing machines from automata theory.

## Technology

- React for the user interface
- TypeScript for typed machine definitions and simulation logic
- Vite for local development and production builds
- Vitest and Testing Library for unit/component tests
- Playwright for browser-level tests

## Getting started

Requirements: Node.js 24+ and npm 11+.

```bash
npm install
npm run dev
```

## Commands

| Command            | Purpose                                             |
| ------------------ | --------------------------------------------------- |
| `npm run dev`      | Start the development server                        |
| `npm run build`    | Type-check and create a production build            |
| `npm run check`    | Run formatting, linting, type, and unit-test checks |
| `npm test`         | Run unit/component tests once                       |
| `npm run test:e2e` | Run Playwright browser tests                        |

See [docs/architecture.md](docs/architecture.md) for source boundaries and dependency rules.
