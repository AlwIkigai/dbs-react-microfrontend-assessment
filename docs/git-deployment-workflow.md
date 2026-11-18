# Git, PR and deployment practice

Use this as a reference while performing the steps yourself. Run commands from
the assessment repository. Replace example branch names for each new task.

## 1. Check where you are

```powershell
git status
```

Read the branch name and changed files. If there are uncommitted changes, finish
or save that work deliberately before switching branches. Do not discard it.

## 2. Start new work from updated main

Only do this when your working tree is clean:

```powershell
git switch main
git pull --ff-only origin main
git switch -c feat/next-small-task
```

- `switch main`: select the local main branch.
- `pull --ff-only`: bring in merged GitHub changes without creating a merge commit.
  If it fails because branches diverged, inspect before proceeding; do not force it.
- `switch -c`: create and select a new branch for one focused change.
- Use `docs/...` for documentation or `fix/...` for a focused bug fix as appropriate.

## 3. Make and verify one change

Edit and save files, then review:

```powershell
git diff
git diff --check
```

For application changes, run relevant checks:

```powershell
npm run check
npm run build
```

Use the documented Node 22 environment. Documentation-only edits generally need
content/link review and a diff check rather than repeating application tests.
Record what actually passed; a successful build is not a full behaviour check.

## 4. Stage and commit locally

Example for documentation changes (substitute the files you actually changed):

```powershell
git add README.md docs/todo.md docs/development-journal.md
git diff --cached
git commit -m "docs: update progress and verification"
```

- `add`: select the changes for this commit.
- `diff --cached`: review exactly what will be committed.
- `commit`: save a checkpoint locally; nothing is uploaded yet.

## 5. Push to GitHub

```powershell
git push -u origin feat/next-small-task
```

Use your actual current branch name. `origin` is the GitHub remote; `-u` connects
the local branch to its remote counterpart. Later pushes on it can use `git push`.
Pushing a feature branch does not merge it into main.

The push output usually includes a PR creation URL. Alternatively open GitHub's
Pull requests tab, or use `gh pr create --web` if GitHub CLI is installed and signed in.

## 6. Create and review the PR

1. Select base `main` and compare your task branch.
2. Use a title describing the result.
3. Describe the change, actual validation and relevant unfinished work.
4. Review Files changed; confirm there are no unintended files.
5. Wait for Vercel's preview deployment check. Investigate failures before merging.
6. Open the preview when useful to inspect that branch's behaviour.
7. Merge pull request, then Confirm merge when ready.

Vercel's deployment check confirms a deployment build, not our complete lint/test
suite. GitHub Actions for those checks is optional and not configured yet.

## 7. Verify the production deployment

After the merge, open Vercel and wait for the deployment of main to show Ready
with Environment: Production. The PR link may still open its Preview deployment.

Stable production URL:

https://dbs-react-microfrontend-assessment.vercel.app/

- Branch URL: follows the latest deployment for that branch.
- Unique deployment URL: identifies one specific deployment.
- Stable production URL: use this in the README and submission.

Verification checklist:

- Confirm the deployment source is the intended main commit.
- Confirm build settings use Node 22.x, `npm ci`, `npm run build`, and output `dist`.
- Confirm authentication protection allows public reviewer access.
- Visit in a fresh signed-out/private session and reload.
- Inspect dashboard requests and the console; attribute extension output by source.
- Exercise the changed behaviour (for example search and Clear search).
- Once transfers exist, verify sending and dashboard updates on the deployed site.
- Record evidence and unresolved issues in the journal.

No separate backend or environment variables are required for this starter.
MSW runs in the browser; a page refresh resets its mock data by design.

## 8. Begin the next task

After the PR is merged and the working tree is clean, repeat step 2. Avoid adding
new work to an already merged branch. If unsent edits exist on it, preserve them
on a new branch first and inspect the diff against updated main before opening a PR.

## Shared checkpoint issue

After merging the documentation PR, create one issue titled
`DBS Assessment Checkpoint`. Use these six fields; replace synchronization
placeholders with the actual merged main commit and Singapore date/time.

```md
### 1. Current milestone
Complete the mandatory dashboard, then implement transfers.

### 2. Implemented
Dashboard queries, greeting, accounts, deposit total, transactions/search,
Retry, initial account grid and daily-limit rail.
Details: [Task list](../blob/main/docs/todo.md).

### 3. Verified
18 Nov: user ran npm run check at 17:01 SGT: lint, TypeScript, four tests passed,
including Retry recovery. Subsequent local build passed; initial deployment Ready.
Latest browser capture at 18:23:56 SGT shows three API 200s and no unload warnings
after restricting extension access. These checks cover different scopes/versions.
Evidence: [Journal](../blob/main/docs/development-journal.md).

### 4. Outstanding / blockers
Header, skeletons/empty states, transfers/validation, themes, mobile/accessibility,
two mandatory transfer tests and final verification. Public access and deployed
Node 22 need confirmation. Earlier MSW passthrough error not reproduced in latest
capture; cause unconfirmed. No implementation blocker established.

### 5. Next action
Add the dashboard header structure (D2), then matching loading skeletons (D1).

### 6. Last synchronized
Date/time: <SGT date/time>
Branch: main
Commit: <actual merged main SHA>
```

The relative links above are intended for an issue in this repository. Confirm
they resolve after posting. Use `git log -1 --format="%H"` on updated main to obtain
the commit SHA. No verification is attributed to that new commit unless rerun.

Update this same issue briefly after meaningful milestones. Ace independently
reviews committed content; Codex assists locally. Preserve the separate evidence
categories: implemented, automated tests passed, manually verified, deployment
verified. Do not turn synchronization into a daily ceremony or a second tracker.

## Explain it back

- What is the difference between commit, push and merge?
- Which branch is being deployed: the PR branch or main?
- Does Ready prove the application's behaviour is correct?
- Which URL should a reviewer receive?

The user handles Git commands, PR creation/merging and deployment actions unless
explicitly asking Codex to execute them. Codex may help review and explain.
