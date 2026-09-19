# Source architecture

The application uses global responsibility-based directories:

- `app/` composes the application, routes, and global providers.
- `components/` contains React components from every application area.
- `domain/` contains framework-independent automata models and algorithms.
- `hooks/` coordinates reusable React state and application workflows.
- `rendering/` contains browser rendering operations that are independent of React.
- `styles/` contains global and component-specific stylesheets.
- `tests/` contains unit tests, component tests, and shared test setup.

New functionality should be placed in the matching global directory instead of
creating the same directory structure inside each feature. Keep automata
execution rules in `domain/`, not inside React components, so machine behavior
can be tested without rendering the UI.
