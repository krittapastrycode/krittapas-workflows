---
name: fav-skills
description: Show or manage the user's favorite-skills list — a plain markdown file of skills grouped under category headers. Use when the user says "/fav-skills" (show the list), "/fav-skills add <skill> [category]" or "fav-skill add" (append a skill to the list), or asks "what are my favorite skills". The list file is user-editable by hand too.
---

# Fav Skills

A favorites list for skills, kept in one plain markdown file the user can also edit by hand.

**The list file:** `C:\Users\capto\.claude\fav-skills.md` — lives outside any plugin so it survives plugin updates and reinstalls.

## Behavior

**Invoked with no arguments → show the list.**
Read the file and print it as-is (it's already human-formatted). If the file doesn't exist yet, create it with this starter content, then show it:

```markdown
# Fav Skills

## QA-Testing
- /scrutinize
- /ponytail:ponytail-review

## Planning
- /grill-me
```

**Invoked with `add <skill> [category]` → append to the list.**
1. Read the file (create with the starter content first if missing).
2. If the skill is already anywhere in the list, say where it is and stop — no duplicates.
3. Pick the category: use the one given; otherwise infer the best fit from the existing headers; if nothing fits, add it under `## Uncategorized`.
4. Append `- <skill>` under that header (create the header if new), preserving everything else in the file byte-for-byte.
5. Show the updated section so the user sees where it landed.

**Invoked with `remove <skill>` → delete that line**, leave everything else untouched. If removing the last entry under a header, remove the empty header too.

## Rules

- Never reorder, reformat, or "clean up" the file beyond the single requested change — the user hand-edits this file and their formatting wins.
- Skill names are stored exactly as the user writes them (`/scrutinize`, `/ponytail:ponytail-review` — with or without namespace).
- This file is a list, not documentation. Don't add descriptions next to entries unless the user wrote them there.
