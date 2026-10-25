# Explain the code

## React labs

The fundamentals app stores only the source task data. Completed count is derived, avoiding two states that can disagree. In the currency app, a base-currency change cancels the prior request; the stale-result guard also protects against a service completing after cancellation. The router app deliberately demonstrates the limits of client-side redirects: a hidden route is not a server permission.

## CampusHub listing edit

1. `ListingForm.jsx` converts the price field to a number and sends the current version.
2. `api.js` sends JSON and handles non-success responses.
3. `app.js` rejects foreign origins before parsing requests, then checks the session.
4. `validation.js` permits only known fields with bounded values.
5. `listings.js` finds an owner-scoped record, checks its lifecycle, then updates only if the version still matches.
6. MongoDB changes the fields and increments the version in one atomic operation.
7. The frontend navigates to the detail page. A conflict is displayed as an error and requires a reload.

Follow the concurrent edit regression test: both requests carry version 0, but only one can update that version. The second receives 409. Removing the version from the update filter would break this guarantee even if the earlier read still checked it.

## Identity and persistence

The browser stores an opaque session cookie, not a JWT or a password. The server hashes the token for lookup and checks expiration. Logout deletes that session so replaying the previous cookie fails. A user's other sessions remain signed in; global logout is not implemented.

User identity and listing ownership are server-derived. Client-provided owner fields fail validation. Public listings populate the seller's name only. Model indexes enforce unique user email and unique session hashes.

## Useful modification exercises

- Add a condition filter through the UI, query schema, service and tests.
- Add a second dashboard page to the browser journey.
- Show a field-specific conflict recovery action without automatically resubmitting a stale edit.
- Explain why deleting a completed sale record would be a different product decision from marking it sold.
- Evaluate how a reservation plus an order would change the transaction boundary before writing either feature.
