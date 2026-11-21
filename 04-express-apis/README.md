# Express: products API

This lab extends the in-memory products example in HTML-CSS-JavaScript. It separates app creation from listening, uses UUIDs, trims names, requires nonnegative integer rupee amounts, rejects unknown fields, and isolates each app's data for tests.

From the root: `npm ci`, then `node 04-express-apis/app.js`. No environment variables are required. The server listens on loopback port 4100.

| Method | Path                | Result                                                      |
| ------ | ------------------- | ----------------------------------------------------------- |
| GET    | `/api/products`     | `{items: [...]}`                                            |
| POST   | `/api/products`     | 201 `{item: {...}}`; body `{"name":"Textbook","price":350}` |
| GET    | `/api/products/:id` | Item or 404                                                 |

Invalid fields or malformed JSON return 400, oversized bodies return 413, and missing routes return 404. No stack traces are returned. This exercise deliberately has no persistence or authentication: restarting loses all data. Do not deploy it as a protected service.

## Input and safety contract

Product names are trimmed, must contain 1–80 characters, and cannot contain ASCII control characters (such as embedded newlines, tabs, or NUL). Ordinary Unicode letters, accents, emoji, and punctuation remain valid. Prices are nonnegative integer rupee amounts capped at 100,000; extra request fields are rejected.

All API responses use `Cache-Control: no-store` and do not expose the Express framework header. The catalog is process-local and deliberately resets on restart. This is a learning API, **not** an authenticated production inventory service.

## Testing

Run `node --test 04-express-apis/app.test.js`. Tests cover creation, retrieval, free items, invalid inputs, state isolation and malformed JSON. Try adding deletion, then prove a deleted identifier cannot accidentally refer to a later product. CampusHub demonstrates service separation, pagination, persistence and authorization.
