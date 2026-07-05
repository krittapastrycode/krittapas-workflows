// Validates the plugin structure. Run: node scripts/validate.mjs
// Exits 1 with a list of problems, 0 if the plugin is well-formed.
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

function requireFile(rel) {
  const p = join(root, rel);
  if (!existsSync(p)) errors.push(`missing file: ${rel}`);
  return p;
}

function requireJson(rel, requiredKeys) {
  const p = requireFile(rel);
  if (!existsSync(p)) return null;
  let data;
  try {
    data = JSON.parse(readFileSync(p, "utf8"));
  } catch (e) {
    errors.push(`${rel}: invalid JSON (${e.message})`);
    return null;
  }
  for (const key of requiredKeys) {
    if (!(key in data)) errors.push(`${rel}: missing key "${key}"`);
  }
  return data;
}

function requireFrontmatter(rel, requiredKeys) {
  const p = requireFile(rel);
  if (!existsSync(p)) return;
  const text = readFileSync(p, "utf8");
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) {
    errors.push(`${rel}: missing YAML frontmatter block`);
    return;
  }
  for (const key of requiredKeys) {
    if (!new RegExp(`^${key}\\s*:`, "m").test(m[1]))
      errors.push(`${rel}: frontmatter missing "${key}"`);
  }
  if (text.replace(m[0], "").trim().length < 200)
    errors.push(`${rel}: body too short to be a real instruction file`);
}

// Plugin manifest + marketplace entry
requireJson(".claude-plugin/plugin.json", ["name", "version", "description", "author"]);
const marketplace = requireJson(".claude-plugin/marketplace.json", ["name", "owner", "plugins"]);
if (marketplace && (!Array.isArray(marketplace.plugins) || marketplace.plugins.length === 0))
  errors.push(".claude-plugin/marketplace.json: plugins must be a non-empty array");

// Agents: exactly the three roles, each with usable frontmatter
const expectedAgents = ["orchestrator.md", "coder.md", "qa-reviewer.md"];
for (const f of expectedAgents) requireFrontmatter(join("agents", f), ["name", "description"]);
if (existsSync(join(root, "agents"))) {
  const extra = readdirSync(join(root, "agents")).filter(
    (f) => f.endsWith(".md") && !expectedAgents.includes(f)
  );
  for (const f of extra) errors.push(`agents/${f}: unexpected agent (roster is fixed at 3 roles)`);
}

// Skills
requireFrontmatter("skills/second-brain/SKILL.md", ["name", "description"]);
requireFrontmatter("skills/level-up/SKILL.md", ["name", "description"]);
requireFrontmatter("skills/rate-it/SKILL.md", ["name", "description"]);
requireFrontmatter("skills/fav-skills/SKILL.md", ["name", "description"]);

// call-for-help companion plugin (agent-invocation wrapper skills)
requireJson("call-for-help/.claude-plugin/plugin.json", ["name", "version", "description", "author"]);
for (const s of ["everyone", "coder", "qa-reviewer", "orchestrator"])
  requireFrontmatter(join("call-for-help", "skills", s, "SKILL.md"), ["name", "description"]);

// Docs
requireFile("README.md");
requireFile("LICENSE");

if (errors.length) {
  console.error(`FAIL (${errors.length} problems)`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log("OK: plugin structure valid");
