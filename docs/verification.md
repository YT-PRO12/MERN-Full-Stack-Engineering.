# Verification — 25 October 2026

This records actual local execution, not a GitHub CI badge or deployment claim.

| Check                        | Result                                                                      |
| ---------------------------- | --------------------------------------------------------------------------- |
| Node.js runtime              | 24.22.1                                                                     |
| `npm run lint`               | Passed                                                                      |
| `npm run format:check`       | Passed                                                                      |
| `npm run test:node`          | 19 tests passed against real disposable MongoDB processes                   |
| `npm run test:react`         | 9 component/hook/routing tests passed                                       |
| `npm run build`              | All 3 Vite applications built                                               |
| `npm run test:e2e`           | 3 browser tests passed                                                      |
| Desktop/mobile screenshots   | Captured from the seeded running app; visually inspected                    |
| `npm audit --omit=dev`       | Blocked: registry advisory endpoint returned HTTP 503; no clean-audit claim |
| GitHub CI, PR and deployment | Not yet run/published; repository creation requires account access          |

Browser coverage includes the six-item seeded marketplace, registration, creation, editing, reservation, sale, terminal-state UI, logout/session protection, mobile filtering, empty search results, and horizontal overflow at 390px width.

The normal Playwright browser download returned invalid archives in this execution environment. Browser tests were therefore run using Chromium 153 from the npm-distributed `@sparticuz/chromium` package, with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` pointing to that local executable. This optional override is supported by the test config; it is not required for ordinary installs or CI. The repository does not depend on that fallback package. The standard CI browser-install path still needs a GitHub run.

MongoDB initially failed when creating a Unix socket in the restricted execution environment. Disposable servers now explicitly use loopback TCP without a Unix socket; all database tests then ran successfully. A validation test was changed to assert the error type rather than unstable wording. A browser test uses the status combobox's accessible role/name to select it reliably.

Screenshots can be refreshed by setting `CAPTURE_SCREENSHOTS=1` while running the browser suite. The images show synthetic data and illustrative category artwork. They do not imply a live hosted service.
