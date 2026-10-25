# CampusHub API contract

All routes begin with `/api`. JSON bodies are limited to 16 KB. Mutations require an `Origin` header exactly matching `CLIENT_ORIGIN`; there is no wildcard CORS policy. Browser requests use same-origin cookies through the development proxy.

| Method | Route            | Authentication   | Result                                          |
| ------ | ---------------- | ---------------- | ----------------------------------------------- |
| GET    | `/health`        | None             | 200 when MongoDB connected, otherwise 503       |
| POST   | `/auth/register` | None             | 201 `{user:{id,name}}`, session cookie          |
| POST   | `/auth/login`    | None             | 200 user, rotated session cookie                |
| POST   | `/auth/logout`   | Optional session | 204, current session revoked and cookie cleared |
| GET    | `/auth/me`       | Required         | 200 user or 401                                 |
| GET    | `/listings`      | None             | `{items,page,limit,total,pages}`                |
| GET    | `/listings/:id`  | None             | `{item}` or 404                                 |
| GET    | `/my/listings`   | Required         | Paginated current-owner listings                |
| POST   | `/listings`      | Required         | 201 `{item}`                                    |
| PATCH  | `/listings/:id`  | Owner            | 200 `{item}` or 409 stale/terminal state        |

Registration accepts `name` (2–60 characters), `email`, and `password` (12–128 characters). Login accepts email/password. Emails are trimmed and normalized to lowercase; passwords are not trimmed. Public responses omit email and password hashes.

A listing body contains `title` (3–100 characters), `description` (10–2000), integer `price` (0–100000 rupees), `category` (`books`, `electronics`, `essentials`), `condition` (`like-new`, `good`, `fair`), and `location` (2–80). Unknown fields are rejected, including client-supplied owner/status on creation. Owner comes from the session; initial status is active.

PATCH requires `version` from the last item response and at least one editable field or status. `active → reserved/sold`, `reserved → active/sold`; sold is terminal. Existing status may be retained while editing other fields. Concurrent updates match owner, ID and version atomically. Cross-user writes return 404 rather than revealing ownership.

List queries accept only `q` (up to 80 characters), category, status, page (1–1000), and limit (1–24; default 9). Sort is newest first with ObjectId tie-breaker. No results produce `items:[]`, `total:0`, `pages:0`. Out-of-range pages return an empty list. Count and items are separate queries, so concurrent creates can change totals between them; no snapshot consistency is claimed.

Errors use `{error:{code,message,fields?}}`. Validation/invalid IDs/malformed JSON: 400. Missing session/incorrect credentials: 401. Wrong/missing Origin: 403. Missing resource: 404. Duplicate account, stale version or sold edit: 409. Oversized JSON: 413. Rate limit: 429. Unexpected failures: 500 with no stack, secrets, or database internals. Field errors contain path/message only.

Example create body:

```json
{
  "title": "Algorithms textbook",
  "description": "A clean copy for the next semester.",
  "price": 350,
  "category": "books",
  "condition": "good",
  "location": "Library entrance"
}
```
