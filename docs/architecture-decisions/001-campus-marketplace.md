# 001 — A small, same-origin marketplace

## Context

The earlier CampusHub outline named React, Express, MongoDB, and a route/controller/service flow. The first implemented slice focuses on listings and identity. Payments and conversations would introduce different safety and consistency requirements.

## Decisions

- Keep JavaScript, function components, and explicit hooks consistent with the earlier React examples. TypeScript is not needed to explain this first slice; strict request validation still defines the external contract.
- Use npm workspaces for one install/lockfile and named project commands. Do not introduce a shared component framework or build orchestrator.
- Use a same-origin frontend/API contract. Store a random 256-bit session token in an HttpOnly, SameSite=Lax cookie; store only its SHA-256 hash in MongoDB. Check expiration on every request rather than depending on TTL cleanup timing. HTTPS production requires Secure cookies.
- Hash passwords with asynchronous scrypt, a random salt, and explicit cost settings. No password or session is saved to browser storage.
- Require an exact trusted Origin on mutations, including login/logout. This provides an explicit CSRF boundary in the same-origin deployment. Non-browser clients must send that header too.
- Reference users from listings. Return a public owner name, never their email or password hash.
- Use versioned single-document writes for edits. An application-only read-check-write sequence would lose updates. Sold is terminal. There is no transaction requirement for this single-document invariant.
- Limit search and pagination; escape regex input. This is a small-catalogue substring search, not a search-engine implementation. Assess real query plans before adding indexes or replacing it.

## Tradeoffs and next boundaries

Sessions require a database lookup on authenticated requests. Rate limiting is in-process and would need a shared store before running multiple API instances. Registration and session creation are two writes; failed session creation leaves a valid account that can sign in later. Account enumeration via duplicate registration is a known limitation. Email verification, password recovery, secret rotation procedures, and abuse controls need work before accepting real users.

The API binds to loopback. A hosted deployment needs an HTTPS reverse proxy serving the built frontend and forwarding `/api`, a private authenticated database, explicit Origin configuration, index provisioning, and a reviewed trust-proxy setting if rate limiting should use forwarded client IPs. No hosted deployment is performed here.
