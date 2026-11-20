# Meridian Banking — Syed Ahmad Alwi Bin Syed Abdullah

- Live app: [Meridian Banking](https://dbs-react-microfrontend-assessment.vercel.app/)
- Run locally with Node 22: `npm ci`, then `npm run dev`
- References: [Assignment](docs/assessment/README.original.md) · [Candidate brief](brief/candidate-brief.md) · [Requirement-to-code checklist](docs/todo.md)

## Project structure

| Path | Responsibility |
| --- | --- |
| `src/App.tsx` | Dashboard queries, account totals, transaction search and opening the transfer dialog |
| `src/components/` | Header and theme controls, dashboard loading skeleton, and three-step transfer dialog |
| `src/api/` and `src/lib/` | Typed API client, shared SGD and Singapore-date formatting, and transfer validation |
| `src/mocks/` and `mock-api/` | Supplied MSW integration, handlers and seed data |
| `src/test/` and `*.test.ts(x)` | Shared test setup and behavioural and formatter tests |
| `brief/`, `wireframes/` and `docs/` | Assessment references, verification checklist and development journal |

## Decisions and trade-offs

- **State.** TanStack Query owns API data and request state. React state holds interaction choices such as search text and the current transfer step. The deposit total and daily allowance are calculated from the response. After a successful transfer, invalidating the customer, accounts and transactions queries refreshes all three dashboard values. That costs three reads and keeps the mock API authoritative.
- **Forms.** React Hook Form uses Zod schemas for validation on blur and submit. Review and Back preserve entered values. A native dialog handles modal behaviour, with explicit focus for the amount, review and success headings. The confirm action uses a ref lock and a disabled pending button to guard against duplicate submits.
- **Search.** The dashboard filters the eight loaded transactions by description or category. Matching updates immediately and covers the recent list displayed on the dashboard.
- **Themes and responsive layout.** The page applies saved theme and segment preferences before first paint, using the system colour preference on first visit. CSS uses the supplied tokens. On mobile, the transfer button stays at the bottom and extra dashboard padding lets the last panel scroll clear of it. I measured the account and amount controls at 44 CSS px in Chrome DevTools at a 360 px viewport.

## Loading, empty and error states

- **Loading.** Reload the app or throttle the connection in DevTools to see the dashboard skeleton while requests settle.
- **Search with no matches.** Search for `zzzzz`, then use **Clear search** to restore the list.
- **Empty API data and dashboard errors.** The supplied mock supports `?scenario=empty` on list requests and `?scenario=error` on GET requests. Use a temporary request override for the corresponding dashboard request. Adding the parameter to the page URL alone leaves the dashboard requests unchanged. The Retry test demonstrates a one-time accounts failure and recovery. [API test hooks](brief/api-contract.md#test-and-demo-hooks)
- **Transfer failure.** On the mock app, submit a valid transfer with `#fail` in the note. Review stays open with the transfer details and error message. Go back, remove the marker, and confirm again to exercise recovery.

## Tests

```sh
npm run check
npm run build
```

On 20 November 2026, lint, TypeScript, all seven tests, and the production build passed on Node 22.23.5. The production build includes the MSW service worker.

The [dashboard tests](src/App.test.tsx) cover greeting, failed load and Retry, over-balance rejection without a POST, successful transfer with balance/transaction/limit updates, and the saved-payee API error on Review. The [formatter tests](src/lib/format.test.ts) check SGD formatting and Singapore-time dates. These cases exercise the three behaviours required by the brief and the additional saved-recipient failure path.

## AI use

I used ChatGPT (Ace) for requirements analysis and planning, and Codex for incremental code examples, explanations, review, verification and documentation. I applied changes in small steps, ran checks, and inspected behaviour in the browser. Examples of changes I made to AI-assisted work:

1. I split the recipient-search example so local state comes before the query and the derived matching list comes after it. That put the filter after the data it reads.
2. The first full run of the successful-transfer test found multiple **New transfer** buttons because earlier tests left their rendered apps mounted. I added explicit React Testing Library cleanup to the existing test setup. The full suite then passed.
3. I changed the deployment verification order so I would test the production URL after the merge triggered a new build. That ties the smoke test to the revision and Node configuration being submitted.

See the [development journal](docs/development-journal.md) for the working notes and browser evidence.

## Not done / known issues

- Exact loading-to-loaded layout alignment and a full AA contrast and keyboard pass across all four theme/segment combinations remain open.
- The amount and new-recipient API field error mappings still need targeted response-override verification.
- The latest production revision still needs signed-out verification, including refresh and both transfer modes. The mock data resets on refresh by design. [Remaining checks](docs/todo.md#current-checklist--20-november-2026)
