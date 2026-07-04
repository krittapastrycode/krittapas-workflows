---
name: level-up
description: Learn from a caught mistake by writing the lesson to the second-brain vault, so future sessions avoid the same pattern without becoming over-cautious. Use when the user says "/level-up", "level up", or "learn from this", at the end of a significant work session, or proactively right after a real mistake is confirmed (the user corrected you, a fix turned out wrong, or qa-reviewer bounced the same work twice). Do NOT run on every prompt or after routine successful work.
---

# Level Up

Turn a caught mistake into a written lesson that future sessions actually recall. The loop is: mistake → lesson file → recalled when relevant. It is NOT: mistake → new mandatory checklist → validate everything forever.

## The core stance

Mistakes must stay cheap. An agent that fears mistakes never stops validating, and an agent that never stops validating never ships. So:

- Record the **pattern**, not a rule. "I assumed the API route existed without reading the controller" is a pattern. "Always read every controller before answering anything" is paralysis.
- One mistake = at most one lesson. If the mistake doesn't generalize, write nothing.
- Lessons are recall material, not pre-flight checks. Never convert a lesson into a mandatory step that runs on every task.

## When invoked

1. **Identify the actual mistake.** Not the symptom — the decision that caused it. Ask: what did I believe that was wrong, and what evidence was available at the time that I skipped? If the honest answer is "nothing — the information wasn't available", there is no lesson; say so and stop.
2. **Check it generalizes.** Will this same wrong turn plausibly recur in a different task? One-off trivia (a typo, a flaky network call) is not a lesson. Stop if it doesn't generalize.
3. **Check for an existing lesson.** Read the vault `INDEX.md` (vault location and rules: see the `second-brain` skill in this plugin). If a lesson covering this pattern exists, sharpen that file instead of writing a duplicate.
4. **Write one lesson file** to `concepts/` in the vault, following the vault's own rules (one lesson per file, one-line summary on top, `[[link]]` to related pages, source note). Include:
   - The wrong belief and the moment it was formed
   - What evidence would have corrected it, and how cheap that evidence was
   - The pattern to recall — phrased as "when X, check Y", not "always do Z"
5. **Update `INDEX.md`** with the one-line entry.
6. **Prune while you're there.** If any existing lesson is now wrong, superseded, or has never been relevant since written — delete it. A short, sharp lesson list beats a long defensive one.

## How lessons get used later

Nothing extra to do — recall is already wired. Project `CLAUDE.md` files point at the vault, and sessions read `INDEX.md` and follow links when a topic is relevant. A lesson costs zero tokens until the situation it names actually comes up.

## What this skill must never become

- A per-prompt reflex. Reflecting on every exchange costs more than the lessons are worth.
- A growing validation gauntlet. If the lesson list starts reading like a checklist an agent must clear before acting, prune it hard.
- A place to store successes. Confirmed-good approaches belong in the vault too, but that's ordinary `second-brain` compilation, not a level-up. This skill is specifically for mistakes.
