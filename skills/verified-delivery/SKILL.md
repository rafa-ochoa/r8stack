---
name: verified-delivery
description: "Turns an implemented change into evidence-backed, review-ready delivery. Use after implementing a feature, bug fix, migration, security-sensitive change, or pull request; when asked to verify, independently review, prepare a PR, assess release risk, investigate a regression, or decide whether code is safe to merge. It runs proportionate checks, verifies findings before fixing them, limits review-and-fix convergence to three rounds, records rollback readiness, and never merges, deploys, or claims a check passed without evidence. Complements judgment-led-delivery: that skill decides and delivers the user outcome; this skill proves the implemented change is safe and reviewable."
license: MIT
---

# Verified delivery

Apply this skill **after implementation** or to assess an existing diff. Its job is to establish trustworthy evidence and a merge-ready review package—not to reopen product decisions, replace CI, or authorize release actions.

## Operating rules

- Read the request, repository instructions, linked issue or acceptance criteria, affected code, and actual diff before choosing checks. Preserve unrelated work.
- Keep facts separate: label evidence as **run now**, **reported earlier**, **inspection**, or **unverified**. Never invent test results, approvals, incidents, screenshots, or coverage.
- Use project-provided commands and risk-appropriate checks. A green formatter does not prove behavior; a screenshot does not prove persistence or authorization.
- Diagnose material failures to their root cause. Fix the cause and add a regression guard where practical; do not paper over it with retries, broad catches, test weakening, or instruction-file rules.
- Review findings are hypotheses until validated against the code, requirements, and a concrete failure mode. Do not change code merely to satisfy a reviewer.
- Stay within authority. Preparing commits or a PR requires explicit permission; merging, deploying, publishing, changing data, or changing access always requires explicit permission. A passing result is not approval.
- Stop when the evidence supports the requested decision, a blocker needs an owner, or the review has converged. Do not create agents, tickets, tools, or broad refactors merely to follow this workflow.

## 1. Establish the verification target

State the requested behavior, the changed surface, acceptance criteria, and plausible regressions. Identify the effective code paths rather than trusting filenames alone. Select the smallest evidence that can falsify the important claims.

Classify risk with [risk and release](references/risk-and-release.md). Low-risk changes usually need targeted checks; high-risk changes need stronger evidence and an explicit human approval point. When the change touches personal data, authentication, authorization, payments, destructive operations, secrets, production infrastructure, migrations, or irreversible external effects, treat it as high risk until evidence shows otherwise.

## 2. Build an evidence set

Run applicable checks through the real changed paths. Prefer existing tests and automation; add or repair focused coverage when the change creates a meaningful, unguarded regression risk. For a defect, reproduce it before the fix when practical, then verify the reproduction no longer fails.

- Check behavior and its relevant failure, recovery, permission, data-integrity, and compatibility paths.
- Run the repository's relevant format, lint, type, test, build, migration, and end-to-end checks. Use a real browser or realistic input where the feature depends on them.
- Inspect security and privacy boundaries: authorization, untrusted input, secret exposure, logging, retention, and least-privilege changes.
- Record the command or action, result, scope, and limitations. Use [verification evidence](references/verification-evidence.md) for substantial changes.

Resolve failed checks before a readiness verdict unless they are demonstrably unrelated and explicitly disclosed. Do not hide failures through filtered output or by changing tests to match broken behavior.

## 3. Independently review and converge

Request or perform a review from a fresh context when available; otherwise deliberately re-read the diff from the perspective of a skeptical maintainer. Review correctness, requirements fit, regressions, security/privacy, data behavior, operability, and unnecessary complexity. Scope review depth to risk.

For each finding, decide: **fix**, **document as a risk**, or **reject with evidence**. Apply only validated fixes, rerun their affected evidence, and review the new diff.

Use at most **three review-and-fix rounds**. A round is review, validation of findings, any justified fixes, and rerun of affected checks. Stop early when no material validated findings remain. At round three, do not continue the loop: summarize unresolved material concerns, evidence gaps, and the owner or decision needed. A convergence limit never downgrades a known security, correctness, or data-integrity blocker. See [review convergence](references/review-convergence.md).

## 4. Check rollback and approval readiness

For medium- and high-risk changes, identify how to contain or reverse a bad outcome before recommending merge: a revert, feature flag, migration reversal or forward repair, backup/restore plan, monitoring signal, and responsible owner as applicable. Do not claim rollback is safe without checking the actual deployment and data constraints.

Require explicit human approval before merging a high-risk change, even when all checks pass. Also escalate when the change has unresolved material risk, an unavailable essential check, an irreversible outcome, or an approval policy the agent cannot verify.

## 5. Return a review-ready result

Lead with exactly one verdict:

- **Ready for review** — evidence supports the requested behavior and no known material blocker remains. This is not merge authorization.
- **Not ready** — a confirmed defect, failing required check, or material security/data concern blocks review.
- **Verification incomplete** — essential behavior or risk could not be evaluated sufficiently.

Then give only the information needed to act:

1. What was verified and which requirements it supports.
2. Evidence run now, including commands/actions, results, and scope; earlier reports or inspection separately.
3. Review rounds, validated findings fixed, rejected findings, and unresolved risks.
4. Risk level, rollback/containment readiness, and any required approval.
5. Regression coverage added or missing, plus the next action only if needed.

Use [PR readiness](references/pr-readiness.md) when preparing a pull request or handoff. Keep the description concrete enough for a reviewer to understand impact without rereading every file.

## Red flags

- Calling code safe because it compiles, the diff looks reasonable, or a reviewer made no comments
- Treating a review suggestion as a defect without reproducing or reasoning about a failure mode
- Running unlimited review loops or expanding the change to satisfy low-value comments
- Calling high-risk work ready without authorization, data, privacy, and rollback evidence
- Solving a recurring failure by adding vague agent instructions instead of improving the code, test, guardrail, or architecture
- Omitting a failed or unavailable check from the report

## Examples

- **Focused bug:** reproduce the failure, make the narrow root-cause fix, run the regression and affected checks, then report the evidence.
- **Sensitive sharing change:** treat access to private content as high risk; verify unauthorized and authorized paths, audit exposure and logs, document reversal, and require human approval before merge.
- **Routine copy change:** inspect the diff and run the relevant lightweight checks; do not demand migration plans or a three-round review.
