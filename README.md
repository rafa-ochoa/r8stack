# r8stack

**An engineering system for AI agents: judgment, enforceable guardrails, real verification, and measured learning.**

`r8stack` is deliberately not a software factory that auto-publishes work: agents execute scoped work, the system makes quality checks enforceable, and humans retain approval over consequential actions.

Seven focused skills help coding agents build useful changes, establish real evidence, prevent repeated failures, and stop safely. They work with Codex, Claude Code, and other compatible coding agents. Install one when it fits, or install the collection.

![Map of all seven r8stack skills: optional delivery-flow prepares handoffs, judgment-led-delivery builds, verified-delivery checks the diff, and four supporting skills handle test proof, guardrails, efficiency and skill revisions. External actions require owner authorization.](docs/assets/r8stack-system.svg)

All seven skills in the map are available in this repository. The opt-in evaluation comparison runner now checks fixed, repeated baseline/candidate observations; agent-provider adapters remain deliberately out of scope until they can preserve complete evidence. The learning policy, versioned evaluation format, and human approval gate are documented and enforced by the catalog.

## How the skills fit together

The main path is deliberately small:

1. Build the user outcome with [`judgment-led-delivery`](skills/judgment-led-delivery/README.md).
2. Establish evidence with [`verified-delivery`](skills/verified-delivery/README.md).
3. Stop before merging, deploying, publishing, or changing host configuration unless the owner explicitly authorizes it.

Use the supporting skills only for their narrow jobs:

- [`verify-regression-tests`](skills/verify-regression-tests/README.md) proves a named test catches the behavior it protects.
- [`efficient-execution`](skills/efficient-execution/README.md) evaluates an optimization without weakening delivery evidence.
- [`skill-engineering`](skills/skill-engineering/README.md) decides whether repeated evidence justifies improving a skill.
- [`enforceable-guardrails`](skills/enforceable-guardrails/README.md) turns an attributable recurring failure into a narrowly scoped check at its root cause.
- [`delivery-flow`](skills/delivery-flow/README.md) is an explicit coordinator: it prepares the next prompt and handoff, but does not load or run other skills automatically.

For meaningful-risk changes, keep a reproducible feature map: exact revision, user-observable flows, verification commands, and available traces or screenshots. The included validator checks its structure without claiming that its recorded commands ran. Start with [`examples/feature-map.json`](examples/feature-map.json):

```bash
node scripts/validate-feature-map.mjs path/to/feature-map.json
```

## Claude Code workflow and Mods

Read [the Claude execution workflow](docs/claude-execution-workflow.md) for the complete operating flow: which skill owns each stage, the non-negotiable verification safeguards, and the stopping conditions that prevent endless loops.

Three companion documents turn that workflow into repeatable evidence:

- [Mod compatibility pilot](docs/mod-compatibility-pilot.md): a fill-in record and test scenarios for trialling an external Mod on a real host.
- [Skill evaluation harness](docs/skill-evaluation-harness.md): the observation format and opt-in comparison runner for fixed baseline/candidate evaluations.
- [delivery-flow acceptance criteria](docs/delivery-flow-spec.md): the states, handoffs, and route matrix the coordinator satisfies.

### Planned Mod and dashboard layer

The intended local-first extension is a read-only savings dashboard followed by independently auditable, opt-in Mods for context handoff, browser/output reduction, input routing, effort and model recommendations, and cache decisions. None of these Mods or the dashboard is installed or enabled by this catalog today. The [Mod compatibility pilot](docs/mod-compatibility-pilot.md) defines the evidence and rollback requirement before any external plugin is adopted.

### Single-entry orchestration

```text
Use delivery-flow to implement this feature. Stop before merge.
```

[`delivery-flow`](skills/delivery-flow/README.md) coordinates this flow when you explicitly invoke it. It prepares each explicit next-stage prompt and handoff; it does not load or run another skill. Expect it to:

1. Inspect the request and repository, then select only the relevant skills rather than running a fixed five-stage loop.
2. Advance to `verified-delivery` only after an implemented diff exists; run regression-test proof only when named coverage matters; evaluate Mods only when an optimization is requested.
3. Preserve decisions, changed files, checks, failures, blockers, and the next action across every handoff.
4. Stop with an evidence-backed result, an owner-needed blocker, or before a merge/deploy. It will never treat a passing check as permission to publish.

The coordinator is optional: use an individual skill whenever its narrower scope is enough. The [workflow guide](docs/claude-execution-workflow.md) defines the shared gates and boundaries.

## From a diff to a reviewable handoff

![Delivery evidence: verify the implemented revision, return confirmed defects to implementation for at most three review-and-fix rounds, and hand off the exact revision, command results, flow evidence, risks and rollback. Code changes require fresh affected checks. Owner authorization is required for external actions.](docs/assets/end-to-end-execution.svg)

`verified-delivery` checks the implemented change and records what the evidence supports. A confirmed defect returns to implementation when edits are authorized. Missing evidence remains explicit; a verdict does not authorize commit, push, merge or deployment.

## What happens after a recurring failure

![Recurring failure decision: fix product or tooling defects with enforceable-guardrails; assess repeated reasoning failures with skill-engineering using fixed baseline/candidate evaluations and at least three recorded runs per side. Human approval is required before promotion.](docs/assets/learning-loop.svg)

`enforceable-guardrails` protects the boundary where a failure occurs. `skill-engineering` assesses repeated reasoning failures after checking whether the fix belongs in code or tooling. The comparison runner consumes recorded observations; it does not execute an agent. Agent-provider adapters remain unimplemented.

The diagrams are editable SVG source. They describe skill responsibilities and evidence handoffs, not an automatically executed pipeline.

## Skills in this collection

Each skill is independently installable. Its README includes usage and installation instructions.

| Skill | Use it for | Result |
| --- | --- | --- |
| [judgment-led-delivery](skills/judgment-led-delivery/README.md) | Scoping and implementing a user-facing change | A working interaction with relevant behavior and UX checks |
| [verified-delivery](skills/verified-delivery/README.md) | Verifying an implemented diff | Revision-bound evidence, validated findings, risks and a readiness verdict |
| [verify-regression-tests](skills/verify-regression-tests/README.md) | Proving a named test catches its protected bug | The same test run against working, faithfully broken and restored code in isolation |
| [enforceable-guardrails](skills/enforceable-guardrails/README.md) | Preventing a demonstrated failure at its root cause | A narrow executable check with unsafe-rejected and valid-accepted proof |
| [efficient-execution](skills/efficient-execution/README.md) | Evaluating an execution optimization or Mod | A measured recommendation that preserves quality, evidence and rollback |
| [skill-engineering](skills/skill-engineering/README.md) | Assessing a skill revision after repeated reasoning failures | One bounded proposal or rejection based on fixed evaluations |
| [delivery-flow](skills/delivery-flow/README.md) | Coordinating explicitly requested stages | A next-stage prompt and intact handoff record; no automatic skill invocation |

## Install the collection

Install **all skills** globally for Codex and Claude Code:

```bash
npx skills add rafa-ochoa/r8stack -g -a codex -a claude-code -y
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

Open a project in your coding agent and begin with the skill that matches the work. For example:

> Use judgment-led-delivery to add a favorites feature using the existing UI patterns. Implement the complete interaction and verify its behavior.

After implementation, ask for evidence with:

> Use verified-delivery to verify this change before review. Do not merge.

Use `verify-regression-tests` only when you need to establish that a particular regression test would catch the bug it claims to prevent.

## Contribute

Skills are organized under `skills/`. See [CONTRIBUTING.md](CONTRIBUTING.md) for how to propose one.

The system direction and prior design inputs are reconciled in [r8stack's decision record](docs/r8stack.md).


[MIT License](LICENSE)
