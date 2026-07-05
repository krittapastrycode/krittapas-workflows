---
name: everyone
description: Call the whole agent team on a task - spawns the orchestrator, which plans, delegates implementation to coder, routes results to qa-reviewer, and loops fixes until the work passes. Use when the user invokes /call-for-help:everyone or says "call the team" / "call everyone" with a task.
---

# Call for Help: Everyone

Trigger the full team loop on the task given in the arguments.

## What to do

1. If no task was given in the arguments, ask for one — do not spawn agents with an empty brief.
2. Gather what the orchestrator needs into one self-contained prompt (it starts cold, it cannot see this conversation):
   - The task, verbatim
   - The repo/working directory and any file paths already known
   - Any acceptance criteria the user stated, plus constraints (deadline, don't-touch areas)
3. Spawn the `krittapas-workflows:orchestrator` agent with that prompt.
4. When it returns, relay its report: what shipped, what was verified, what was deferred. Do not re-review the work yourself — the loop already contains a fresh-context reviewer.

## The loop you are triggering (runs inside the orchestrator)

Plan → delegate to `coder` → coder self-checks and hands off → fresh `qa-reviewer` verifies against the ORIGINAL acceptance criteria → CRITICAL/HIGH findings go back to the coder verbatim → re-review → repeat until APPROVE (or the user is consulted on a twice-disputed finding). The orchestrator does the final check and only reports done when the reviewer has approved.

## Rules

- One spawn per invocation: the orchestrator, never the coder or reviewer directly — role separation is the point of the team.
- If the orchestrator reports it could not spawn sub-agents in its context, relay that and offer to run the roles one at a time via /call-for-help:coder and /call-for-help:qa-reviewer instead.
