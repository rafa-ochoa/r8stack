---
name: sabotage-tests
description: "Prove new or changed tests detect real regressions by breaking the covered production behavior in an isolated copy and observing an assertion-level failure. Use when writing, changing, or reviewing tests; when tests mock project-owned code; or when asked whether tests actually catch important bugs. Not for ordinary feature implementation, generic code review, or chasing a coverage percentage."
license: MIT
---

# Sabotage tests

A test that passes against working code is a claim. A test that fails for the expected assertion after the protected behavior is broken is evidence. Use this skill to establish that evidence without damaging the project, production data, or another person's work.

## Boundaries

- Test the real application code through a public interface. Mock only true system boundaries: external network services, third-party SDKs, time, randomness, platform APIs, file systems, or a database when a real test database is impractical.
- Do not mock project-owned modules, hooks, stores, components, or services merely to make a test easier. Replace them with the real code and a narrow boundary fake.
- Do not run a sabotage against production, deployed environments, payment systems, user data, or an external side effect. Use local safe data and a scratch copy of the project whenever possible.
- Do not alter source code, delete tests, relax assertions, or change coverage thresholds just to turn a missed sabotage into a pass. Strengthen the test or report the gap.
- This skill verifies tests. It does not own feature scope, implementation, rollback planning, or the overall readiness verdict; use `judgment-led-delivery` for product scope and `verified-delivery` for risk-sensitive delivery evidence.
- Report sabotage results as **caught**, **missed**, **inconclusive**, or **untestable**. A caught sabotage is focused test-quality evidence, not authorization to merge, deploy, or make an external change.

## 1. Define the proof claim

For every new or changed test, name the observable behavior it claims to protect: what the user sees, what the caller receives, or what request is sent. Identify the production code path that produces that outcome and the one boundary fake, if any, that makes the test deterministic.

Run the affected test against the intended working behavior first. A failing baseline, a flaky test, or a test awaiting an implementation is not ready to sabotage. Fix or isolate that condition before counting any result.

## 2. Choose a safe sabotage

Prefer a scratch copy that excludes dependencies and build output. This keeps a dev server, another worktree, and uncommitted edits away from the mutation.

If a scratch copy is not practical, inspect the working tree first. Preserve the pre-existing diff for every file that must be touched, undo only the sabotage edit, and confirm the original diff is unchanged afterward. Never use reset, checkout, clean, or stash as restoration shortcuts.

Break the smallest production behavior the test claims to cover while keeping the program runnable. Examples: reverse the decision that shows an error, omit the persistence call, return the prior value, or send an incorrect request field. Do not cause a syntax, import, type, setup, timeout, or unrelated environment failure; those do not prove the assertion is sensitive.

## 3. Run, inspect, and classify

Run the affected test with its normal command and inspect its exit status and assertion failure. Do not hide the outcome through filtered output.

Classify each sabotage:

- **Caught** — the affected test fails on an assertion that describes the broken behavior.
- **Missed** — the test still passes. Strengthen its setup or assertion, restore the intended behavior, and repeat the same sabotage.
- **Inconclusive** — the baseline is unstable or the run fails for setup, type, import, timeout, or environmental reasons. Fix the test environment before claiming coverage.
- **Untestable** — the available environment cannot establish the behavior (for example, a device-only integration). Do not count it as proof; state the required manual or integration check.

Do not weaken a test to avoid exposing a real product bug. If the production path is wrong, leave the failure visible and report it; fix the source only when separately authorized.

## 4. Report evidence, not test volume

Report the behavior, the semantic sabotage, the observed assertion, and the classification. A concise result is enough:

```markdown
## Test proof

- Baseline: <affected test and passing/failing status>
- Behavior: <observable claim>
- Sabotage: <runnable production-behavior change>
- Result: <caught / missed / inconclusive / untestable>
- Evidence: <failing assertion or reason it could not be established>
- Follow-up: <test strengthened, manual check, or product bug>

Summary: <N sabotages, N caught; list misses and untested behavior>
```

After targeted proof is complete, run the relevant full suite and the project's applicable typecheck, lint, and build. State exactly what ran in this session and what remains unverified.

## Common rationalizations

| Rationalization | Reality |
| --- | --- |
| “The test is green, so it works.” | Green against working code is the claim, not the proof. |
| “Coverage is high.” | Coverage records execution, not whether an assertion notices a wrong result. |
| “Mocking our module keeps it simple.” | It tests the mock; the real module can still ship broken. |
| “The mutation made the test fail.” | A setup, import, type, or timeout failure proves nothing about the asserted behavior. |
| “We are in a hurry, skip the sabotage.” | Then report the check as unverified; do not call the test proven. |
| “I will restore with reset.” | That can discard unrelated work. Use a scratch copy or undo only the deliberate edit. |
| “This test cannot catch the bug, but it is better than nothing.” | A passing test that misses its claimed regression creates false confidence. |

## Red flags

- A test report claims proof without a named sabotage and assertion-level failure
- A mock replaces code owned by the project
- The mutation changes test code, configuration, types, imports, or the test runner instead of production behavior
- The baseline test was failing or flaky before the sabotage
- A skipped test, deleted assertion, suppression, or lowered threshold appears after a missed sabotage
- A live external action or production data is involved in the proof
- Restoration changes a pre-existing working-tree diff

## Verification

- [ ] Each reported behavior has a passing baseline before sabotage
- [ ] Each sabotage changes runnable production behavior, not the test environment
- [ ] Each caught result fails on an assertion tied to that behavior
- [ ] Missed, inconclusive, and untestable results are not counted as proof
- [ ] No project-owned code is mocked within the tests in scope
- [ ] No live side effects or unrelated working-tree changes occurred
- [ ] Relevant suite and applicable project checks ran, with gaps reported honestly
