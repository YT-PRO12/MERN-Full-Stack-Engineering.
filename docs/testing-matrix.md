# Test coverage map

This map describes what the checked-in suites exercise, not an assertion that every test passes on every machine.

| Area | Main checks | Command |
| --- | --- | --- |
| Inventory CLI | Pure grouping, safe integer totals, input isolation | `npm run test:node` |
| Products API | Schema boundaries, creation, isolation, HTTP errors | `npm run test:node` |
| MongoDB stock lab | Unique indexes, positive-stock atomic reservation | `npm run test:node` |
| CampusHub API | Sessions, validation, ownership, state transitions, races | `npm run test:node` |
| React projects | Forms, effects, routes and navigation | `npm run test:react` |
| CampusHub web | Presentation state, pagination and listing cards | `npm run test:react` |
| End-to-end | Browser flows against an isolated database | `npm run test:e2e` |

## Running checks

Install dependencies with Node.js 24 using `npm ci`. Run `npm run format:check`, `npm run lint`, `npm test`, and `npm run build` before merging. Browser tests require a Playwright Chromium installation. Node integration tests may download MongoDB on their first run.

Review failures individually. A passing unit test does not prove internet-facing production security, scalability, or deployment readiness.
