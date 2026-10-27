# Pull request review checklist

Use this checklist for changes to the MERN learning workspace.

- [ ] Explain the behavior changed and why.
- [ ] Keep changes within a single module or connected workflow.
- [ ] Include a regression test for changed behavior when possible.
- [ ] Reject untrusted input at the server, not only in React forms.
- [ ] Preserve session, ownership and optimistic version checks.
- [ ] Check that responses omit credentials and internal stack traces.
- [ ] Use synthetic fixtures and disposable MongoDB databases.
- [ ] Keep runtime, format, lint, test and build results accurate.
- [ ] Document any unrun test or environment limitation.
- [ ] Update the API contract or walkthrough when visible behavior changes.
- [ ] Confirm no secrets, local databases, built output, or generated files are committed.

Avoid splitting one conceptual change into artificial micro-commits. Prefer independently explainable commits with clear intent.
