---
name: verify-regression-tests
description: "Prove that a named regression test detects the specific behavior it protects. Use when writing, changing, or reviewing regression tests; when tests mock project-owned code; or when asked whether a test catches an important bug. It compares the unchanged test against working and faithfully known-bad behavior, requiring the intended assertion failure. Not for ordinary feature implementation, generic code review, or chasing coverage."
license: MIT
---

# Verify regression tests

A passing test is a claim. Evidence is the same, unchanged test passing against working behavior, failing at its intended assertion against faithfully broken behavior, then passing again after restoration. Establish that evidence without damaging production, external systems, or another person's work.

## Boundaries

- This skill proves a named test's protection. It does not own feature scope, implementation, rollback planning, or overall readiness: use `judgment-led-delivery` for product judgment and `verified-delivery` for broader delivery evidence.
- Test real application code through a public interface. Mock only true system boundaries. If a project-owned dependency was already mocked, say precisely which narrower behavior the result proves.
- Use safe local data and an isolated worktree or fixture. Never perform the known-bad change against production, deployed systems, payments, user data, or external side effects.
- Do not change the test, fixtures, or relevant configuration between the working and known-bad runs. Never weaken assertions, remove tests, or alter coverage thresholds to force a result.
- A caught result is test-quality evidence, not authorization to commit, merge, deploy, or make an external change.

## 1. Define the expected failure

Before adding or changing a test, inspect existing coverage. If a current test already protects the behavior, identify its exact assertion and prove that test rather than duplicating it.

Name the protected behavior, production path, exact test and assertion, and what that assertion should observe when the behavior breaks. A baseline that already fails or is flaky cannot establish proof.

## 2. Compare working, known-bad, and restored behavior

Keep the test command, test, fixtures, and relevant configuration fixed across all runs:

1. Run the unchanged test against the working implementation.
2. In an isolated worktree or fixture, use a known-bad revision or the smallest runnable change that faithfully recreates the defect. Confirm the named assertion fails for the expected reason.
3. Restore or return to working behavior, rerun the same test, and verify temporary changes are cleaned up.

Do not count setup errors, imports, types, timeouts, unrelated assertions, or a passing retry without a relevant change as proof. Classify them separately; use [comparison proof](references/comparison-proof.md) for practical handling.

## 3. Classify the result

- **Caught** — working and restored runs pass; the known-bad run fails at the intended assertion.
- **Missed** — the known-bad run passes. Strengthen the test or report the gap.
- **Inconclusive** — a baseline is unstable, the failure is unrelated, the defect cannot be reproduced faithfully, or the environment prevents comparison.
- **Untestable** — no safe environment can establish the behavior. State the required manual or integration evidence.

Fix production code only when separately authorized. Restore deliberate changes without reset, checkout, clean, or stash shortcuts that could discard unrelated work.

## 4. Report concise evidence

Report the test and command, the working/known-bad/restored outcomes when obtained, intended versus observed failure, and only material workarounds or gaps. Keep routine command noise in logs.

```markdown
## Regression-test proof

- Test and command: <exact test and command>
- Protected behavior / assertion: <claim and expected observation>
- Working → known-bad → restored: <pass → intended assertion failure → pass>
- Result: <caught / missed / inconclusive / untestable>
- Material workaround or gap: <only if applicable>
```

## Red flags

- Reporting a caught regression without the named assertion failing on known-bad behavior
- Changing the test, fixture, or configuration between comparison runs
- Treating a setup error, unrelated assertion, stale server target, or unexplained retry pass as proof
- Duplicating an existing regression test instead of verifying its existing assertion
- Leaving temporary changes or a pre-existing working-tree diff altered
