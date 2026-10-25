# React patterns: currency and routing

Two focused improvements on the existing [React-Projects](https://github.com/YT-PRO12/React-Projects) collection. These examples keep hooks, function components, and direct data flow.

From the root: `npm ci`, then `npm run dev:patterns`. Open http://localhost:5175. No `.env` file is needed.

## Currency converter — `/currency`

`CurrencyConverter.jsx` owns amount/from/to values. `useCurrency.js` owns the asynchronous request and its loading/error state. The effect aborts on cleanup, and an aborted request cannot overwrite a newer result. Conversion is derived from current input, so a previous conversion cannot remain displayed after editing the amount. Zero is valid. The hook rejects HTTP failures and incomplete or nonpositive rate tables.

The public ExchangeRate-API endpoint is the same service used by the original project. Live usage depends on its availability and terms; the page includes provider attribution. Tests mock it and never spend API quota. Displayed rates are indicative, not financial advice or executable quotes.

Try adding another currency: update the allowed list, the mock rates, and the incomplete-payload test together. Next, design a timestamp display without claiming the rate was fetched more recently than it was.

## Router lab — `/router`

`RouterDemo.jsx` combines nested routes and `Outlet`, URL query filters, product detail parameters, a reducer/context, and missing-route handling. The simulated sign-in only demonstrates navigation. It does not protect data, validate credentials, or persist a real session. CampusHub implements the server-side contrast.

Try making category filters shareable through copied URLs. Add a test for navigating directly to a missing product and for ending the simulated session while viewing the profile.

## Checks and limitations

`npx vitest run 02-react-patterns` covers zero conversion, network recovery, malformed responses, stale response cancellation, nested navigation, and simulated access routing. `npm run build -w @mern/react-patterns` builds both projects. Product data in the router lab is a small static fixture.

These are reimplementations of the existing project ideas with documented improvements, not a claim that the original source already had these behaviors. See [provenance](../docs/provenance.md).
