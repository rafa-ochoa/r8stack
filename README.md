# r8-skills

**A collection of reusable Agent Skills for coding agents.**

Three focused skills for moving from a useful change to trustworthy delivery. They work with Codex, Claude Code, and other compatible coding agents. Install one when it fits, or install the collection.

## Start here

Use the skills as a simple delivery flow:

1. **Decide what to build** with [`judgment-led-delivery`](skills/judgment-led-delivery/README.md): clarify product scope, build the requested experience, and assess the complete user journey.
2. **Verify the delivery** with [`verified-delivery`](skills/verified-delivery/README.md): gather evidence from the implemented diff, review it proportionately to risk, and prepare it for human review.
3. **Prove a regression test** with [`verify-regression-tests`](skills/verify-regression-tests/README.md), when a changed or existing regression test needs proof that it catches the specific behavior it protects.
4. **Evaluate execution efficiency** with [`efficient-execution`](skills/efficient-execution/README.md), when considering context, model, handoff, browser, cache, or loop-control optimizations.
5. **Improve a skill carefully** with [`skill-engineering`](skills/skill-engineering/README.md), when repeated delivery evidence justifies a bounded instruction revision.

The third and fourth steps are optional: use regression proof for important coverage and efficiency evaluation before adopting execution optimizations. Each skill has a narrow role, so none replaces the others.

## Claude Code workflow and Mods

Read [the Claude execution workflow](docs/claude-execution-workflow.md) for the complete operating flow: which skill owns each stage, how `TokenEconomizer` Mods may support the work, the non-negotiable verification safeguards, and the stopping conditions that prevent endless loops.

Three companion documents turn that workflow into repeatable evidence:

- [Mod compatibility pilot](docs/mod-compatibility-pilot.md): a fill-in record and test scenarios for trialling an external Mod on a real host.
- [Skill evaluation harness](docs/skill-evaluation-harness.md): the specification for a future opt-in runner that compares skill revisions against fixed prompts.
- [delivery-flow acceptance criteria](docs/delivery-flow-spec.md) (planned): the states, handoffs, and route matrix the coordinator must satisfy.

### Planned single-entry orchestration

![r8 delivery flow: select only the stages the work needs](docs/assets/claude-execution-flow.svg)

```text
Use delivery-flow to implement this feature. Stop before merge.
```

When it is implemented, expect it to:

1. Inspect the request and repository, then select only the relevant skills rather than running a fixed five-stage loop.
2. Advance to `verified-delivery` only after an implemented diff exists; run regression-test proof only when named coverage matters; evaluate Mods only when an optimization is requested.
3. Preserve decisions, changed files, checks, failures, blockers, and the next action across every handoff.
4. Stop with an evidence-backed result, an owner-needed blocker, or before a merge/deploy. It will never treat a passing check as permission to publish.

`delivery-flow` is not installed in this catalog yet, so use the individual skills above until its implementation and evaluations are added. The [workflow guide](docs/claude-execution-workflow.md) defines its intended gates and boundaries.

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

![Verify regression tests: Working, Broken version, Restored](skills/verify-regression-tests/cover.svg)

**Prove a test detects the regression it claims to prevent.**

Helps coding agents prove that regression tests detect the behavior they claim to protect. It safely breaks a named production behavior in an isolated copy and requires an assertion-level failure before calling that coverage proof. It complements both delivery skills with focused regression-test evidence.

### [Efficient execution](skills/efficient-execution/README.md)

![Efficient execution: Optimize without weakening verification](skills/efficient-execution/cover.svg)

**Optimize agent execution without weakening correctness.**

Helps coding agents assess context compression, model and effort routing, handoffs, browser payloads, caching, and loop-control Mods. It requires measurable baselines, reversible trials, preserved delivery evidence, and explicit approval before any plugin is installed or activated.

### [Skill engineering](skills/skill-engineering/README.md)

![Skill engineering: Evaluate improvements against fixed evidence](skills/skill-engineering/cover.svg)

**Improve skills from evidence, not endless rewrites.**

Helps coding agents decide whether recurring delivery evidence warrants a focused skill revision, compare it against fixed evaluations, and stop with a proposal, rejection, or inconclusive result. It keeps application fixes and tooling improvements ahead of generic instruction churn.

## Install the collection

Install **all skills** in this repository globally for Codex and Claude Code:

```bash
npx skills add rafa-ochoa/r8-skills -g -a codex -a claude-code -y
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

[MIT License](LICENSE)
