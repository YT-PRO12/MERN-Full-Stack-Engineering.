# Learning roadmap

The implemented path is intentionally small enough to read and modify.

| Step | Read and run       | Explain afterward                                                           | Try next                                |
| ---- | ------------------ | --------------------------------------------------------------------------- | --------------------------------------- |
| 1    | Daily plan         | Why props flow down and callbacks change parent state; why keys stay stable | Filter completed tasks                  |
| 2    | Currency converter | Effect dependencies, cleanup, stale-response prevention, derived output     | Add a currency with tests               |
| 3    | Router lab         | Nested outlets, parameters, query strings, reducer/context                  | Keep a search filter in the URL         |
| 4    | Inventory CLI      | Async I/O versus pure data transformation; useful exit codes                | Read JSON-lines incrementally           |
| 5    | Products API       | Middleware order, strict input contracts, errors and state isolation        | Add tested deletion                     |
| 6    | Stock lab          | Unique index versus validation; atomic conditional update                   | Race ten requests for three units       |
| 7    | CampusHub          | Server identity, ownership, session revocation, version conflicts           | Add a tested feature through all layers |
| 8    | Browser tests      | A user workflow spanning UI, HTTP and database                              | Add a stale-edit browser scenario       |

## Future work — not implemented

Campus membership verification; account recovery; moderated buyer contact; image uploads with content validation; deployment-specific proxy and rate-limit configuration; cursor pagination for a larger catalogue. Orders and payments require a separate design and are not promises of functionality.

No dated learning diary is generated here. Add personal reflections only after running, modifying, and understanding a project yourself.
