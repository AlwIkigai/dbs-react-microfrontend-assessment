# Meridian Banking — Syed Ahmad Alwi Bin Syed Abdullah

- Deployed: Pending.
- Status: Work in progress — basic dashboard, search and Retry implemented;
  transfers, themes and final accessibility/responsive verification pending.
- Docs: [Original instructions](docs/assessment/README.original.md) ·
  [Task list](docs/todo.md) · [Development journal](docs/development-journal.md).

## Run locally

Use Node 22 ([`.nvmrc`](.nvmrc)); verified with Node 22.23.5 and npm 10.9.9.

```sh
npm ci
npm run dev
```

Open the Vite URL, normally `http://localhost:5173`.
The starter currently displays `Mock API: connected`.

## Project structure

> **Template guidance:** Folders and what each is responsible for.

- `src/`: application, typed API client, formatting helpers, mocks, and test setup.
- `mock-api/`: supplied Node mock server.
- `brief/` and `wireframes/`: official specification, API contract, tokens, and layouts.
- `docs/`: original README, progress journal, and task list.

Feature structure is pending discussion.

## Decisions and trade-offs

> **Template guidance:** Server state vs UI state, forms and validation, theming,
> anything you chose deliberately, and what you'd change.

- Select Node 22 through fnm in the assessment terminal; retain system Node 24.
- Use `npm ci` to install exact lockfile versions without changing the lockfile.
- Preserve the original README before replacing it.

Application architecture decisions are pending.

## Loading, empty and error states

> **Template guidance:** How you handled them, and how to see each one in the
> deployed app.

Pending implementation; see the [task list](docs/todo.md).

## Tests

> **Template guidance:** What they cover and why you picked those cases.

User ran `npm run check` successfully on 18 November: lint, TypeScript and four
tests passed, including dashboard failure and Retry recovery. Later layout changes
require final verification.
Required behavioural tests are listed in the [task list](docs/todo.md).

```sh
npm run check
npm run build
```

## AI use

> **Template guidance:** Which tools, and what for. Name two or three places where
> you changed, rejected or fixed what the AI produced, and why.

- ChatGPT (Ace): requirements analysis, 42 School-inspired learning approach,
  implementation/verification planning, and context handoff; no application code
  implementation or modification.
- Codex: environment checks, command explanations, troubleshooting, and documentation.
  I ran setup commands and confirmed the mock API connection.
- I questioned `npm ci` versus `npm install` and accepted the recommendation after
  understanding lockfile preservation. This was evaluated advice, not an AI error.

Corrections I requested:

1. Restore the README section guidance that Codex omitted.
2. Shorten the verbose AI draft, remove duplication, and link to detailed logs.

These are documentation examples; implementation examples will be added as they occur.
See the [AI use record](docs/development-journal.md#understanding-and-ai-use).

## Not done / known issues

> **Template guidance:** What you left out or would do with more time.

- Assessment features, mandatory tests, quality checks, and deployment are pending.
- Installation reported 12 vulnerabilities (6 moderate, 6 high). Audit review is
  pending; no automatic fixes or dependency upgrades have been applied.
