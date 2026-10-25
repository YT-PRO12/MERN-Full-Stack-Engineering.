# Contributing

Use Node.js 24 and `npm ci` from the root. Keep each change scoped to one behavior and follow the existing JavaScript/function-component conventions.

Run `npm run format`, `npm run lint`, the relevant tests, and affected builds. For changes across UI/API boundaries, run the browser workflow too. Use synthetic data and disposable test databases.

Commit messages follow `<type>(<scope>): <specific action>`, such as `fix(listings): reject stale owner edits`. Describe the problem, implementation, actual checks and limitations in the PR. Do not mark unrun tests as passing. Avoid unrelated lockfile changes, generated build output, real credentials, and unnecessary abstractions.

Keep examples explainable. Comments should clarify invariants and tradeoffs, not restate each line. Document imported/adapted source and preserve its attribution. Keep roadmap ideas separate from implemented features.
