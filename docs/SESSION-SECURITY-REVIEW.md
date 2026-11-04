# Session and authorization review

For the CampusHub marketplace, authentication alone does not authorize every mutation.

## API review

- Validate session credentials server-side and reject expired, malformed or revoked sessions.
- Bind ownership checks to the server-resolved user, never a request-provided `ownerId`.
- Reject changes to another user's listing, even when its identifier is known.
- Confirm that invalid ownership and input failures leave database state unchanged.
- Keep cookies and tokens out of response bodies, error logs, and source control.
- Review cookie `HttpOnly`, `Secure`, `SameSite`, origin restrictions and CSRF defenses for the actual deployment architecture.
- Test concurrent listing transitions in an isolated database.

A passing mock test does not prove correctness of a hosted reverse proxy, cookie configuration, or authentication provider. Use disposable local data for integration tests and retain real CI evidence.

See [release gates](RELEASE-GATES.md).
