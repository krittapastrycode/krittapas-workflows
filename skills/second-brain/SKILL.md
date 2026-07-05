---
name: second-brain
description: Read from and write to the personal Obsidian second-brain vault (persistent cross-project memory). Use when the user says "save to second brain", "remember this", "check the vault", "what do we know about X", or when durable facts (profile data, project knowledge, lessons) should outlive the session.
---

# Second Brain (Obsidian Vault)

The vault lives at `C:\Users\capto\second-brain`. It is local-only, git-versioned, and never synced through OneDrive/cloud (sync + concurrent agent writes corrupt files).

Treat the vault like a codebase: `raw/` is ground truth, `entities/` and `concepts/` are the compiled layer maintained on top of it.

## Structure

```
second-brain/
├── raw/        # captured material, append-only: transcripts, notes, exports. NEVER edit or delete existing files here.
├── entities/   # one page per concrete thing: a person, client, tool, project, competitor
├── concepts/   # one page per idea: a strategy, pattern, lesson, decision
├── INDEX.md    # every page, one line each - ALWAYS check this first
└── CLAUDE.md   # the vault's own operating rules (authoritative if this skill ever disagrees)
```

## Reading (cost discipline)

1. Never sweep the whole vault. Read `INDEX.md` first, follow `[[wikilinks]]`, or Grep for keywords.
2. For broad questions spanning many pages, delegate to a subagent that reads in its own context and returns a short summary.

## Writing rules

1. One fact/lesson per file, with a one-line summary as the first line.
2. Before creating a page, check `INDEX.md` - update the existing page instead of duplicating.
3. Every `entities/` or `concepts/` page must link its source: a `[[wikilink]]` to a `raw/` file, or an explicit repo path (see live-repo exception). Link at least one related page.
4. After creating or updating any page, add/update its one-line entry in `INDEX.md`. A page not in the index does not exist.
5. Delete pages that turn out to be wrong. Stale notes are worse than no notes.
6. Never store secrets, credentials, or sensitive personal documents (ID numbers, passports, financial data) in the vault.

## Live-repo exception

A project that is an actively developed git repo already has its own memory (git history, README, CLAUDE.md). Do NOT copy its source or docs into `raw/` - that duplicates content that will drift stale. Instead write an `entities/` page that summarizes and cites the real repo path as its source, and re-read the repo directly when the summary might be outdated.

## Code-graph pages (function-level system maps)

When the user wants a codebase mapped at function/endpoint granularity, build a **folder tree** under `entities/` - detailed enough to answer "what does this function do, what's wrong with it, what does it call" without opening the repo, cheap enough for a future session to read:

```
entities/<project>/
├── <project>.md                      # product hub
└── <repo>/
    ├── <repo>.md                     # repo hub → module hubs
    └── <module>/
        ├── <module>.md               # module hub → function notes
        └── <module>-<function>.md    # ONE function = ONE note
```

1. **One function = one note**, filename module-prefixed (`payments-create-charge.md`) so `[[wikilinks]]` stay unique vault-wide (`create` exists in many modules). Hub note at every level linking down.
2. A function note is ≤ ~12 lines: first-line summary (route → service.method) → what it does → `Problem:` / `Fixed <date>:` only if real → `[[edges]]` to related notes → source path + read date.
3. Trivial sibling one-liners MAY share a note (e.g. four mark-read endpoints) - the goal is graph clarity, not ceremony.
4. Only record what the code doesn't say about itself: behavior, cross-module edges, known bugs/ceilings, contract mismatches. No code snippets, no line numbers (they rot fastest).
5. **INDEX.md lists ONLY hubs** (project/repo/module), never individual function notes - otherwise the index explodes.
6. Findings that span the whole system (review verdicts, severity-ranked bug lists, cost analysis) go in ONE dated `concepts/` page linked from the hubs, not scattered across notes.
7. The graph is a map, not the territory - re-read the repo when a note smells stale; update the module's notes when the module changes.

Example: [[baantdee]] → [[baantdee-backend]] → [[payments]] → [[payments-create-charge]]; findings in [[baantdee-system-review-2026-07]].

## When to save

- The user explicitly asks ("save this", "remember this").
- A durable fact about the user, a client, a project, or a tool emerges that future sessions in OTHER projects would need. Project-local facts belong in that project's CLAUDE.md instead.
- A lesson was learned the hard way (a gotcha, a wrong approach, a decision with rationale).
