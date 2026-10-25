# MERN Full Stack Engineering

React exercises, backend labs, and a complete listing-management application. Start small, follow a request through the stack, then change something and test it.

**React · Node.js · Express · MongoDB · Mongoose · JavaScript**

![CampusHub marketplace](docs/screenshots/campushub-desktop.png)

## Start here

Use **Node.js 24** and npm. From the repository root:

```bash
npm ci
npm run demo
```

Open **http://localhost:5173**. The disposable demo starts a real local MongoDB process, seeds six synthetic listings, and serves CampusHub. Sign in with `demo@campushub.example` / `CampusDemo2026!`, or register a synthetic account. The first run downloads a MongoDB binary and needs internet access. Stopping the demo removes its temporary data. The known password is for this loopback-only demo, never a hosted account.

For persistent local data, follow the [CampusHub setup](06-full-stack-projects/campushub/README.md). No cloud account is required.

## Explore the projects

| Project                                        | What to look at                                                      | Run from the root                                     | Status                                   |
| ---------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------- |
| [Daily plan](01-react-fundamentals/)           | Props, forms, immutable state, stable keys                           | `npm run dev:fundamentals` → port 5174                | Implemented                              |
| [Currency converter](02-react-patterns/)       | Custom hook, cancellation, failure recovery, mocked tests            | `npm run dev:patterns` → port 5175                    | Implemented; live rates require internet |
| [Router lab](02-react-patterns/)               | Nested routes, URL filters, context/reducer, simulated session       | Same app, `/router`                                   | Implemented; routing exercise only       |
| [Inventory CLI](03-nodejs-fundamentals/)       | Modules, async file I/O, validation and error exits                  | `node 03-nodejs-fundamentals/inventory.js`            | Implemented                              |
| [Products API](04-express-apis/)               | Express routes, strict validation, consistent errors                 | `node 04-express-apis/app.js` → port 4100             | Implemented; intentionally in-memory     |
| [MongoDB stock lab](05-mongodb-and-mongoose/)  | Unique index, aggregation, atomic stock reservation                  | `node --test 05-mongodb-and-mongoose/catalog.test.js` | Implemented against isolated MongoDB     |
| [CampusHub](06-full-stack-projects/campushub/) | Sessions, ownership, search, pagination, guarded listing transitions | `npm run demo` → port 5173                            | Implemented locally; not deployed        |

Follow the [learning roadmap](docs/learning-roadmap.md) for the order and small extension exercises. See [testing and delivery](07-testing-and-delivery/) for what the checks prove.

## Check the work

```bash
npm run lint
npm run format:check
npm test
npm run build
npx playwright install chromium --only-shell
npm run test:e2e
```

Tests use isolated disposable databases, never your `.env` database. Browser tests start and stop their own demo; stop any existing demo on ports 4000/5173 first. CI uses the same commands. [Verification notes](docs/verification.md) distinguish local results from GitHub CI status.

## How it fits together

- `01` and `02`: React exercises and two improved project ideas from [React-Projects](https://github.com/YT-PRO12/React-Projects).
- `03` through `05`: Node, Express, and database exercises that lead into the capstone.
- `06`: CampusHub, with separate `api` and `web` packages.
- `07`: browser regression tests and delivery guidance.
- `docs`: walkthroughs, decisions, screenshots, source provenance, and limitations.

One npm workspace install keeps dependencies and commands consistent. Application code remains in its own project; there is no shared framework to learn first.

## Related work

[HTML-CSS-JavaScript](https://github.com/YT-PRO12/HTML-CSS-JavaScript) contains the earlier browser fundamentals. [AegisED](https://github.com/YT-PRO12/AegisED) uses React, Express, PostgreSQL, and a Python ML service. [EduPredictAI](https://github.com/YT-PRO12/EduPredictAI) uses a React frontend and Python backend with SQLite. These retain their own repositories and architecture.

See [source provenance](docs/provenance.md) for what was adapted. Future features are listed in the roadmap; they are not included in the implementation status above.
