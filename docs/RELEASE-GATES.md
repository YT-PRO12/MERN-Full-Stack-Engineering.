# MERN release gates

This repository is an engineering showcase, not a claim of production deployment. Before labeling a change ready to merge, review these gates with the commands in the root `package.json`.

## Automated local gates

| Gate               | Command                | What it covers                                 |
| ------------------ | ---------------------- | ---------------------------------------------- |
| Dependency install | `npm ci`               | Lockfile-resolved workspace dependencies       |
| Lint               | `npm run lint`         | Static JavaScript, React and hooks checks      |
| Format             | `npm run format:check` | Formatting drift                               |
| Node tests         | `npm run test:node`    | API, inventory, session and database contracts |
| React tests        | `npm run test:react`   | Component behavior and error paths             |
| Build              | `npm run build`        | Vite application bundles                       |
| Browser            | `npm run test:e2e`     | End-to-end workflows in disposable local demo  |

Run with the Node major version specified in `package.json`. The browser test requires the documented Playwright Chromium install. MongoDB test infrastructure may download an isolated binary on first use.

## Manual acceptance

- Validate desktop and mobile layouts, keyboard access, loading, empty and error states.
- Confirm server-owned authorization is enforced for every protected action.
- Check that no environment secrets, database dumps, or sensitive screenshots enter a commit.
- Verify migration/index compatibility, backups and recovery before deploying a persistent database.
- Capture actual command outputs and hosted checks; do not treat a workflow definition as a passing run.

## Claims boundary

A merged pull request, passing mocked tests, and a successful local build **do not prove** live deployment, uptime, scale or end-user acceptance.

See [testing matrix](testing-matrix.md) and [testing and delivery](../07-testing-and-delivery/README.md).
