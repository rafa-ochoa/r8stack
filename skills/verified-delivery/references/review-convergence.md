# Review convergence

Independent review finds plausible failure modes; it does not automatically create work.

## Validate every finding

For each finding, establish all of the following before changing code:

1. **Relevance:** it concerns the requested behavior or a real regression introduced by the diff.
2. **Failure mode:** a concrete input, state, actor, or deployment condition makes it fail.
3. **Impact:** correctness, safety, privacy, reliability, or maintainability is materially affected.
4. **Smallest remedy:** the fix addresses the cause without widening scope or adding needless complexity.

Reject findings that lack evidence, misread existing invariants, or only express a stylistic preference. Record a concise reason when the finding is material enough that a later reviewer might otherwise reopen it.

## Three-round limit

Each round is: independent review → finding validation → justified fixes → rerun affected checks.

| Round | Goal | Stop rule |
| --- | --- | --- |
| 1 | Catch direct correctness, requirement, security, and regression issues | Stop if no material validated findings remain |
| 2 | Verify that fixes did not introduce new problems | Stop if remaining findings are rejected or nonmaterial |
| 3 | Final bounded check of the changed diff | Escalate unresolved material issues; do not begin round 4 |

The limit controls churn, not standards. A confirmed security, correctness, privacy, or data-integrity issue remains a blocker even after the third round. Simplify or revert low-value changes introduced solely by an invalid finding when that reduces risk.

## Improve the system after an escape

For a defect that reaches review, production, or users, prefer this order:

1. Fix the root cause in the product or architecture.
2. Add a focused regression test, invariant, static check, or operational guard where it can catch the class of failure.
3. Add a concise evaluation case for the agent skill when agent reasoning missed the pattern.
4. Update project instructions only for durable, project-specific knowledge that cannot live nearer to the code.

Do not accumulate generic reminders in agent instructions as a substitute for a real guardrail.
