---
name: orchestrator
description: Call only the orchestrator agent - planning, task breakdown, and delegation management without immediately starting the full loop. Use when the user invokes /call-for-help:orchestrator to get a plan, arbitrate conflicting findings, or manage a revise-until-approved cycle on existing work.
---

# Call for Help: Orchestrator

Spawn just the planner/arbitrator for the situation given in the arguments.

## What to do

1. Determine which of its jobs is being asked for:
   - **Plan**: break a request into tasks with verifiable done-conditions (it will interview via /grill-me if requirements are thin)
   - **Arbitrate**: qa-reviewer findings came back and someone must decide what goes back to the coder — pass it the findings table and the coder's position
   - **Final check / revise loop**: work exists, review exists; it drives CRITICAL/HIGH findings back through coder → qa-reviewer until the verdict is APPROVE, consulting the user on any finding disputed twice
2. Build a self-contained prompt: the request or the current state (what was built, what the review said), acceptance criteria, repo paths, and how far the user wants it to go (plan only vs. run the loop to completion).
3. Spawn the `krittapas-workflows:orchestrator` agent with it.
4. Relay its output: the plan (or verdict), what it delegated, what remains, and any question it needs the user to answer.

## Rules

- The orchestrator never writes or reviews code itself — if the user actually wants code changed right now with no planning, point them to /call-for-help:coder instead of spawning this.
- "Plan only" is a valid, complete outcome. Do not let it start delegating work the user only asked to have planned.
