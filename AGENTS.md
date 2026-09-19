# Agent Engineering Guide

This file defines the repository-wide expectations for human and AI contributors. Its responsibility is to keep changes correct, understandable, testable, accessible, and consistent as Automata Theory Lab grows.

## Product and stack

Automata Theory Lab is a React and TypeScript web application for creating, simulating, and testing formal machines. The current toolchain is Vite, strict TypeScript, Oxlint, Prettier, Vitest, Testing Library, and Playwright. Use npm and preserve `package-lock.json`.

Before changing code, read `README.md`, `docs/architecture.md`, `src/README.md`, and the closest applicable `AGENTS.md`. More specific instructions override this file.

## Engineering priorities

Use this order when tradeoffs are necessary:

1. Correct formal behavior and preservation of user data.
2. Clear, maintainable, and testable design.
3. Accessibility and safe behavior.
4. Good user experience and useful error reporting.
5. Measured performance.
6. Delivery speed.

Do not sacrifice correctness or clarity for cleverness. Apply SOLID ideas where they improve the design, but do not add abstractions merely to demonstrate a principle. Prefer high cohesion, low coupling, KISS, and YAGNI. Remove proven duplication, but do not generalize code until a stable common concept exists.

## Working method

- Inspect the relevant code, tests, documentation, and current Git state before editing.
- Resolve the root cause. Do not hide errors with type assertions, lint suppressions, empty catches, arbitrary delays, or weakened tests.
- Make the smallest coherent change that fully satisfies the requirement. Do not reformat or refactor unrelated code.
- Preserve public behavior unless the task explicitly changes it. Call out migrations or compatibility breaks.
- Prefer existing platform and repository capabilities. Add a dependency only when it provides clear value that would be expensive or risky to implement locally; document the reason and assess maintenance, license, size, and security impact.
- Never commit secrets, credentials, private user data, generated build output, coverage output, or local environment files.
- Update tests and documentation in the same change as the behavior they describe.
- Do not mark work complete until the relevant verification commands have passed, or clearly report why they could not run.

## Architecture and modularity

Follow the dependency direction documented in `docs/architecture.md`:

```text
app -> features -> domain
 |         |          |
 +---------+----------+-> shared
```

- `src/domain/` owns framework-independent machine definitions, validation, algorithms, and execution traces. It must not import React, DOM APIs, storage APIs, or feature modules.
- `src/features/` owns complete user capabilities such as machine building, simulation, test execution, and the machine library. A feature may use `domain` and `shared`; features must not reach into another feature's internals.
- `src/app/` owns composition, routing, application-level providers, and global error boundaries. It must not contain automata algorithms.
- `src/shared/` contains genuinely reusable UI, utilities, types, styles, and assets. Do not move feature-specific code into `shared` to avoid making a design decision.
- Keep related implementation, tests, and styles close together. Expose a small intentional module API and keep implementation details private.
- Give each module one clear responsibility. Split a module when it has multiple reasons to change, not because it crossed an arbitrary line count.
- Prefer composition and pure functions over inheritance. Keep I/O at the edges and pass dependencies into domain operations when needed.
- Avoid circular dependencies and deep imports across module boundaries. Do not create broad barrel files that hide cycles or make tree-shaking and ownership unclear.

## Automata-domain correctness

- Encode domain concepts explicitly. Do not use UI labels as state identity; give states and transitions stable IDs.
- Keep display symbols distinct from semantic values such as epsilon, blank tape symbols, stack-bottom markers, and an absent transition.
- Model different machine kinds and execution outcomes with discriminated unions. Use exhaustive handling so adding a machine kind cannot silently fall through.
- Make validation separate from execution. Invalid definitions must produce actionable validation results instead of partially running.
- Keep transition and simulation functions deterministic for the same inputs. When several paths are possible, define a stable traversal order so traces and tests are reproducible.
- Treat machine definitions and execution snapshots as immutable values. A trace step must not change when later steps execute.
- Guard potentially unbounded computations. NFA epsilon closure must track visited states; PDA and Turing machine execution must support step/configuration limits and cancellation. Never freeze the browser while attempting to prove non-termination.
- Document algorithm invariants, termination conditions, complexity that affects product behavior, and any deliberate deviation from the formal definition being implemented.
- Add focused tests from the formal semantics, including empty input, missing transitions, epsilon cycles, nondeterminism, rejection, acceptance, invalid definitions, and configured execution limits where applicable.

## TypeScript standards

- Keep strict compiler settings enabled. Do not introduce `any`. Use `unknown` at untrusted boundaries and narrow it with runtime validation.
- Prefer types that make invalid states unrepresentable: discriminated unions, literal types, readonly fields, and precise result types.
- Give exported functions and hooks explicit return types. Allow inference for obvious local values.
- Avoid type assertions and the non-null assertion operator. If one is unavoidable after a runtime invariant is established, keep its scope small and document why it is safe.
- Prefer `type` for unions and data shapes; use `interface` when declaration merging or an explicitly extensible object contract is required. Do not prefix interfaces with `I`.
- Prefer string literal unions over enums for serialized domain values unless an enum provides a concrete benefit.
- Use `null` only when it is a meaningful domain value; otherwise prefer absence through `undefined`. Do not mix both for the same concept.
- Use exhaustive `switch` handling with `never` for closed domain unions.
- Use named constants for meaningful limits and domain values. Do not leave unexplained magic numbers or strings in algorithms.
- Validate data loaded from files, URLs, local storage, or future APIs before treating it as a domain type. Compile-time types do not validate runtime data.

## React standards

- Keep components pure: rendering must not mutate props, state, context, domain models, or external values.
- Store the minimum state required. Derive values during rendering instead of duplicating them in state.
- Use effects only to synchronize with an external system. Put user-triggered work in event handlers and pure transformations in functions.
- Follow the Rules of Hooks. Put reusable stateful behavior in focused custom hooks; keep pure domain logic out of hooks.
- Keep components focused on one UI responsibility. Extract components when doing so gives the extracted unit a clear name, contract, or reuse/testing benefit.
- Prefer controlled, explicit data flow. Do not introduce global state until state is genuinely shared across distant features and simpler ownership is insufficient.
- Use stable semantic keys. Never use an array index as a key for an editable or reorderable collection.
- Do not add memoization by default. Measure first, then use memoization for demonstrated expensive work or referential stability that a dependency contract requires.
- Provide loading, empty, error, and recovery states for asynchronous workflows. Errors shown to users must explain what happened and what they can do next.

## Naming and file conventions

- Use `PascalCase` for React components, component files, classes, and exported types.
- Use `camelCase` for variables, functions, parameters, and object properties.
- Prefix hooks with `use`, event handlers with `handle`, and callback props with `on`.
- Name booleans as questions, such as `isRunning`, `hasFinalState`, `canStep`, or `shouldPersist`.
- Use `UPPER_SNAKE_CASE` only for true module-level constants that never vary at runtime.
- Use `kebab-case` for non-component source filenames and directories. Test names mirror their source, for example `execute-machine.test.ts`.
- Choose domain language over generic words. Avoid vague names such as `data`, `item`, `manager`, `helper`, `utils`, or `process` when a precise name exists.
- Include units in names when ambiguity is possible, such as `timeoutMs`, `stepCount`, or `tapeIndex`.
- Functions should use verbs and describe one observable operation. Types and components should use nouns.

## Documentation and comments

Every new human-authored file must begin with a short file-level documentation header that states why the file exists, its primary responsibility, and any important boundary. Keep it accurate when the file changes.

Use the format supported by the file type:

- TypeScript/TSX: a leading `/** @file ... */` JSDoc block before imports.
- CSS: a leading `/** ... */` block comment.
- HTML: a leading `<!-- ... -->` comment before the document element.
- YAML and shell: leading `#` comments, after a required shebang when present.
- Markdown: one `#` title followed by an opening responsibility/purpose paragraph.

JSON, lockfiles, generated files, vendored code, snapshots, binary assets, and empty directory markers are exempt because comments are invalid or the content is machine-owned. Document non-obvious JSON configuration in the nearest relevant Markdown file.

- Write JSDoc for exported domain functions, hooks, reusable components, and public types when their contract, invariants, side effects, errors, or units are not obvious from the signature.
- Comments explain why, constraints, invariants, or surprising tradeoffs. Do not narrate syntax or restate a good name.
- Use examples for complex formal behavior when they communicate the contract more clearly than prose.
- Keep TODOs actionable and attributable to a concrete issue or follow-up. Do not use TODOs to excuse incomplete correctness.
- Update or delete stale comments immediately when behavior changes.
- Keep user-facing documentation task-oriented and keep architectural documentation focused on decisions and boundaries.

## Accessibility and interaction

- Target WCAG 2.2 AA for user-facing interfaces.
- Use semantic HTML before ARIA. Every control needs an accessible name and correct keyboard behavior.
- Ensure all actions work without a pointer. Keep focus visible, use a logical focus order, and move focus deliberately after dialogs or major context changes.
- Do not communicate meaning by color alone. Maintain sufficient contrast and support zoom, reflow, reduced motion, and common viewport sizes.
- Announce dynamic simulation status and validation feedback appropriately without creating noisy live regions.
- The visual graph editor must have an equivalent accessible way to inspect and edit states and transitions, such as a structured list or form. Canvas- or pointer-only editing is not acceptable.
- Prefer Testing Library and Playwright role/name locators; inaccessible markup should not be worked around with test IDs unless no semantic query fits.

## Testing strategy

- Test observable behavior and contracts, not private implementation details.
- Add unit tests for domain models, validators, and algorithms. These tests should be fast, deterministic, and independent of React.
- Add component tests for rendering, accessibility, and user interaction. Interact through `userEvent` and query by role, accessible name, label, or visible text.
- Add Playwright tests for critical end-to-end journeys, not every component permutation. Keep each test isolated and in control of its data.
- For each bug fix, add a regression test that fails for the original bug when practical.
- Cover success, rejection/failure, boundary, and malformed-input paths. Do not chase coverage percentages with assertions that prove nothing.
- Avoid snapshots for behavior-rich UI. Use focused assertions that communicate the expected contract.
- Do not use arbitrary timeouts or sleeps. Await visible states, events, or supported locator conditions.
- Never weaken or delete a test solely to make a change pass. If behavior intentionally changes, update the test and explain the new contract.

## Security and data handling

- Treat imported machine files, URL values, browser storage, and future API responses as untrusted input. Validate syntax, shape, size, ranges, and allowed values before use.
- Never place secrets in `VITE_*` variables; Vite exposes them to the browser. Client-side code cannot protect a secret.
- Do not use `eval`, `Function`, unsafe URL schemes, or executable expressions from machine input.
- Avoid `dangerouslySetInnerHTML`. If a future requirement genuinely needs HTML input, use a reviewed sanitization boundary and test it.
- Encode output in the context where it is used and rely on React's normal escaping for rendered text.
- Limit imported file sizes and simulation resources to reduce denial-of-service risk. Fail safely with a useful message.
- Do not log sensitive or excessive user data. Errors should retain diagnostic context without exposing private content.
- Keep dependencies minimal and maintained. Review security advisories and lockfile changes when dependencies change.

## Styling and user experience

- Reuse shared design tokens for color, spacing, typography, elevation, and motion once established. Do not scatter near-duplicate literal values.
- Keep feature styles close to the owning component and avoid global selectors except for deliberate application-level defaults.
- Build responsive layouts from small viewports upward. Prevent graph/editor controls from becoming unreachable at narrow sizes.
- Preserve user work across recoverable errors where possible. Confirm destructive actions when recovery is difficult.
- Use concise domain terminology consistently and explain formal terms where a learner may not know them.

## Performance

- Correctness and clarity come before micro-optimization. Establish a measurement or realistic workload before optimizing.
- Keep expensive simulation work out of React render paths. Use incremental execution, cancellation, and, when measurements justify it, a Web Worker.
- Avoid repeated traversal or copying of large graphs when an indexed representation or bounded memoization has demonstrated value.
- Check bundle impact before adding large UI or graph libraries. Load feature-heavy code lazily when it materially improves startup.
- Preserve deterministic behavior when optimizing algorithms.

## Verification and definition of done

Run the narrowest relevant tests while developing. Before completion, run:

```bash
npm run check
npm run build
```

Also run `npm run test:e2e` when a critical browser workflow changes and the required Playwright browser is installed.

A change is complete only when:

- The requested behavior and acceptance criteria are satisfied.
- Architecture and dependency boundaries remain intact.
- New and changed behavior has meaningful tests.
- File headers and public documentation are accurate.
- Accessibility, security, error, and edge cases were considered.
- Formatting, linting, type checking, tests, and the production build pass.
- No unrelated changes, debug output, dead code, or unexplained suppressions remain.

## Code review rules

Reviews must prioritize findings over summaries. Report issues in severity order with file and line references.

Flag changes that introduce:

- Incorrect automata semantics, unstable traces, accidental mutation, or non-terminating browser work.
- Invalid states that the type model could prevent or unvalidated data crossing a trust boundary.
- Broken keyboard access, missing accessible names, focus loss, or color-only meaning.
- Effects used for derived state, hidden feature coupling, circular dependencies, or domain logic inside components.
- Security regressions, exposed secrets, unsafe HTML/evaluation, or unbounded imported input.
- Missing regression/edge-case tests, tests coupled to implementation details, or arbitrary sleeps.
- Missing/stale file documentation, misleading comments, vague names, or unnecessary abstractions/dependencies.
- Changes that bypass quality gates with suppressions instead of addressing the cause.

## Basis for these rules

These repository rules are informed by the primary guidance below. Apply the concrete rules in this file; consult the sources when a design decision needs more context.

- [OpenAI: Custom instructions with AGENTS.md](https://developers.openai.com/codex/guides/agents-md)
- [React: Keeping Components Pure](https://react.dev/learn/keeping-components-pure)
- [React: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [TypeScript: Narrowing and Exhaustiveness](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [Testing Library: About Queries](https://testing-library.com/docs/queries/about/)
- [Playwright: Best Practices](https://playwright.dev/docs/best-practices)
- [W3C: How to Meet WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/)
- [OWASP: Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
