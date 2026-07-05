# Commit Type Reference (secondary)

Use only when `git log` has no clear precedent for the change kind.

| Type       | Use when                                                                               |
| ---------- | -------------------------------------------------------------------------------------- |
| `feat`     | New logic, components, APIs, layers, or user-facing behavior                           |
| `fix`      | Something broken or incorrect                                                          |
| `docs`     | README, comments, or docs only — no code behavior change                               |
| `style`    | Presentation or formatting only — CSS, fonts, class order, whitespace; no logic change |
| `refactor` | Restructure without new feature or bug fix                                             |
| `perf`     | Measurable performance improvement                                                     |
| `test`     | Test-only changes                                                                      |
| `chore`    | Tooling, `.gitignore`, package management, CI, project setup                           |
| `build`    | Build or deployment config — prefer over `chore` when adjusting deploy settings        |

This repo uses `build` in the log; match that precedent for deploy-related config changes.
