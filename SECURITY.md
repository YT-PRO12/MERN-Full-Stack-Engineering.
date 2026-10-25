# Security scope

This is a learning repository with a local marketplace demo, not a public service approved for real user data.

CampusHub includes server-side ownership checks, strict request schemas, HttpOnly session cookies, hashed session tokens, scrypt password hashes, expiration checks, Origin validation on mutations, bounded payloads, safe error responses and process-local rate limiting. Tests cover these boundaries. The router lab's simulated login is unrelated to real authentication.

Known limits: no email/campus verification, account recovery, distributed rate limiter, moderation, or production operational review. Duplicate registration can reveal account existence. A failure creating a session after registration may leave an account that must sign in again. Demo credentials and seeds must never become hosted accounts.

Do not commit `.env`, tokens, real user records, database dumps or secrets. Use synthetic test data. Do not expose the disposable demo or unauthenticated local database to the internet.

For a security concern, contact the repository owner through a private channel already available to you. If GitHub private vulnerability reporting is enabled, use it; do not assume it is configured. Avoid public issues containing secrets or exploit details.
