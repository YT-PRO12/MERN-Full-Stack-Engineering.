# API error and privacy review

Use this checklist when changing the CampusHub API or the standalone Express product lab.

## HTTP contracts

- Bad input returns an appropriate 4xx status and a predictable, non-sensitive body.
- Unknown resources return 404, not a raw database exception.
- Authentication failures never echo tokens, passwords, session identifiers, or database connection strings.
- Forbidden mutations leave stored data unchanged.
- Unexpected server failures are logged with redaction and surfaced as a generic 500 response.
- Payload-size limits are independently verified against oversized requests.

## Reproducibility

From the repository root with the supported Node version, run:

```bash
npm ci
npm run format:check
npm run lint
npm run test:node
npm run test:react
npm run build
```

Run browser tests only after installing the documented Playwright browser and using disposable local services. Do not exercise write tests against real accounts or production data.

This document defines review criteria; it is not a newly executed security audit or proof of live deployment.
