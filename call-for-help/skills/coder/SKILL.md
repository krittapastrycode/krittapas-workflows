---
name: coder
description: Call only the coder agent - implementation with Karpathy discipline and ponytail minimalism, self-checked before handoff. Use when the user invokes /call-for-help:coder with a specific implementation task and does not need the full team loop.
---

# Call for Help: Coder

Spawn just the implementation specialist for the task given in the arguments.

## What to do

1. If no task was given, ask for one.
2. Build a self-contained prompt (the agent starts cold):
   - The task and its acceptance criteria — if the user gave none, state the obvious verifiable criterion yourself ("build passes", "the endpoint returns X") so the coder has something to check against
   - Exact file paths and repo location when known
   - Constraints: what must not change, existing conventions to follow
3. Spawn the `krittapas-workflows:coder` agent with that prompt.
4. Relay its handoff note in full: what changed, how it was verified (with real output), assumptions made, declared shortcuts.

## Rules

- No review is included in this path. If the change touches money, auth, user data, or concurrency, recommend /call-for-help:qa-reviewer on the result — one line, then respect the user's choice.
- Do not edit the coder's work yourself after it returns; send follow-up fixes back through another /call-for-help:coder invocation so the handoff trail stays honest.
