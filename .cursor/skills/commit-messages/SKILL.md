---
name: commit-messages
description: >-
  Generate conventional-commit messages from this repo's git log. ALWAYS read
  this skill before drafting or running any git commit — including when the
  committing-changes user rule applies. Use when committing, staging for
  commit, or when the user asks for a commit message.
---

# Commit Messages

## Priority

1. **Primary — `git log`** — match type, scope, tone, and density from recent commits in the same area.
2. **Secondary — [types.md](types.md)** — only when the log has no clear precedent.

Curated phrasing in [examples.md](examples.md) shows strong subjects and common log mistakes; type, scope, and tone still come from live log output.

## Workflow

When the **committing-changes** user rule applies, run `git status`, `git diff`, and `git log` in parallel (per that rule). This skill adds only **how** to choose type, scope, and subject:

1. Scan `git log --format="%s" -30` for 1–3 commits in the same layer, component, or tool area.
2. Pick `type` and `scope` using the decision tree below; if unclear, consult [types.md](types.md).
3. Draft the subject, then run the self-check.

## Format

```
<type>(<scope>): <description>
```

- **Single line** — subject only; no body unless the user explicitly asks.
- **English** — imperative mood, lowercase start (`add`, `fix`, `remove`, `update`, `implement`, `integrate`, `adjust`).
- **Concise** — intent in one phrase; use `and` only for two tightly related edits in one commit.

## Quick decision (type)

| Change                                                                     | Type       |
| -------------------------------------------------------------------------- | ---------- |
| New user-visible behavior, component, layer, API                           | `feat`     |
| Broken or incorrect behavior                                               | `fix`      |
| `package.json` / lockfile dependency changes                               | `chore`    |
| Restructure, rename, extract — same behavior                               | `refactor` |
| Measurable speed or resource improvement                                   | `perf`     |
| Presentation or formatting only — CSS, fonts, class order; no logic change | `style`    |
| Build or deploy config (`nuxt.config`, Netlify, etc.)                      | `build`    |

Avoid `docs` and `test` unless the change is purely documentation or tests and no log pattern fits — then see [types.md](types.md).

## Scope

Pick the **smallest accurate scope** already used in the log for the same kind of change:

| Scope kind       | When                                          | Examples                                                                                                                          |
| ---------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Layer / module   | Cross-file or layer-wide work                 | `file-browser`, `gallery`, `intro`, `speed-dials`, `colorModeBtn`                                                                 |
| Single component | One `.vue` file, localized fix or style tweak | `Card.vue`, `Aside.client.vue`                                                                                                    |
| Tool / infra     | Dependencies, lint, build, Cursor config      | `pkg`, `eslint`, `nuxt`, `vue-tsc`, `dev`, `cursor/rules`, `cursor/skills`, `graphify`, `content`, `test`, `font`, `error`, `mdc` |

Prefer an existing log scope over inventing a new one. New layers get their own scope (e.g. `feat(file-browser):`).

## Self-check

- Matches `type(scope): description`?
- Same language and tone as recent log?
- Scope consistent with neighbors for this path or component?
- Describes **intent**, not a file list?

## Representative examples

```
feat(file-browser): add drag area selection for virtual grid items
fix(Card.vue): replace UIcon with LazyUIcon for consistency in component usage
style(Aside.client.vue): correct class order for consistent styling
feat(cursor/skills): add commit message skill aligned with repo log conventions
chore(pkg): add pinia dependency
refactor(file-browser): extract click selection into useClick composable
```

## Anti-patterns

- Generic subjects: `update code`, `fix bug`, `WIP`, `misc changes`
- Missing type/scope when the rest of the log uses them
- Capitalized sentence without conventional prefix
- File lists instead of intent: `update Header.vue and useNodes.ts`
- Chinese in the subject — log is English
- Bodies or trailers unless the user explicitly asks

## More examples

See [examples.md](examples.md) for curated subjects, weak→improved rewrites from the log, and split-commit guidance. Optional validation: `node scripts/validate-subject.mjs "<message>"`.
