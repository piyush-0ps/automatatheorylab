# Contributing

## Before opening a change

Run the local quality gates:

```bash
npm run check
npm run build
```

Keep pure machine models and algorithms in `src/domain`. UI workflows belong in `src/features`, while application-wide composition belongs in `src/app`.

Add tests beside the code they cover using `*.test.ts` or `*.test.tsx`. Reserve `tests/e2e` for complete browser workflows.
