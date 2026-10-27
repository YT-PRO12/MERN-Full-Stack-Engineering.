# Local troubleshooting

Use Node.js 24 and install the root workspaces with `npm ci` before starting any project.

## The demo does not start

- Check that ports 4000 and 5173 are free; stop an earlier instance before retrying.
- Run `npm run demo` from the repository root.
- The first run may need network access to download a disposable MongoDB binary.
- Do not point the demo or tests at a personal or production database.

## A test cannot connect to MongoDB

The node test suite uses `mongodb-memory-server`. Check network availability for the initial binary download and local filesystem permissions. Inspect the actual error before assuming an application defect.

## React pages render but API requests fail

The Vite frontend expects its development API proxy or the matching backend. Start the paired services through the root scripts, and verify the configured origin. Mutations must supply an allowed Origin header.

## Browser tests fail on first run

Run `npx playwright install chromium --only-shell`, then `npm run test:e2e`. Keep the demo's ports free; Playwright starts its own isolated demo.

See [verification notes](verification.md) for dated, previously observed checks; those results do not guarantee a fresh local run.
