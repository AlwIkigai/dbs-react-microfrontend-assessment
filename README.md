# Meridian Banking — Syed Ahmad Alwi Bin Syed Abdullah

- Live app: [Meridian Banking](https://dbs-react-microfrontend-assessment.vercel.app/)
- Run locally with Node 22: `npm ci`, then `npm run dev`
- Build environment: `package.json` pins Node to `22.x` to match the assignment and the Vercel project setting.
- References: [Assignment](docs/assessment/README.original.md) · [Candidate brief](brief/candidate-brief.md) · [Requirement-to-code checklist](docs/todo.md)

## Project structure

| Where to look | What it does |
| --- | --- |
| `src/App.tsx` | Puts the dashboard together. It loads the data, works out the total, filters transactions and opens the transfer dialog. |
| `src/components/` | Contains the header and theme controls, the loading placeholders and the transfer dialog. |
| `src/api/` | Sends API requests and describes the data those requests use. |
| `src/mocks/` and `mock-api/` | Let the demo run without a backend. MSW intercepts API requests and responds with the supplied mock data. |
| `src/lib/` | Holds the rules for transfer validation and formats amounts in SGD and dates in Singapore time. |
| `src/test/` and test files | Set up the test environment and check user flows and formatting. |
| `brief/`, `wireframes/` and `docs/` | Contain the assignment references and the checklist linking requirements to code. |

## Decisions and trade-offs

### Dashboard data

- TanStack Query manages data from the API, such as Ava’s accounts and transactions. React state keeps track of what she’s doing, such as what she typed in search and which transfer step she’s on.
- The app adds the checking and savings balances to calculate the total. It subtracts today’s transfers from the daily limit to calculate what’s left.
- After a successful transfer, the app fetches customer details for the remaining limit, accounts for the balances, and transactions for the new entry. This adds three requests and keeps the displayed values in sync with the mock API.

### Transfer form

- React Hook Form tracks what Ava enters. Zod checks the rules when she leaves a field or presses **Continue**. Going **Back** keeps her entries.
- The browser’s built-in dialog handles modal behaviour. The app moves keyboard focus to the Amount, Review and Success headings when they appear.
- On **Confirm transfer**, an immediate lock blocks repeat clicks. The button is also disabled while the request is pending.

### Transaction search

- Typing a merchant name or a category filters the eight transactions already on the dashboard. Results appear as you type, and the search covers those eight entries.

### Themes and mobile layout

- The app remembers the chosen theme and segment. It applies them before the browser draws the page and uses the system colour preference on the first visit. The colours come from the supplied design tokens.
- On mobile, **New transfer** stays at the bottom. Extra space lets the last panel scroll above the button.
- At 360 CSS px, I used DevTools to verify that the account dropdown and amount field were both 44 CSS px tall.

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

I used ChatGPT to work through the assignment brief and plan the work. I used Codex for code examples, explanations, reviews, testing help and documentation.

Two examples of changes I made while working with AI:

- **Recipient search.** I moved the filtering code below the query that loads the recipients. The filter needs that list before it can find matches.
- **Transfer test.** Codex helped diagnose why the test found several **New transfer** buttons. Earlier tests had left copies of the dashboard on the page. We added cleanup between tests, and all six tests passed. The saved-payee error test was added later, bringing the total to seven.

## Not done / known issues

- **Dashboard load error.** The dashboard failed once in Edge InPrivate and recovered after a normal reload. Both transfer flows and a dashboard refresh worked in a later production test. The cause is unknown.
- **Missing tab icon.** The browser requests `/favicon.ico` and receives a 404.

See the [verification checklist](docs/todo.md) for browser checks and what remains to verify.
