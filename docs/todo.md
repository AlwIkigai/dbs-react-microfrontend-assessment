# Assessment task list

The [candidate brief](../brief/candidate-brief.md),
[wireframes](../wireframes/wireframe.md), and
[API contract](../brief/api-contract.md) define the requirements.
This is a summary, not a replacement. Check items only after relevant verification;
record evidence in the [journal](development-journal.md).

## Where we are — 18 November 2026

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

Shared coordination: after this documentation update is merged, create one
`DBS Assessment Checkpoint` issue using the six fields in the
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
