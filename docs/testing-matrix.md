# Test coverage map

This map describes what the checked-in suites exercise, not an assertion that every test passes on every machine.

## Node.js checks

- **Inventory CLI:** Pure grouping, safe integer totals, input isolation.
- **Products API:** Schema boundaries, creation, isolation, HTTP errors.
- **MongoDB stock lab:** Unique indexes, positive-stock atomic reservation.
- **CampusHub API:** Sessions, validation, ownership, state transitions, races.

Run these checks with `npm run test:node`.

## React checks

- **React projects:** Forms, effects, routes and navigation.
- **CampusHub web:** Presentation state, pagination and listing cards.

Run these checks with `npm run test:react`.

## Browser checks

End-to-end tests cover browser flows against an isolated database. Run them with `npm run test:e2e`.

## Running checks

Install dependencies with Node.js 24 using `npm ci`. Run `npm run format:check`, `npm run lint`, `npm test`, and `npm run build` before merging. Browser tests require a Playwright Chromium installation. Node integration tests may download MongoDB on their first run.

Review failures individually. A passing unit test does not prove internet-facing production security, scalability, or deployment readiness.
