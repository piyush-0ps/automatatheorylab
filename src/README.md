# Source architecture

The application uses feature-oriented boundaries:

- `app/` composes the application, routes, and global providers.
- `domain/` contains framework-independent automata models and algorithms.
- `features/` contains user-facing capabilities. A feature may use `domain` and `shared`, but features should not depend directly on one another.
- `shared/` contains reusable UI, utilities, constants, and cross-cutting types with no feature-specific behavior.
- `test/` contains test setup and reusable test helpers.

Keep automata execution rules in `domain/`, not inside React components. This allows DFA, NFA, PDA, and Turing machine behavior to be tested without rendering the UI.
