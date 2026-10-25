# Testing and delivery

Run commands from the repository root after `npm ci`.

| Command                | Scope                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| `npm run lint`         | JavaScript/JSX and hook correctness                                                               |
| `npm run format:check` | Consistent formatting                                                                             |
| `npm run test:node`    | Inventory, products API, MongoDB stock races, CampusHub session/authorization/lifecycle contracts |
| `npm run test:react`   | UI behavior and mocked exchange-rate failure paths                                                |
| `npm run build`        | All three Vite applications                                                                       |
| `npm run test:e2e`     | Registration through sale/logout, plus mobile search/empty state                                  |

Install the browser first: `npx playwright install chromium --only-shell`. Linux CI also installs browser system dependencies. The test config launches a fresh disposable demo and stops it afterwards. Stop any existing demo using the same ports before running it.

Database tests run a real local mongod with isolated temporary data. First use downloads its binary. They do not use `MONGODB_URI` or touch application databases. The temporary server disables its Unix socket and binds TCP to loopback; this keeps it portable in environments where `/tmp` socket creation is restricted.

`docs/verification.md` records results from the implementation session. A workflow file is not evidence of a completed CI run.

For an already-installed compatible Chromium, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its executable. Set `CAPTURE_SCREENSHOTS=1` during the browser suite to refresh the two marketplace screenshots.

## Deployment requirements

A hosted service needs HTTPS, a same-origin reverse proxy for `/api`, a private authenticated MongoDB deployment, environment configuration, index creation, and a reviewed backup/restore process. Serve the Vite build as static files with SPA fallback. Forward `/api` before that fallback. The Node API binds to loopback for a same-host proxy; a container deployment would need a deliberate bind-address change and private networking.

Set production mode and exact HTTPS `CLIENT_ORIGIN`. Configure trusted proxies explicitly if needed; never trust arbitrary forwarded client IP headers. Replace per-process rate limiting before horizontal scaling. Transactions are not currently used; adding multi-document transactions requires an appropriate replica-set/sharded MongoDB deployment.

Docker Compose here supplies a loopback-only local database, not production infrastructure. No paid services or deployments are provisioned.
