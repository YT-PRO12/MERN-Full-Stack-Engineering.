# Source provenance and audit

Reviewed on 25 October 2026. The original repositories remain intact.

| Source                                                                 | Audited revision                           | Relationship                                                                                                                                                                                                                                |
| ---------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [React-Projects](https://github.com/YT-PRO12/React-Projects)           | `2d30f411cbb9d4f4f58abde3b12e3faa136a323f` | Currency converter and router lab reimplement existing project ideas, retaining function components, hooks, named inputs and the rate provider. Adds failure handling, request cancellation, accessible labels, meaningful docs, and tests. |
| [HTML-CSS-JavaScript](https://github.com/YT-PRO12/HTML-CSS-JavaScript) | `e7048efeb1722f83e355adfc5e1eb2bb00abb182` | Products lab extends the in-memory Express example. CampusHub follows the existing React/Express/MongoDB architecture outline; that outline did not contain an implemented capstone.                                                        |

Both source repositories had no open PRs and no Actions runs at audit time. The React source used separate Vite apps, mixed folder casing, and template READMEs. The currency hook lacked HTTP/error handling and cleanup. The router session was a local boolean. These observations informed the new examples; they are not claims about unrelated projects.

AegisED and EduPredictAI were reviewed for stack accuracy and current checks. Their latest main checks were successful; their application architecture was preserved. Existing AegisED documentation/staging PRs were outside this repository's scope. The profile had no open PRs. No private project source is included or described here.

New code, tests, CSS illustrations and documentation were prepared with coding-assistant help and require the maintainer's review and understanding. No historical development diary or independent-authorship claim is generated. Dependencies retain their own licenses. This repository does not assign a new license to the separate source repositories.
