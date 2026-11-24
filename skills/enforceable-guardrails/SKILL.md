---
name: enforceable-guardrails
description: "Turns a repeated, attributable engineering failure into the narrowest executable protection at its root cause. Use when a failure recurs, a review finding reveals a missing invariant, or a team needs a check that prevents a specific unsafe state. Not for generic agent reminders, speculative policy, or replacing an application fix with instructions."
license: MIT
---

# Enforceable guardrails

Convert recurring failures into protections that run where the failure can occur. Prefer a product invariant, type, test, linter rule, CI check, or repository validator over another reminder to an agent.

## Guardrails

- Start from attributable evidence: the recurring failure, its impact, and the layer that can prevent it. Fix the root cause in the product before adding a process check when that is the appropriate boundary.
- Add one narrow, executable guardrail. It must reject the unsafe state and permit the intended valid state. Do not create a general-purpose policy engine or duplicate an existing check.
- Keep the check close to the boundary it protects. Types and domain validation protect invalid data; tests protect behavior; linting protects static conventions; CI and repository validators protect artifacts and handoffs.
- Test the positive and negative paths through the guardrail's public command or interface. Record actual command output, revision, and any unavailable evidence. Never call a check passed because it was written or described.
- A guardrail cannot authorize a commit, merge, deploy, publication, or configuration change. Stop when the root cause is protected, evidence is recorded, or an owner decision is needed.

## Method

1. State the failure as an invariant: what must always hold, where untrusted input enters, and which observable harm it prevents.
2. Choose the lowest-cost enforcement point that can reliably reject the invalid state. Reuse an existing validator or test harness when it already owns that boundary. Use [root-cause scoping](references/root-cause-scoping.md) when the owning layer is unclear, the check feels broader than the failure, or the evidence is thin.
3. First demonstrate the unsafe case is rejected; then demonstrate a realistic valid case is accepted. Keep the production path and the check on the same code path.
4. For a feature or high-risk change, record a feature map with its exact revision, user-observable flows, risk, commands, and available traces or screenshots. Validate it with `node scripts/validate-feature-map.mjs <feature-map.json>`.
5. If the failure is about agent reasoning rather than product behavior, pass the measured evidence to `skill-engineering`. It may propose a versioned evaluation, but a human must approve any promoted rule.

## Report

```markdown
## Guardrail

- Failure and evidence: <occurrences, unsafe state, entry point, impact>
- Invariant: <what must always hold>
- Enforcement point: <file or command, and why this layer>
- Rejects unsafe case: <command and observed failure, or why not run>
- Accepts valid case: <command and observed pass, or why not run>
- Revision: <exact commit>
- Open owner decision: <only if applicable>
```

## Red flags

- Adding an agent reminder or instruction-file rule where a type, test, or validator could reject the state
- A check that has never been run against the unsafe case
- A new script or framework that duplicates an existing validator's parsing
- Generalizing beyond the observed failure into configurable policy
- Treating a passing guardrail as permission to commit, merge, or change CI configuration

## Boundaries

- `judgment-led-delivery` owns product scope and the complete user outcome.
- `verified-delivery` owns proportionate delivery evidence and review readiness.
- `verify-regression-tests` proves a named regression test catches its protected behavior.
- `skill-engineering` owns measured revisions to agent instructions and their fixed evaluations.

This skill owns only the decision and implementation of a root-cause guardrail.
