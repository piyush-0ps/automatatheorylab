# Contributing

## Before opening a change

Run the local quality gates:

```bash
npm run check
npm run build
```

Keep pure machine models and algorithms in `src/domain`. React UI belongs in `src/components`, browser drawing operations belong in `src/rendering`, and application-wide composition belongs in `src/app`.

Add unit and component tests to `src/tests` using `*.test.ts` or `*.test.tsx`. Reserve root-level `tests/e2e` for complete browser workflows.
