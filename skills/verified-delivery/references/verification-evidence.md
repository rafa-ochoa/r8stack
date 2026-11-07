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
