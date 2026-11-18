# Meridian Banking — Syed Ahmad Alwi Bin Syed Abdullah

- Deployed: [Work-in-progress demo](https://dbs-react-microfrontend-assessment.vercel.app/)
- Status: Work in progress — basic dashboard, search and Retry implemented;
  transfers, themes and final accessibility/responsive verification pending.
- Docs: [Original instructions](docs/assessment/README.original.md) ·
  [Task list](docs/todo.md) · [Development journal](docs/development-journal.md) ·
  [Git/deployment practice](docs/git-deployment-workflow.md).

## Run locally

Use Node 22 ([`.nvmrc`](.nvmrc)); verified with Node 22.23.5 and npm 10.9.9.

```sh
npm ci
npm run dev
```

Open the Vite URL, normally `http://localhost:5173`.
The app displays Ava's dashboard using the supplied browser-based mock API.

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

- Keep API data in TanStack Query and search text in local React state.
  Derive deposit totals and filtered transactions instead of storing copies.
- Use the supplied design tokens for the initial responsive layout.
- Selected Node 22.x in Vercel to match the documented environment. A new
  deployment is required to apply the setting to production.
- Public access is required for assessment reviewers. Vercel Authentication was
  initially enabled for all deployments; disabling it and verifying signed-out
  access are part of the deployment checklist.

Feature extraction and transfer-form structure remain to be decided.

## Loading, empty and error states

> **Template guidance:** How you handled them, and how to see each one in the
> deployed app.

Basic loading, search no-results and dashboard error/Retry states are implemented
(D6/D7). The Retry test overrides the accounts response once with HTTP 500, then
checks recovery through the UI. Skeletons and genuine empty-data handling remain
pending; see the [task list](docs/todo.md).

## Tests

> **Template guidance:** What they cover and why you picked those cases.

User ran `npm run check` successfully on 18 November: lint, TypeScript and four
tests passed, including dashboard failure and Retry recovery. Later layout changes
require final verification.
The subsequent local production build passed. The initial Vercel production
deployment also reached Ready; deployed refresh verification remains unresolved.
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
- Codex: incremental React/TypeScript examples, behavioural tests, CSS based on
  supplied tokens, explanations, code review, documentation and deployment
  troubleshooting. I applied examples and inspected API requests in DevTools;
  Codex directly added comments, moved search controls and edited documentation.
- Workflow: I began with ChatGPT (Ace) for requirements and learning planning,
  then moved to Codex for direct local repository inspection, targeted edits,
  command execution and debugging. I used a dedicated `C:\DBS` workspace and
  cloned the repository into `C:\DBS\dbs-react-microfrontend-assessment` so the
  assistance could work against the actual starter and saved files. I implement
  small increments, inspect behaviour in the browser and run checks, then revisit
  the code to practise explaining and modifying it independently. Repo documents
  preserve progress between sessions; I handle subsequent Git/PR/deployment steps
  myself unless I explicitly request execution.
- I questioned `npm ci` versus `npm install` and accepted the recommendation after
  understanding lockfile preservation. This was evaluated advice, not an AI error.

Corrections I requested:

1. Restore the README section guidance that Codex omitted.
2. Shorten the verbose AI draft, remove duplication, and link to detailed logs.
3. I changed the proposed verification order to test after the documentation PR
   triggers redeployment, covering the updated Node configuration.

I also requested that I handle subsequent branches, commits, pushes and PRs myself
after Codex created the first local checkpoint. These are workflow/documentation
examples; implementation decisions will be recorded as they occur.
See the [AI use record](docs/development-journal.md#understanding-and-ai-use).

## Not done / known issues

> **Template guidance:** What you left out or would do with more time.

- Transfer flow, validation, themes, skeletons, complete header and final
  accessibility/responsive verification remain pending.
- Two required transfer tests remain; dashboard Retry recovery is tested.
- Initial deployment succeeded. Signed-out public access and refresh still need
  verification after the settings changes and redeployment.
- DevTools showed a service-worker passthrough `Failed to fetch` error for the
  site root, including in InPrivate. Initial dashboard API requests returned 200.
  The error was not reproduced in the latest screenshot; its cause is unconfirmed.
  Separate extension-generated warnings were identified and are documented in
  the journal. Repeated refresh verification remains pending.
- Installation reported 12 vulnerabilities (6 moderate, 6 high). Audit review is
  pending; no automatic fixes or dependency upgrades have been applied.
