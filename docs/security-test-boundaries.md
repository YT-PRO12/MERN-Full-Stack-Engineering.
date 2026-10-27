# Security regression boundaries

CampusHub is a local learning application, not a production identity or payments service. The checked-in tests aim to catch regressions in these areas:

- **Authentication:** malformed cookie values cannot reach token hashing, sessions are revoked on logout, and stored password hashes are validated before comparison.
- **Authorization:** listing edits use server-derived ownership and a matching version, rather than trusting ownership fields from the request.
- **Input contracts:** query parameters, listing identifiers, account fields and listing updates reject unsupported shapes and operators.
- **Resource limits:** request bodies and authentication attempts are bounded, with safe client-visible errors.
- **Data integrity:** atomic reservation and listing-update predicates protect against simple concurrent overselling or lost edits.

They do **not** establish immunity to all security threats. There is no campus identity verification, distributed rate limiting, deployment hardening, abuse moderation, or penetration-test sign-off. Review [SECURITY.md](../SECURITY.md) before using the demo outside a local development setup.
