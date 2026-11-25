# Verification evidence

Use this reference for meaningful changes. Select checks that can disprove the claims being made; do not turn it into a universal checklist.

## Evidence record

For every material claim, record:

| Claim | Evidence | Result | Scope or limitation |
| --- | --- | --- | --- |
| A user can complete the changed flow | Named test, browser path, or realistic input | Passed / failed | States, roles, browser, fixture, or environment covered |
| Existing behavior remains intact | Targeted regression or integration check | Passed / failed | Adjacent paths covered or not covered |
| The change builds and integrates | Project command | Passed / failed | Package, target, warnings, or unavailable dependency |

Mark evidence accurately:

- **Run now:** performed in the current task; include the command/action and outcome.
- **Reported earlier:** credible prior output; name its date/scope if known, and do not present it as fresh.
- **Inspection:** reasoned review of code/configuration; it is not execution proof.
- **Unverified:** unavailable, not run, or insufficient; explain why it matters.

## Choose evidence by failure mode

| Change characteristic | Evidence that matters |
| --- | --- |
| UI or interaction | Browser/user-flow exercise plus relevant automated behavior tests; include loading, errors, and recovery when changed |
| API or domain behavior | Integration or contract tests through the public boundary; malformed input and caller-visible errors |
| Authorization or privacy | Authorized and unauthorized paths, tenant/owner isolation, data exposure, logging, and retention behavior |
| Migration or data repair | Representative data, forward path, rollback/forward repair feasibility, idempotency, and backup assumptions |
| Async, worker, or model path | Realistic input, observable completion/failure, retry/duplicate behavior, and measurement against an appropriate reference |
| Performance-sensitive path | Relevant baseline or measurement; do not infer performance from implementation style |

When a test is impractical, use the strongest affordable alternative and state the gap. Do not replace essential execution with confidence, a diff review, or a screenshot.

## Compare a baseline with the candidate

1. Pick the known revision that represents the behavior to preserve, usually the merge base for a PR refactor. Record the exact baseline and candidate revisions. If the candidate includes uncommitted edits, identify the tested diff alongside its revision. Run the same relevant commands with the same tests, assertions, fixtures, snapshots, and runner settings in comparable environments. Isolate the revisions when needed and preserve any existing working changes.
2. Record baseline and candidate outcomes independently. If the PR changes checks, fixtures, snapshots, or runner configuration, review that diff and use the trusted baseline inputs for the comparison when compatible. Run the candidate's checks as additional evidence. If the fixed check cannot run on both, explain the incompatibility and which claim remains unverified. For intentional behavior changes, state the expected difference and verify it separately.
3. Explain new failures, pre-existing failures, and material evidence gaps. If a critical named test needs sensitivity proof, use the existing `verify-regression-tests` workflow for the working, broken, and restored runs. Parity between two passing revisions and sensitivity to a specific defect establish different claims.

For performance work, use the same workload and run conditions. Show the baseline, candidate, and delta with units for both the target metric and relevant trade-offs, such as startup time versus bundle size. Repeat noisy measurements enough to characterize variation. Mark the comparison inconclusive when the runs are incompatible or the change falls within observed noise.

For an interaction change, use an actual browser flow that exercises the claim. A trace or short recording can show focus, sequencing, and recovery when those are important. Include capture context and link only to artifacts that actually exist and that the intended reviewer may access.
