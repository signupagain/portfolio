---
name: authoring-rules-skills
description: >-
  Author or update Cursor project rules (.cursor/rules/*.mdc) and skills
  (.cursor/skills/*/SKILL.md). ALWAYS read this skill before creating or editing
  rules or skills. Use when adding rules, skills, AGENTS.md, .mdc guidance, or
  when the user asks how to structure Cursor agent instructions.
---

# Authoring Rules and Skills

## Required reading (before writing)

Read these in order, then this skill:

1. Built-in skill `create-rule` at `~/.cursor/skills-cursor/create-rule/SKILL.md` — format, frontmatter, scope (`alwaysApply` / `globs`)
2. Built-in skill `create-skill` at `~/.cursor/skills-cursor/create-skill/SKILL.md` — layout, description, progressive disclosure
3. Existing project examples under `.cursor/rules/` and `.cursor/skills/` for tone and density

Prefer opening those files with the Read tool (or a short CLI such as `ls` / `rg`) over recreating guidance from memory.

## Language

- **All rule and skill content must be English** — frontmatter, titles, body, examples, and comments inside those files.
- User-facing chat may still follow project response-language rules; this constraint applies only to rules/skills artifacts.

## Prefer CLI when it is enough

If a step can be done reliably with a short CLI invocation, **use the CLI instead of a long prose procedure or custom script**.

Examples:

| Goal                       | Prefer                                      |
| -------------------------- | ------------------------------------------- |
| Test ignore match          | `git check-ignore -v -- <path>`             |
| Format a single file       | `npx prettier --write <path>`               |
| Lint-fix a rule/skill file | `npx eslint --fix <path>` (when configured) |
| List existing rules/skills | `ls .cursor/rules` / `ls .cursor/skills`    |

Only add helper scripts when CLI alone is fragile, repetitive, or error-prone.

## Placement

| Artifact | Path                             |
| -------- | -------------------------------- |
| Rule     | `.cursor/rules/<name>.mdc`       |
| Skill    | `.cursor/skills/<name>/SKILL.md` |

Never author into `~/.cursor/skills-cursor/` (Cursor built-ins).

## Checklist

- [ ] Built-in create-rule / create-skill skills were read
- [ ] Content is English throughout
- [ ] Rule: correct `description`, `alwaysApply` or `globs`, under ~50 lines when possible
- [ ] Skill: third-person `description` with WHAT + WHEN; body under 500 lines
- [ ] CLI preferred over verbose manual steps where equivalent
