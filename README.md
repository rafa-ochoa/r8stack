# r8a-skills

**A collection of reusable Agent Skills for coding agents.**

This repository brings together focused instruction packages for tools such as Codex and Claude Code. Each skill is independently installable: explore the catalog below, choose one, or install the full collection.

## Skills in this collection

### [Judgment-led delivery](skills/judgment-led-delivery/README.md)

![Judgment-led delivery: Decide, Build, Refine, Verify](skills/judgment-led-delivery/cover.svg)

**Build what's worth building. Know when not to.**

Helps coding agents assess whether a product change is useful before implementing it. The skill examines existing behavior, weighs meaningful alternatives, builds working interactions when appropriate, and verifies the user experience against actual evidence. It adapts to the task instead of requiring a heavyweight process.

### [Verified delivery](skills/verified-delivery/README.md)

![Verified delivery: Establish, Verify, Review, Release](skills/verified-delivery/cover.svg)

**Prove a change works before asking someone to merge it.**

Helps coding agents turn an implemented diff into evidence-backed, review-ready delivery. It selects risk-sensitive verification, validates independent review findings, limits review-and-fix work to three rounds, and documents rollback readiness and required approval. It complements Judgment-led delivery rather than repeating product discovery or implementation guidance.

### [Verify regression tests](skills/verify-regression-tests/README.md)

![Verify regression tests: Working, Known-bad, Restored](skills/verify-regression-tests/cover.svg)

**Prove a test detects the regression it claims to prevent.**

Helps coding agents prove that regression tests detect the behavior they claim to protect. It safely breaks a named production behavior in an isolated copy and requires an assertion-level failure before calling that coverage proof. It complements both delivery skills with focused regression-test evidence.

## Install the collection

Install **all skills** in this repository globally for Codex and Claude Code:

```bash
npx skills add rafa-ochoa/r8a-skills -g -a codex -a claude-code -y
```

Requires Node.js 22.20 or later. The command selects Codex and Claude Code directly, so there is no agent-selection screen.

- Remove `-g` to install only in the current project.
- Change the `-a` values to target different supported agents.
- To install **one skill**, use the command in that skill's README.

## Update installed skills

Update all globally installed skills, including those from this collection:

```bash
npx skills update -g -y
```

This command also updates skills from other repositories. To update a single skill, use the command in its README.

## Get started

Open a project in your coding agent and give it a task. For example:

> Use judgment-led-delivery to add a favorites feature using the existing UI patterns. Implement the complete interaction and verify its behavior.

The skill guides the agent's approach to that task; it doesn't replace your project's code, conventions, or your product decisions.

## Contribute

Skills are organized under `skills/`. See [CONTRIBUTING.md](CONTRIBUTING.md) for how to propose one.

[MIT License](LICENSE)
