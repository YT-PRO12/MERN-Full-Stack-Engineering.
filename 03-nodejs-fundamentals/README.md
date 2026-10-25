# Node.js: inventory summary

Run `node 03-nodejs-fundamentals/inventory.js` from the root, or append a JSON filepath. No dependencies or environment variables are required beyond Node.js 24.

The module reads a file asynchronously, parses JSON, and summarizes count/value by category using a `Map`. A Map also handles keys such as `__proto__` without object-prototype collisions. Errors go to stderr and set a nonzero process exit code. File reads are promise-based; no synchronous I/O blocks the main event loop.

The main-module check lets tests import functions without running the CLI. `loadInventory` handles I/O, while `summarize` is a pure function. The sample file uses synthetic data and integer rupees.

Run `node --test 03-nodejs-fundamentals/inventory.test.js`. Try adding a `--category` option; test a missing file, invalid JSON, an empty inventory, and an unknown category. For large datasets, compare whole-file loading with a streaming JSON-lines design before claiming a performance improvement.

Environment validation and graceful signal shutdown are demonstrated in CampusHub's `api/src/server.js`, where a database connection must be ready before the HTTP server starts.
