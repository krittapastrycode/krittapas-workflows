---
name: rate-it
description: Rate a codebase, module, or diff across six axes — code quality, performance, design (frontend), system design, technical debt, and overall — each scored /100 with evidence and fair justification, tracked against the project's own rating history over time. Use when the user says "/rate-it", "rate this", "score this code", "how good is this", or wants a quality report before/after work. Never modifies the code being rated — its one write is appending to the project's own rate-it.md baseline.
---

# Rate It

Score the target across six axes, each with evidence and a fair justification. This is a measurement tool, not a fix tool — never modify the code being rated. Its only write is appending to the target project's own `docs/rate-it.md`, so every rating has a baseline to compare against.

## The axes (score each 0-100)

| Axis | What it measures |
|---|---|
| **Code quality** | Readability, naming, cohesion, DRY, type safety, error handling, consistency, test coverage/quality |
| **Performance** | N+1 queries, missing indexes/caching, unbounded work, payload sizes, render/bundle cost |
| **Design (frontend)** | Visual hierarchy, intentionality, consistency, accessibility, responsive behavior. Skip with `n/a` if the target has no UI — do not invent a score. |
| **System design** | Module boundaries, separation of concerns, data flow, single sources of truth, blast radius of change |
| **Technical debt** | Volume and riskiness of shortcuts, TODOs, `ponytail:` markers, stale docs, missing tests on risky paths. Higher score = LESS debt. |
| **Overall** | Not an average — your judgement of "how confident would a senior engineer be shipping and maintaining this", informed by the five above |

## Fairness rules (the whole point)

1. **Every score comes with the reason it isn't higher AND why it isn't lower.** A number without both directions is a vibe.
2. **Rate constrained code fairly.** If something can't realistically be better (framework limitation, third-party API shape, a deliberate documented shortcut), still rate what's there — but say the constraint explicitly: "72: the polling design costs performance, but the upstream API offers no webhook; within that constraint this is a reasonable implementation."
3. **Evidence or it doesn't count.** Every deduction cites file:line or a measurable observation. No "feels messy".
4. **The realistic ceiling is ~92-95, not 100.** The last few points are judgement calls a strict reviewer will always take. Do not chase them and do not award 100.
5. **Say what is already done right** — especially things commonly flagged wrongly (e.g. `timingSafeEqual`, an idempotency guard), so a future "fix" doesn't break them.

## Process

1. **Check for a baseline first.** Look for `docs/rate-it.md` (or wherever the project already keeps it — check `CLAUDE.md` for a pointer) in the target repo. If one exists, read its most recent entry before doing anything else. This rating must report what changed since, not just a fresh number in isolation — that's the entire point of keeping the file.
2. Establish scope: whole repo, one module, or a diff. For a whole repo, read the docs/entry points first (`CLAUDE.md`, `README`, main modules), then sample the riskiest paths (money, auth, concurrency) — do not read every file. If a baseline exists, prioritize re-checking its "Top 3 fixes" and "Still open" items over re-deriving everything from scratch.
3. For large scope, spawn one fresh-context subagent per heavy axis (quality / performance+system-design / debt) and aggregate; for small scope, rate inline. A fresh rater must not be the author of the code being rated.
4. Score each axis with 2-4 evidence bullets (the deductions) + 1-2 "already right" bullets. Verify claims live where cheap (run the tests, grep for the pattern) rather than trusting the baseline's memory of them.
5. Rank the top 3 highest-impact fixes across all axes — impact per effort, not severity theater.
6. **Append the result to `docs/rate-it.md`** in the target repo (create it, with a one-line header explaining its purpose, if this is the first rating). Never overwrite a prior entry — each rating is a new dated section, oldest first, so the file itself is the history. If the project has no `docs/` convention, ask where it should live instead of guessing.

## Output format

```
## Rating: <target> (<date>, commit <hash if applicable>)

| Axis | Score | One-line reason |
|---|---|---|
| Code quality | NN/100 | ... |
| Performance | NN/100 | ... |
| Design (frontend) | NN/100 or n/a | ... |
| System design | NN/100 | ... |
| Technical debt | NN/100 | ... |
| **Overall** | **NN/100** | ... |

### Delta vs previous rating (omit this section entirely if no baseline existed)
- <axis>: NN → NN — <what specifically moved and why, citing the fix or the regression>
- Fixes from last time's "Top 3": <done / still open / partially done, with evidence>

### Evidence (per axis, file:line)
### Constraints acknowledged (rated fairly despite)
### Already right (do not "fix")
### Top 3 fixes (ranked by impact per effort)
```

## Re-rating

Every rating after the first is automatically a re-rating once step 1 finds a baseline — there is no separate mode to invoke. If the work being re-rated was done in THIS session, that's fine for the rating itself (rate-it isn't authoring the fixes), but for a second opinion on contested scores, use a fresh context or subagent that didn't do the fixing.
