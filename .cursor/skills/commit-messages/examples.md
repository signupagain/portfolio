# Commit Message Examples

Curated reference for **how to phrase** subjects well. Type, scope, and tone still come from live `git log` neighbors — this file does not replace them.

Use these when the log shows the right `type(scope)` but the subject wording is weak, redundant, or bundles unrelated work.

## What makes a good subject

| Principle                             | Good                                                                       | Weak                                                                |
| ------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| One intent                            | `fix(file-browser): prevent text selection in header`                      | `fix(file-browser): streamline delete and improve skeleton loading` |
| User-visible or architectural outcome | `feat(file-browser): add drag area selection for virtual grid items`       | `feat(file-browser): implement pinia store and utility functions`   |
| No scope echo                         | `feat(speed-dials): add SpeedDials layer`                                  | `feat(file-browser): initialize file-browser`                       |
| Specific, not generic                 | `fix(vue-tsc): update vue-tsc to fix missing type error`                   | `fix(test): resolve tsconfig, dependency and test project issues`   |
| Imperative, lowercase start           | `refactor(file-browser): extract click selection into useClick composable` | `Updated file browser selection logic`                              |

## feat — new behavior

```
feat(file-browser): add drag area selection for virtual grid items
feat(gallery): add server API routes for pexels integration
feat(gallery): add GalleryCard component
feat(intro): add landing work experience component
feat(speed-dials): add SpeedDials layer
feat(cursor/skills): add commit message skill aligned with repo log conventions
feat(cursor/rules): introduce strict import rules to align with package.json dependencies
feat(colorModeBtn): add layer to toggle light and dark mode
```

**Why these work:** each names one deliverable — a component, route, layer, or rule — without repeating the scope or stacking unrelated additions.

## fix — incorrect or broken behavior

```
fix(Card.vue): replace UIcon with LazyUIcon for consistency in component usage
fix(file-browser): remove hydrate-on-idle from drawer card to eliminate render delay
fix(file-browser): prevent text selection in header and main sections
fix(mdc): add missing @nuxtjs/mdc dependencies
fix(vue-tsc): update vue-tsc to fix missing type error
fix(nuxt): pin nuxt to 4.3.1 to avoid IPC error
```

**Why these work:** they state what was wrong or what changed to restore correct behavior. Split unrelated fixes into separate commits instead of combining delete flow and skeleton loading in one subject.

## refactor — same behavior, clearer structure

```
refactor(file-browser): extract click selection into useClick composable
refactor(file-browser): extract shared toDisplayedItem mapper
refactor(file-browser): rename fileTypes to fileExtensionSpecs
```

**Why these work:** the outcome is structural — extract, rename, move — with no new user-facing feature.

## chore — tooling and dependencies

```
chore(pkg): add pinia dependency
chore(pkg): remove ms dependency
chore(pkg): update nuxt and @nuxt/ui dependencies
chore(eslint): integrate eslint-config-prettier for improved code formatting
chore(content): configure pnpm for sqlite3 compatibility
```

**Why these work:** dependency and tooling changes use `chore(pkg)` or the specific tool scope; the subject names the package or config touched.

## perf — measurable improvement

```
perf(dev): narrow Vite file watch scope in dev server
perf(intro): enable prerender for intro landing routes
```

**Why these work:** they describe the performance goal (less watching, faster first paint), not only the config key changed.

## style — presentation only

```
style(Aside.client.vue): correct class order for consistent styling
style(font): add Noto Sans TC and Noto Serif SC fonts
```

**Why these work:** CSS, class order, or font assets with no logic change. Component file scopes apply when the edit is localized to one `.vue` file.

## build — deploy and build config

```
build(gallery): adjust nuxt.config.ts for Netlify deployment
```

**Why this works:** deploy-target config belongs in `build`, not `chore`, when the log already uses that precedent.

## Weak log phrasing → improved subject

Real log entries that illustrate common mistakes. Prefer the **Improved** column when drafting; split into two commits when the weak line bundled unrelated work.

| Weak (from log)                                                                         | Problem                 | Improved                                                                                                                    |
| --------------------------------------------------------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `feat(file-browser): initialize file-browser`                                           | Repeats scope           | `feat(file-browser): scaffold layer with layout and entry page`                                                             |
| `feat(file-browser): implement pinia store and utility functions`                       | Two deliverables        | `feat(file-browser): add pinia store for selection state` (+ separate commit for utils if needed)                           |
| `feat(graphify): add graphify rules and update .gitignore for output directory`         | Unrelated concerns      | Two commits: `feat(graphify): add graphify cursor rules` and `chore(graphify): gitignore graphify-out directory`            |
| `feat(gallery): intergrate SpeedDials into gallery-id page`                             | Typo; vague page name   | `feat(gallery): embed speed-dials on gallery detail page`                                                                   |
| `feat(intro): add description of file-browser layer`                                    | Awkward wording         | `feat(intro): add file-browser layer description block`                                                                     |
| `fix(file-browser): streamline delete functionality and improve skeleton loading logic` | Two fixes               | `fix(file-browser): confirm before deleting selected items` and `fix(file-browser): show skeleton while virtual grid loads` |
| `fix(test): resolve tsconfig, dependency and test project issues`                       | Laundry list            | `fix(test): align tsconfig paths with nuxt test setup`                                                                      |
| `perf(intro): add prerender:true in nuxt.config`                                        | Config key, not outcome | `perf(intro): enable prerender for intro landing routes`                                                                    |
| `perf(dev): reduce the monitoring range of Vite`                                        | Vague                   | `perf(dev): narrow Vite file watch scope in dev server`                                                                     |
| `feat(cursor/rules): add rule to enforce Prettier and ESLint config compliance.`        | Trailing period; long   | `feat(cursor/rules): enforce prettier and eslint on save via cursor rule`                                                   |

## When to split commits

If the diff would need **and** between two unrelated outcomes in the subject, split:

```
# Bad — one commit
feat(file-browser): add intro component and data-seed module

# Good — two commits
feat(file-browser): add intro component
feat(file-browser): add data-seed module for demo file tree
```

Exception: use `and` only when both edits are one inseparable change (e.g. `fix(nuxt): pin nuxt and @nuxt/ui to compatible versions`).

## Validate

Optional check against repo pattern:

```bash
node .cursor/skills/commit-messages/scripts/validate-subject.mjs "feat(file-browser): add intro component"
```
