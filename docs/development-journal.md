# Development journal

Record actions, reasons, evidence, learning, and AI involvement. Distinguish
planned, implemented, verified, and deployed work.

## 18 November 2026 — Environment and untouched starter

### Objective

Run the original starter before implementing assessment features.

### Actions and decisions

- Moved from ChatGPT preparation to Codex for local setup because Codex can
  inspect project files and the local environment, helping align Node and
  dependency versions with the starter's requirements.
- Chose `C:\DBS` and cloned my assessment repository into
  `C:\DBS\dbs-react-microfrontend-assessment`; opened it in VS Code.
- Confirmed README and `.nvmrc` specify Node 22. `package.json` allows `>=20`,
  but chose the documented environment.
- Located installed fnm 1.39.0 using its absolute path because it was not on PATH.
- Initialised fnm in the assessment terminal, installed and selected Node 22.23.5.
  Verified Node `v22.23.5` and npm `10.9.9` through terminal output.
- Retained system Node 24.12.0; did not change permanent PATH or PowerShell profile.
  Terminal setup must be repeated in a new terminal where Node 22 is needed.
- Ran `npm ci`: 319 packages added; 12 vulnerabilities reported (6 moderate,
  6 high). Audit details remain unreviewed; no automatic fixes applied.
- Ran `npm run dev`; observed `Mock API: connected` in the browser.
- Confirmed `git status --short` was empty before documentation changes.
- Copied README through the editor to `docs/assessment/README.original.md`.
  Codex verified identical SHA-256 hashes before replacing the root README.
- Decided to keep the archived README as an unchanged reference to the original
  assessment instructions while developing my own submission README.
- Authorised Codex to draft the submission README, journal, and initial task list.

### Verification evidence

- User-provided terminal output confirmed versions, install, and clean Git status.
- User reported the browser displayed `Mock API: connected`.
- Codex independently checked Git status and the archive hashes. Original hash:
  `2106A5C9B4FAEAE1F866EC61600E872449ABA38471810792D1A3BF2A6C95B4A7`.
- No browser-console inspection, automated checks, production build, or deployment
  verification has been performed during this setup session.

### Understanding and AI use

- ChatGPT (Ace) helped analyse the DBS assessment requirements, establish a
  42 School-inspired incremental learning approach, plan the implementation and
  verification workflow, and prepare the comprehensive context handoff for Codex.
  ChatGPT did not implement or modify any assessment application code.
- I lead development and learn through small practical increments.
- Codex explained commands and interpreted results. After it performed read-only
  environment checks, I asked to run commands myself.
- I raised concerns about affecting other projects; we used terminal-scoped fnm
  configuration instead of replacing system Node.
- I questioned `npm ci` versus the documented `npm install`. Codex explained
  lockfile preservation and failure on manifest mismatch.
- I created the README archive; Codex verified it and drafted documentation with
  permission. No assessment feature code was generated or changed.
- I briefly read the assignment documents; detailed joint review remains pending.
- Codex initially omitted the README template's section guidance. I requested
  its restoration to keep the document aligned with the assessment.
- I found the README draft too wordy and asked Codex to shorten it, remove
  duplicate setup decisions, and link to detailed records. I also requested
  that ChatGPT's assistance be disclosed alongside Codex's contributions.

### Next step

Review the brief, wireframes, and contract together, refine the task list, and
agree on the first small implementation before changing app code.

## 18 November 2026 — Basic dashboard checkpoint

- User implemented customer/accounts/transaction queries, deposit total,
  transaction search, Retry, account grid and daily-limit panel with Codex guidance.
- Codex supplied incremental examples and CSS using the assessment tokens;
  directly added learning comments and moved search controls into their section.
- User requested step headings and right-side explanations to support learning.
- User shared successful `npm run check` output at 17:01 SGT: lint, TypeScript,
  and four tests passed. One mandatory test covers dashboard failure and Retry.
- Subsequent layout changes require final verification. Transfers, themes,
  skeletons, header and final accessibility/mobile checks are incomplete.
- User requested a pushed checkpoint, plans to open the PR manually, and requested
  an initial deployment. Deployment results will be recorded when known.

## 18 November 2026 — Initial deployment and inspection

- Codex created local branch `feat/dashboard-checkpoint` and commit `fddb0df`.
  Its push attempt failed with a network error. I pushed the branch, created
  PR #1 and merged it myself. I asked to handle future Git/PR actions myself.
- The local production build passed. I imported the repository's main branch
  into Vercel using Vite, `npm run build`, output `dist` and install `npm ci`.
- Vercel reported a successful production deployment at
  https://dbs-react-microfrontend-assessment.vercel.app/ . Screenshots show the
  deposit total, account cards, transaction list and daily-limit panel.
- I inspected the deployed app in DevTools. Initial MSW customer, accounts and
  transaction requests returned 200. A service-worker passthrough fetch for the
  site root failed, including in an InPrivate session. Cause remains unresolved.
- With Codex's read-only settings check, I identified Vercel Authentication
  protection on all deployments and project Node version 26.x. We chose public
  reviewer access and the documented Node 22 environment. A later screenshot
  shows 22.x selected with a warning that production used a different version.
  Saving/confirming protection and signed-out access still need verification;
  the next deployment must apply and verify Node 22.
- I changed Codex's suggested order: update documentation, open/merge a PR to
  trigger a deployment, then test public access and refresh on that deployment.
  Public access could also be checked immediately after saving protection;
  my sequence groups it with the Node-version redeployment check.
- I created `docs/deployment-status` after updating local main. I asked Codex
  to update README, task list and journal; I will commit, push and open the PR.
- Visitor passwords were considered for future use, not enabled or added as an
  assessment feature. The assessment deployment needs accessible reviewer entry.
- These settings changes are not a verified fix for the service-worker error.
  Transfers, themes and remaining mandatory work are still outstanding.

## 18 November 2026 — Browser-extension observation

This is an environment observation, not an additional assessment requirement.

- I investigated DevTools `unload` permissions-policy warnings by opening their
  source scripts. The screenshot locates `content.js` and `msgport.js` under
  Microsoft Power Automate; I also identified remaining warnings with Microsoft
  Editor. These were extension scripts rather than banking-app source files.
- I restricted those extensions' site access to "when clicked" and rechecked.
  The latest screenshot, with MSW requests logged at 18:23:56 SGT, shows no
  `unload` violations, MSW enabled on the production domain, and HTTP 200 for
  customer, accounts and transactions. The dashboard remains rendered.
- Reviewers with extensions enabled may see extension-generated console output.
  Diagnose the source before attributing it to the application; no app policy
  change was made to suppress the warnings.
- The earlier service-worker passthrough `Failed to fetch` error is a separate
  observation. It is not visible in the latest check, but its cause is unconfirmed.
  Record it as not reproduced in that check, not conclusively fixed by changing
  extension access or deployment settings. Repeated refresh and signed-out
  public-access verification remain separate checks.
- Codex helped interpret the DevTools evidence and document the distinction;
  I inspected sources and changed extension permissions myself.

## 18 November 2026 — Shared checkpoint agreement

- I agreed with Ace and Codex to use one `DBS Assessment Checkpoint` GitHub issue.
  The original plan was to create it after merging the documentation update;
  I subsequently delegated publishing the docs and creating the issue immediately
  so Ace could read them before I stopped for the evening.
- Repo documents remain the detailed progress/evidence record; the original DBS
  documents remain the specification. The issue links to them without duplicating
  the journal or task list.
- Codex assists with local implementation, explanations, verification and approved
  documentation edits. I control Git commands, PRs and deployment unless delegating.
- Ace independently reviews the issue, committed code and documents against the
  brief. Uncommitted local work requires a short handoff because GitHub cannot
  expose it. Ace's access confirmation was reported in the handoff I supplied.
- Update the six-field issue only at meaningful milestones and distinguish code
  implementation, automated tests, manual checks and deployment verification.
- Codex published the documentation branch and opened PR #3, then created
  [checkpoint issue #4](https://github.com/AlwIkigai/dbs-react-microfrontend-assessment/issues/4)
  with links to that branch. Ace reviewed the checkpoint and linked documents;
  its PR diff review and application verification were deferred. PR #3 remains
  open at this entry. Future updates should use issue #4 rather than recreate it.

## 19 November 2026 — Interim requirements audit

- User requested an honest review against the original brief before final work.
  Codex inspected the current local branch `feat/dashboard-header`, including
  uncommitted components/schema, original requirements, CSS and existing tests.
- No application code was changed. Documentation was updated with findings.
- Lint/typecheck passed on Node 22.23.5. Initial test execution hit sandbox EPERM
  during a temporary-file rename. With TEMP/TMP redirected to a writable folder
  outside the repo, all four existing tests passed. The two required transfer
  behaviour tests are still missing.
- Production build passed, including two Zod dependency comment-annotation
  warnings; no dependency edits were made.
- Browser plugin skill was unavailable. Codex used an existing cached Playwright
  installation and installed Edge, with no dependency installation. Sandbox
  prevented Edge startup; approved execution allowed the local browser audit.
- Tested flow: local dashboard -> Jamie -> Amount -> over-balance validation ->
  corrected amount -> Review -> Confirm -> success -> refreshed dashboard.
  SGD 50 transfer produced total SGD 17,070.55 and daily remaining SGD 4,950.00.
  Page title/URL matched, content rendered, no framework overlay appeared, and no
  JavaScript pageerror events occurred on this tested path.
- After a validation error cleared, the first Continue click did not advance;
  a second did. Cause is not conclusively established; stabilize layout and retest.
- At desktop 1280x900 and mobile 390x844/360x844, dashboard document width matched
  the viewport. At 360px the dialog also had no internal horizontal overflow.
  This does not verify every state or theme.
- Concrete gaps: static mobile CTA; 25px sender select/30px inputs; invalid-field
  focus not restored to amount; step changes leave focus on BODY; incomplete
  skeleton geometry; plain Pending text rather than chip; incomplete genuine empty
  states and unmapped API payeeId field error. AA contrast remains unmeasured.
- Screenshots, audit scripts and scratch browser profiles are in C:\DBS\.audit-temp,
  outside the repository. The original user browser/session was not controlled.
- Prioritized follow-up is in docs/todo.md under the latest requirements audit.
  Deployed latest flows, public access and Node version were not verified here.

## 20 November 2026 — Mobile design verification (D8)

- This felt like taking a Figma design into code for Runyx. For Meridian, I used
  the brief and wireframe as the design reference, applied the supplied touch
  target token in CSS, and checked the rendered controls in Chrome DevTools.
- At a 360 CSS px viewport, DevTools measured both the From account dropdown
  and the Amount (SGD) field at 44 CSS px tall, including their borders.

## 20 November 2026 — Git staging and line endings

- I checked that I was on `feat/dashboard-header` before staging. I learned
  that `git diff --check` checks unstaged changes, while
  `git diff --cached --check` checks the version staged for the PR.
- Git displayed `^M` in whitespace warnings. LF ends a line with a line feed
  (`\n`). CRLF adds a carriage return (`\r\n`), and `^M` is Git's display
  for that carriage return in this diff.
- Codex normalized the README and four new source files to LF while preserving
  their text. The unstaged check then passed for the README. The normalized
  source files need to be staged again before repeating the staged check.

## 20 November 2026 — Production Node version

- PR #5 merged into main at `590ad2a`. Vercel marked its production deployment
  Ready and assigned the main URL. A hard refresh showed the updated app.
- The build log confirmed the project setting was Node 22.x. The starter's
  `engines.node` range of `>=20` took precedence and selected Node 26.x.
  [Vercel's version rules](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions#version-overrides-in-packagejson)
- Set `engines.node` to `22.x` in the package manifest and matching root lockfile
  metadata to match the assignment. The next production build still needs
  verification on Node 22.

## Future entry outline

- Objective and requirement IDs:
- Prerequisites or concepts:
- Changes and reasons:
- Verification and actual result:
- What I learned or can explain:
- AI assistance and suggestions changed, rejected, or corrected:
- Remaining work:
