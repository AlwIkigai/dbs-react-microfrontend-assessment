# Assessment verification

The [candidate brief](../brief/candidate-brief.md),
[wireframes](../wireframes/wireframe.md), and
[API contract](../brief/api-contract.md) define the requirements.
The table links each requirement to its implementation and records the available verification evidence.

## Current checklist — 20 November 2026

The core flows are implemented and verified on the public production URL. The earlier intermittent dashboard refresh failure did not recur in the latest captured refresh, and its cause remains unconfirmed.

- [x] **Prepare the submission README.** Includes the live URL, setup, structure, decisions, UI states, seven tests, AI-use examples and known gaps. [Submission README](../README.md)
- [x] **Run local checks on Node 22.** Lint, TypeScript, all seven tests and the production build passed on Node 22.23.5.
- [x] **Verify the production revision and build version.** Vercel marks main merge `5172593` (PR #6) Production Ready. Its build log confirms the switch from Node 26.x to 22.x.
- [x] **Verify public entry.** Edge InPrivate opened the production URL without a login prompt. A successful run showed the worker active and all three dashboard GETs returning 200. A separate run showed API 404s and Retry, then recovered after a normal reload. The trigger for the failed requests is unconfirmed.
- [x] **Verify both production transfer paths.** The browser smoke test recorded one SGD 50 transfer to saved payee Jamie Tan and two intentional SGD 50 transfers to new recipient Alex. Recent transactions showed all three entries, total available fell to SGD 16,970.55, and the remaining limit fell to SGD 4,850.00. [Production app](https://dbs-react-microfrontend-assessment.vercel.app/)
- [x] **Verify a later refresh in the production smoke run.** Edge InPrivate logged three transfer POSTs returning 201, each followed by successful dashboard GETs. At 15:55:15 SGT, a separate batch of customer, accounts and transactions GETs returned 200 through the service worker. The earlier 404s did not recur in this run.

Open verification outside the smoke test includes exact skeleton alignment, genuine empty API responses, first-invalid-field focus for a new recipient, one-click recovery after correcting an amount, targeted API field errors, and full keyboard and AA contrast checks across all four theme combinations. A favicon 404 was also observed.

## Requirement → code → evidence

“In code” means a source review. Browser and test evidence is called out where available. 

| ID | Where to look | Evidence and remaining checks |
| --- | --- | --- |
| D1 | [App queries and loading branch](../src/App.tsx#L19), [DashboardSkeleton](../src/components/DashboardSkeleton.tsx#L2) | Three queries start from the same render. Skeleton placeholders exist. Compare loaded and loading positions on a throttled reload, especially the cards and transaction rows. |
| D2 | [Header controls](../src/components/Header.tsx#L39), [greeting](../src/App.tsx#L121) | Header in code and mobile screenshots. Greeting covered by a test. |
| D3 | [Deposit filter and total](../src/App.tsx#L91) | SGD 17,120.55 shown in the local screenshot. Success test checks it falls to SGD 17,070.55 after a SGD 50 transfer. |
| D4 | [Account cards](../src/App.tsx#L137) | Three cards, masked numbers and credit Amount due in code. Check the credit card and empty accounts response in the browser or with a temporary test override. |
| D5 | [Latest-eight query](../src/App.tsx#L31), [transaction rows](../src/App.tsx#L185), [Pending chip](../src/index.css#L540) | Grab’s Pending chip seen locally. Check eight rows, newest first, plus signs, amounts and dates against the response. |
| D6 | [Search filter](../src/App.tsx#L82), [count, Clear search and messages](../src/App.tsx#L155) | In code. Try a description, a category in mixed case, a no-match term and Clear search. Check the genuine empty-list message separately. |
| D7 | [Dashboard Retry](../src/App.tsx#L51), [Retry test](../src/App.test.tsx#L53) | Automated test verified a failed accounts request followed by recovery. |
| D8 | [Dashboard breakpoints](../src/index.css#L186), [fixed CTA and field targets](../src/index.css#L519) | 390 px screenshot shows the fixed CTA. At 360 px, Daily limit clears it and the account and amount fields measure 44 CSS px. Check sideways scrolling and other mobile controls in the final pass. |
| T1 | [Native dialog and focus lifecycle](../src/components/TransferDialog.tsx#L223), [dialog breakpoints](../src/index.css#L411) | Mobile sheet and keyboard return from success confirmed locally. Recheck desktop centring, Escape, close button and focus return. |
| T2 | [Payee query and search](../src/components/TransferDialog.tsx#L105), [recipient forms](../src/components/TransferDialog.tsx#L275) | Saved-payee path exercised by tests. Both modes previously demonstrated locally. Replay new recipient on production. |
| T3 | [Amount form](../src/components/TransferDialog.tsx#L407) | From-account, balance, limit, quick amounts and counter in code. Blank amount was manually verified to receive focus. Try savings and the note boundary. |
| T4 | [Review and Back](../src/components/TransferDialog.tsx#L480) | Review reached in tests. Back preserving values was demonstrated locally. Check the review details for both recipient modes. |
| T5 | [Mutation](../src/components/TransferDialog.tsx#L135), [confirm and success UI](../src/components/TransferDialog.tsx#L553) | Success tested and heading focus confirmed manually. The ref lock and pending disabled state are in code. Check Sending… and one POST under a slow response. |
| T6 | [Query invalidation](../src/components/TransferDialog.tsx#L143), [success test](../src/App.test.tsx#L154) | Automated test verifies the balance, transaction and remaining limit update through the UI. |
| T7 | [Review error alert](../src/components/TransferDialog.tsx#L516), [saved-payee rejection test](../src/App.test.tsx#L122) | Saved-payee field message and staying on Review tested. Failure and retry previously demonstrated locally. Amount and new-recipient API field error mappings are in code and still need targeted verification. |
| T8 | [Field labels and errors](../src/components/TransferDialog.tsx#L300), [success announcement](../src/components/TransferDialog.tsx#L566) | Labels, error links and live region in code. Verify radio keyboard interaction, step focus including Back to Recipient, and screen-reader announcement. |
| §3.3 | [Zod rules](../src/lib/transfer-schema.ts#L6), [RHF configuration](../src/components/TransferDialog.tsx#L46) | Over-balance error and no POST covered by a test. Blank amount focus manually confirmed. Verify new-recipient focus and remaining boundary/error cases. |
| TH1 | [Before-paint setup](../index.html#L8), [theme handling](../src/components/Header.tsx#L14) | Persistence demonstrated locally. Check first visit with system preference and reload for a flash. |
| TH2 | [Segment handling](../src/components/Header.tsx#L27), [brand tokens](../brief/design-tokens.css) | Segment controls in code. Check blue/crimson in both themes and persistence after refresh. |
| TH3 | [Pressed states](../src/components/Header.tsx#L54), [focus CSS](../src/index.css#L178) | Accessible names and pressed states in code. Check keyboard focus and AA contrast in all four combinations. |
| E1 | [TypeScript config](../tsconfig.json), [API types](../src/api/types.ts), [typed API client](../src/api/client.ts#L27) | Strict TypeScript and typed responses. Verified by typecheck. |
| E2 | [Dashboard queries](../src/App.tsx#L19), [mutation and refresh](../src/components/TransferDialog.tsx#L135) | Query owns server data. React state holds local interaction choices. Refresh verified by the success test. |
| E3 | [Transfer schemas](../src/lib/transfer-schema.ts), [form setup](../src/components/TransferDialog.tsx#L46) | RHF uses Zod resolvers for validation. Form state survives step changes. |
| E4 | [Retry, over-balance and success tests](../src/App.test.tsx#L53), [test cleanup](../src/test/setup.ts#L10) | All three mandatory behaviours pass. The suite also covers the greeting, saved-payee rejection and two formatters. |
| E5 | [Scripts](../package.json) | Local lint, types, seven tests and production build passed. The build emitted two Zod annotation warnings. Browser console verification remains open. |
| E6 | [Browser worker startup](../src/main.tsx#L7), [deployment guide](../DEPLOYMENT.md) | Production is Ready on Node 22. Public dashboard and MSW confirmed in InPrivate. Both transfer paths updated the dashboard, and a later refresh returned three 200s. An earlier run hit API 404s and recovered on reload. The cause remains unconfirmed. |
| §§4–6 | [Formatters](../src/lib/format.ts), [dashboard and dialog styles](../src/index.css), [supplied mock data](../mock-api/db.json) | Shared SGD and Singapore date formatting covered by tests. Review exact copy and desktop layout on the final pass. |
