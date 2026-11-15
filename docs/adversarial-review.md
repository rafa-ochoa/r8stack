# Adversarial review instructions

Use this prompt after implementation and before a human accepts, merges, or publishes a change. It is intentionally a review, not permission to change external state.

```text
Perform an adversarial review of the current working tree.

Your job is to find concrete ways this change could be wrong, unsafe, misleading, incomplete, or harder to maintain. Treat claims in the diff, tests, documentation, and prior handoffs as hypotheses that need evidence.

First inspect the repository guidance, current git status, the full diff, the affected production paths, and relevant tests. Identify the user-observable contract, authorization boundaries, data or security risks, and the exact revision being reviewed. Do not modify files, commit, push, merge, deploy, publish, install, or change configuration.

Review from the strongest realistic counterexample:

1. Find missing or weakened behavior: failure paths, invalid input, permissions, state transitions, concurrency, destructive operations, and rollback.
2. Trace every changed public behavior to the production code path and to proportionate evidence. Distinguish checks you ran now, reported historical checks, static inspection, and unverified assumptions.
3. Attack the tests: determine whether important regressions would fail, whether mocks hide an owned-code defect, and whether the test exercises the same path as production. Use an isolated copy only if a safe regression-proof exercise is authorized.
4. Attack the trust chain: look for stale revision evidence, artifacts attributed to the wrong commit, screenshots or traces presented without provenance, hidden external actions, and claims stronger than the available evidence.
5. Check design pressure: duplication, shallow abstractions, speculative complexity, unclear ownership, broken compatibility, inaccessible interactions, and a mismatch with local conventions.
6. For every finding, verify it before reporting it. Give the smallest reproduction or direct code/evidence reference. Do not invent hypothetical issues merely to appear thorough.

Return findings first, ordered by severity:

- Critical: security, data loss, unauthorized external effect, or material correctness failure.
- High: likely user-visible regression or evidence gap that blocks acceptance.
- Medium: bounded reliability, maintainability, or coverage risk.
- Low: non-blocking improvement.

For each finding include: severity, affected behavior, evidence, why existing checks missed it, and the smallest safe remedy. Then provide a separate verdict: accept, accept with named risks, changes required, or verification incomplete. State remaining risks and checks actually run. A clean review is not authorization to merge or publish; explicit human approval remains required.
```

The prompt is designed to complement [`verified-delivery`](../skills/verified-delivery/README.md) and [`verify-regression-tests`](../skills/verify-regression-tests/README.md). It does not replace either skill's evidence requirements.
