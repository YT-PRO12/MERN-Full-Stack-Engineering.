# React fundamentals: daily plan

A small task list makes state changes visible without a backend. It covers JSX, component composition, props, controlled input, form events, list rendering, and immutable updates.

From the root, run `npm ci`, then `npm run dev:fundamentals`. Open http://localhost:5174. No environment variables are needed.

`src/App.jsx` owns the list. Its `Task` child receives one task and a callback. Submitting the form adds an object with a stable UUID; toggling maps to a new array and replaces only the changed task. Completion count is derived rather than stored twice.

Empty input is rejected. Labels and native checkboxes support keyboard use. Refreshing resets state intentionally; nothing is persisted.

Test: `npx vitest run 01-react-fundamentals/src/App.test.jsx`. The test adds and completes a task using the rendered form and checks blank-input feedback.

Try adding a completed-only filter without changing the source array. Then add a test that toggles a task twice. For persistence, decide how to handle malformed localStorage data before implementing it.
