# krittapas-workflows

A personal agent team for Claude Code: three roles with curated skill loadouts, placed so no two agents burn tokens invoking the same skill on the same work.

## The team

| Agent | Model | Job | Skill loadout |
|---|---|---|---|
| `orchestrator` | opus | Clarifies requirements, plans, delegates, arbitrates findings, reports | `/grill-me`, `/to-issues`, `/management-talk`, `/handoff` |
| `coder` | sonnet | Implements with Karpathy + ponytail discipline baked in, self-checks before handoff | `/tdd`, `/debug-mantra`, `/post-mortem`, `/ponytail-debt` |
| `qa-reviewer` | sonnet | Fresh-context verification against the original acceptance criteria; never reviews its own work | `/scrutinize`, `/ponytail-review` |

Plus four skills:

- **`second-brain`** — read/write the persistent Obsidian vault (`~/second-brain`) so durable knowledge outlives the session.
- **`level-up`** — after a caught mistake (not every prompt), distill the pattern into one lesson file in the vault. Lessons are recall material, never a growing pre-flight checklist — mistakes stay cheap.
- **`rate-it`** — score a repo/module/diff across six axes (code quality, performance, frontend design, system design, technical debt, overall), each /100 with evidence and fair justification — constrained code is rated within its constraints, stated explicitly. Read-only.
- **`fav-skills`** — show/manage a favorites list of skills in one hand-editable markdown file (`~/.claude/fav-skills.md`), grouped under category headers.

## Design rules

- **Skills are placed per role, not restricted per role.** Any agent *could* invoke any skill; the loadouts exist so the same check doesn't run 4 times on one piece of work. Coder self-checks (`/debug-mantra`, ponytail discipline), then qa-reviewer re-checks with *different* lenses (`/scrutinize`, `/ponytail-review`) in a fresh context.
- **Authoring and review never share a context.** The qa-reviewer is spawned fresh and never reviews code it wrote — author bias is the whole reason it exists.
- **Delegation prompts are self-contained.** Subagents start cold; the orchestrator hands them everything they need.
- **Instructions are long but simple.** Written to be executed by Opus and Sonnet, not admired by humans.

## Install

```bash
claude plugin marketplace add krittapastrycode/krittapas-workflows
claude plugin install krittapas-workflows@krittapas-workflows
claude plugin install call-for-help@krittapas-workflows
```

**Restart the Claude Code session after install or update** — plugins register at session start, not mid-session.

## Usage

**Skills** — namespaced slash commands, invoke directly:

```
/krittapas-workflows:second-brain
/krittapas-workflows:level-up
/krittapas-workflows:rate-it
/krittapas-workflows:fav-skills                 (show the list)
/krittapas-workflows:fav-skills add <skill> [category]
/krittapas-workflows:fav-skills remove <skill>
```

**Agents** — triggered via the `call-for-help` companion plugin (thin wrapper skills that spawn them cold with a self-contained brief):

```
/call-for-help:everyone <task>       full loop: plan → code → fresh review → revise until APPROVE
/call-for-help:coder <task>          implementation only, no review attached
/call-for-help:qa-reviewer <target>  fresh-context review only (scrutinize + ponytail-review + criteria check)
/call-for-help:orchestrator <ask>    plan / arbitrate findings / drive the revise loop on existing work
```

There is no bare `/call-for-help` — plugin commands are always `plugin:command`; `:everyone` is the call-the-whole-team form. Agents can also be invoked without the wrappers: ask by name ("use the orchestrator agent to…") or via the Agent/Task tool with `subagent_type: krittapas-workflows:orchestrator` (also `:coder`, `:qa-reviewer`). Run `/agents` to confirm all three registered.

**Updating after a change:** bump `version` in `.claude-plugin/plugin.json`, push, then:

```bash
claude plugin marketplace update krittapas-workflows
claude plugin update krittapas-workflows@krittapas-workflows
```

`claude plugin update` alone will report "already at latest" against a stale marketplace clone — run `marketplace update` first.

## Validate

```bash
node scripts/validate.mjs
```

Checks the plugin manifest, the fixed 3-agent roster, frontmatter, and required docs. Exits non-zero with a problem list if anything is malformed.

## Third-party skills referenced (not vendored)

Loadouts reference these by name; install them separately:

- [mattpocock/skills](https://github.com/mattpocock/skills) — `grill-me`, `tdd`, `to-issues`, `handoff`
- [thananon/9arm-skills](https://github.com/thananon/9arm-skills) — `debug-mantra`, `scrutinize`, `post-mortem`, `management-talk`
- [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) — `ponytail-review`, `ponytail-debt`
- [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) — coding guidelines (inlined into the coder's discipline section)

If a referenced skill is missing, agents fall back to the inlined discipline rules in their own instruction files — the loadout degrades, it doesn't break.

## License

MIT — see [LICENSE](LICENSE).
