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

## When to save

- The user explicitly asks ("save this", "remember this").
- A durable fact about the user, a client, a project, or a tool emerges that future sessions in OTHER projects would need. Project-local facts belong in that project's CLAUDE.md instead.
- A lesson was learned the hard way (a gotcha, a wrong approach, a decision with rationale).
