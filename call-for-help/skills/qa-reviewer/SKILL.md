---
name: qa-reviewer
description: Call only the qa-reviewer agent - a fresh-context review that runs correctness tracing (scrutinize) plus over-engineering hunting (ponytail-review) with severity-rated, file:line-cited findings. Use when the user invokes /call-for-help:qa-reviewer to review a diff, branch, or recent work without the full team loop.
---

# Call for Help: QA Reviewer

Spawn just the reviewer, in a fresh context, for the work named in the arguments.

## What to do

1. Identify what is being reviewed. The reviewer refuses to work without:
   - **The diff or changed-file list** — if the user didn't specify, derive it (`git diff`, `git status`, or the files just touched this session) and pass it explicitly
   - **The original acceptance criteria** — what was this change supposed to do? If unknown, ask the user one question rather than letting the review degrade into style comments
   - The author's handoff note / assumptions, when one exists
2. Build a self-contained prompt containing all three, plus repo location.
3. Spawn the `krittapas-workflows:qa-reviewer` agent with it.
4. Relay the verdict (APPROVE / WARN / BLOCK) and the findings table verbatim — do not soften severities or drop LOW findings.

## Why this reviewer over running /scrutinize or /ponytail-review directly

It layers both of those lenses in one pass and adds what they don't do alone: verification against the original acceptance criteria, severity ratings with a mechanical verdict, a check of the author's claimed test output, and explicit confirmation of things done RIGHT so they don't get "fixed" later. Use the standalone skills for quick spot-checks; use this for a real review.

## Rules

- Fresh context is the point: if the work being reviewed was authored in THIS session, that's fine — the spawned agent doesn't inherit this conversation and reviews cold.
- Findings come back, fixes don't. Route fixes through /call-for-help:coder or the full /call-for-help:everyone loop.
