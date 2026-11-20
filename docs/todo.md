# Assessment task list

The [candidate brief](../brief/candidate-brief.md),
[wireframes](../wireframes/wireframe.md), and
[API contract](../brief/api-contract.md) define the requirements.
This is a summary, not a replacement. Check items only after relevant verification;
record evidence in the [journal](development-journal.md).

## Current checklist — 20 November 2026

The core flows are implemented and verified on the public production URL. Submit by the 5 PM SGT backstop. The earlier intermittent dashboard refresh failure did not recur in the latest captured refresh, and its cause remains unconfirmed.

- [x] **Prepare the submission README.** Includes the live URL, setup, structure, decisions, UI states, seven tests, AI-use examples and known gaps. [Submission README](../README.md)
- [x] **Run local checks on Node 22.** Lint, TypeScript, all seven tests and the production build passed on Node 22.23.5.
- [x] **Verify the production revision and build version.** Vercel marks main merge `5172593` (PR #6) Production Ready. Its build log confirms the switch from Node 26.x to 22.x.
- [x] **Verify public entry.** Edge InPrivate opened the production URL without a login prompt. A successful run showed the worker active and all three dashboard GETs returning 200. A separate run showed API 404s and Retry, then recovered after a normal reload. The trigger for the failed requests is unconfirmed.
- [x] **Verify both production transfer paths.** The browser smoke test recorded one SGD 50 transfer to saved payee Jamie Tan and two intentional SGD 50 transfers to new recipient Alex. Recent transactions showed all three entries, total available fell to SGD 16,970.55, and the remaining limit fell to SGD 4,850.00. [Production app](https://dbs-react-microfrontend-assessment.vercel.app/)
- [ ] **Submit.** Reply to the invitation with the public repository and live URLs.
- [x] **Verify a later refresh in the production smoke run.** Edge InPrivate logged three transfer POSTs returning 201, each followed by successful dashboard GETs. At 15:55:15 SGT, a separate batch of customer, accounts and transactions GETs returned 200 through the service worker. The earlier 404s did not recur in this run.

Open verification outside the smoke test includes exact skeleton alignment, genuine empty API responses, first-invalid-field focus for a new recipient, one-click recovery after correcting an amount, targeted API field errors, and full keyboard and AA contrast checks across all four theme combinations. A favicon 404 was also observed.

## Requirement → code → evidence

“In code” means a source review. Browser and test evidence is called out where available. Use the remaining check in each row as a short practice exercise.

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

## Interview practice

Open each link and explain the flow aloud before looking at the next file.

1. **Where does the total come from?** Start in [App](../src/App.tsx#L19). Trace API response → query data → eligible deposit accounts → calculated total. Explain why opening the dialog and typing a search belong in local state.
2. **What happens after Confirm transfer?** Start at [confirmTransfer](../src/components/TransferDialog.tsx#L187). Trace validation → saved/new request shape → POST → success or alert → invalidated queries → updated dashboard. Explain which displayed value would go stale if you removed each invalidation.
3. **How would you make one small live change?** Find the note limit in [the schema](../src/lib/transfer-schema.ts#L26) and the counter in [the amount form](../src/components/TransferDialog.tsx#L464). Explain which pieces change together and how you would verify the boundary. Practise independently, then undo the exercise.
4. **How did you verify the design?** Explain the Runyx Figma-to-code parallel. Here the brief and wireframe defined the target, CSS used the supplied token, and Chrome DevTools measured the controls at 360 px. [Journal entry](development-journal.md#20-november-2026--mobile-design-verification-d8)

<details>
<summary>Earlier checkpoints and historical checklist</summary>

## Where we are — 18 November 2026

## Latest requirements audit — 19 November 2026

This section supersedes the older checkpoint below. Audit scope: original brief,
saved code, lint/typecheck, four existing tests, production build, and local Edge
browser checks at 1280x900, 390x844 and 360x844. No application source was changed.

Implemented: dashboard queries/search/Retry; header and initial skeletons;
saved/new-recipient forms; amount validation; Review/Back; transfer mutation,
success/failure and query invalidation; theme/segment controls and initialization.
Manual evidence from the user covers both recipient modes, failure/recovery and
theme switching. Independent browser audit verified a saved-payee successful
transfer and updated dashboard data. These are not full requirement sign-offs.

Required actions, in order:

1. E4: Add over-balance/no-POST and successful-transfer/dashboard-update tests.
2. Validation/T8: Repair first-invalid-field focus. Audit showed the amount error
   but focus did not reach the amount input even after waiting for focus updates.
   Step changes also leave focus on BODY; establish meaningful step/success focus.
3. D8: Fix New transfer to the mobile viewport bottom, with content clearance.
   Audit computed its position as static at both 390px and 360px.
4. D8/T8: Make dialog text inputs and selects at least 44px high and style their
   theme/focus states. At 360px, sender select measured 25px and text inputs 30px.
5. D1: Match skeleton and loaded geometry. Loading lacks the greeting/CTA layout,
   credit-card extra line and matching transaction/control heights. Measure and
   correct movement rather than marking skeleton presence as full completion.
6. D5: Style Pending as the required chip (currently a plain paragraph).
7. Empty states/D6: Distinguish no transactions from no search matches; always
   offer Clear search for the no-matches state. Handle empty accounts explicitly.
8. API errors: Handle server fields.payeeId as well as mapped amount/recipient
   fields; verify field errors through controlled test overrides.
9. TH3: Verify AA contrast and keyboard focus in all four combinations. Token
   use is implemented, but native form controls and rendered states need checks.
10. E6: Publish latest local changes, verify public signed-out access, deployed
    Node 22, refresh, and saved/new transfer flows on the production URL.
11. README: Replace stale pending claims, finish responsibilities/trade-offs/test
    coverage/limitations and record final evidence before submission.

Additional interaction to fix/verify: correcting an over-balance error and clicking
Continue once did not advance in automation; a second click did. Error removal
moves the button, so stabilize error space and retest before attributing a cause.

Checks: lint and TypeScript passed. Four tests passed after routing TEMP/TMP to
a writable audit folder outside the repo; initial sandbox rename error prevented
tests from starting. Build passed with two Zod comment-annotation warnings.
Browser identity/title correct, meaningful content, no framework overlay, no
pageerror events on the tested success path; mobile page widths matched viewports.
No dependencies installed. Browser skill unavailable; existing Playwright drove
headless Edge. Screenshots/scripts are outside the repository in C:\DBS\.audit-temp.

## Earlier checkpoint — 18 November 2026

Current milestone: basic dashboard, transaction search, Retry, responsive account
cards and daily-limit rail implemented. User confirmed the initial visual layout.
Next: header and loading skeletons, then transfer flow. Transfers, themes and final
mobile/accessibility verification remain pending. User ran `npm run check` at
17:01 SGT: lint, TypeScript and four tests passed, including Retry recovery;
later layout changes have not yet received the same full check.
The local production build passed and the user deployed the merged checkpoint to
[Vercel](https://dbs-react-microfrontend-assessment.vercel.app/).
Public-access and refresh verification remain open: a service-worker passthrough
error reproduced in InPrivate but was not visible in the latest 18:23:56 SGT check.
Extension-generated unload warnings disappeared after permission changes; this is
separate from the unexplained passthrough error. Node 22.x is selected; deployed
build-version confirmation is pending. The user handles branches and PRs.

Shared coordination: use the existing
[`DBS Assessment Checkpoint` issue #4](https://github.com/AlwIkigai/dbs-react-microfrontend-assessment/issues/4)
with the six fields in the
[workflow guide](git-deployment-workflow.md#shared-checkpoint-issue).
Repo documents retain the detail; Ace reviews committed evidence independently.

Working approach: build one small working increment with brief explanations and
step headings plus right-side code comments. Verify it, then revisit the completed
flow to deepen understanding and practise explaining or modifying it independently.

| Step | Status | Evidence / remaining work |
| --- | --- | --- |
| Clone, install, run starter | Done | Earlier setup journal records the baseline. |
| Inspect specification and starter | Codex review done | User understanding continues through implementation. |
| Fetch customer and show greeting | Working and tested | User inspected GET `/api/customer`: 200 and Ava's data. Greeting test passed. |
| Fetch and display three accounts | Working, screenshot confirmed | Deployed screenshot shows three cards, masked numbers, balances and credit label; mobile verification pending. |
| Calculate deposit total | Verified visually | Deployed screenshot shows SGD 17,120.55 and Across 2 deposit accounts. |
| Dashboard tests | Four tests passed | User ran check at 17:01 SGT; includes greeting and Retry tests plus two formatters. Later layout changes need a full check. |
| Eight recent transactions (D5) | Implemented | User screenshot confirms GET transactions?limit=8 returned 200; final row-level verification pending. |
| Transaction search (D6) | Implemented | Filter, count, clear and no-results code present; final browser verification pending. |
| Complete dashboard states (D1/D7) | Partial | Retry recovery tested; skeletons and genuine empty-data states pending. |
| Header and responsive layout (D2/D4/D8) | Partial | Account grid and desktop daily-limit rail implemented; complete header, fixed CTA and mobile verification pending. |
| Transfer dialog (T1) | Not done | Steps, opening/closing and keyboard focus. |
| Recipients (T2) | Not done | Saved payees, search and new recipient. |
| Amount and validation (T3/E3) | Not done | Account, quick amounts, balance/limit checks and note. |
| Review (T4) | Not done | Summary and Back preserving inputs. |
| Send and outcomes (T5/T7) | Not done | Duplicate prevention, sending, failure/retry and success. |
| Refresh dashboard (T6) | Not done | Update balances, transactions and daily usage. |
| Themes (TH1–TH3) | Not done | Light/dark, segment, persistence and accessible combinations. |
| Required behavioural tests (E4) | One of three passed | Dashboard Retry passed; over-balance and successful transfer tests pending. |
| Final quality checks (E5/T8/D8) | Not done | Checks/build, console, keyboard, contrast and mobile verification. |
| Deploy and final README (E6) | Initial deployment done | Public-access/refresh checks, future deployed transfers and final README pending. |
| Interview preparation | Ongoing | Revisit flows, decisions and independent code changes. |

These increments do not mean the corresponding complete requirements below have
passed. Keep full requirement checkboxes open until all their parts are verified.

## Setup and understanding

- [x] Clone repository and open in VS Code.
- [x] Select Node 22 without replacing system Node.
- [x] Install locked dependencies with `npm ci`.
- [x] Run untouched starter and observe `Mock API: connected`.
- [x] Archive an exact copy of the original README.
- [ ] Review brief, wireframes, API contract, tokens, and deployment instructions.
- [ ] Trace starter code and test infrastructure.
- [ ] Agree on minimal structure and first atomic task.
- [ ] Review dependency audit findings and record a decision.

## Dashboard

- [ ] D1: Concurrent customer/accounts/latest-eight requests; stable skeleton layout.
- [ ] D2: Logo, exact greeting, segment/theme switches, and avatar.
- [x] D3: Derived deposit-account total and caption, excluding credit card.
- [ ] D4: Three account cards, masked numbers, and credit-card amount due.
- [ ] D5: Eight newest transactions, signs, formatting, and pending indicators.
- [ ] D6: Description/category search, count, clearing, and exact no-results state.
- [x] D7: Dashboard error and working Retry.
- [ ] D8: Mobile layout, fixed transfer CTA, margins, and tap targets.

## Transfer

- [ ] T1: Responsive dialog/sheet, stepper, close actions, focus entry/return.
- [ ] T2: Searchable API payees and new-recipient entry.
- [ ] T3: Eligible account, amount, quick amounts, balance/limit, and note counter.
- [ ] T4: Review details; Back preserves inputs.
- [ ] T5: POST transfer, duplicate prevention, sending state, and success details.
- [ ] T6: Refresh balance, transaction, and daily limit without page reload.
- [ ] T7: Failure alert and retry with preserved review data.
- [ ] T8: Labels, linked errors, announcements, and keyboard payee selection.

## Validation — section 3.3 and E3

- [ ] Define rules once and integrate form errors.
- [ ] Name 2–50 characters; account exactly eight digits; bank required.
- [ ] Amount required, minimum 1.00, maximum two decimal places.
- [ ] Balance and remaining-limit checks with dynamic error amounts.
- [ ] Note maximum 50 characters.
- [ ] Validate on blur/Continue; focus first invalid field.
- [ ] Display API validation errors according to contract.

## Themes and layout

- [ ] TH1: System initial theme, persistence, instant toggle, and no reload flash.
- [ ] TH2: Persisted segment switch using supplied CSS variables.
- [ ] TH3: Accessible toggles, visible focus, AA contrast in four combinations.
- [ ] Set theme/segment attributes on HTML; verify section 5 layout down to 360 px.

## Engineering and verification

- [ ] E1: Strict TypeScript, typed API data, no `any`.
- [ ] E2: Query-managed server state, caching/errors, post-transfer refresh.
- [ ] E3: Central form validation without duplicate rules.
- [ ] E4: Over-balance error prevents a transfer request.
- [ ] E4: Successful transfer shows success and updates dashboard.
- [x] E4: Dashboard failure shows error; Retry successfully loads it.
- [ ] E5: `npm run check` passes.
- [ ] E5: `npm run build` passes.
- [ ] E5: Verify no normal-operation console errors.
- [ ] E6: Public app works end to end without local server.
- [ ] Verify deployed mock worker, transfers, mobile layout, and refresh.
- [x] Initial local production build passes and Vercel deployment reaches Ready.
- [ ] Save/confirm authentication protection permits public reviewer access.
- [ ] Redeploy with selected Node 22.x and confirm build version.
- [ ] Verify public access in a fresh signed-out session.
- [ ] Investigate/retest service-worker passthrough error on page refresh.

## Documentation and submission

- [ ] Complete README decisions, states, tests, structure, and known limitations.
- [ ] Record factual AI use and two or three implementation corrections/rejections.
- [ ] Practise explaining decisions and tracing/modifying code without AI.
- [ ] Submit repository and deployment URLs by 20 November 2026 (user-reported
  recruiter deadline; official cutoff time unconfirmed).

Optional features are deferred until mandatory work is verified. Checklist order
is a grouping of requirements, not a fixed implementation sequence.

</details>
