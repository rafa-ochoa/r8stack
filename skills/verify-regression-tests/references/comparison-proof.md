# Comparison proof

Read this reference when the three-run comparison is blocked, fails unexpectedly, or depends on a browser/server, mock, or isolated worktree.

## Preserve the comparison

Keep the test command, test file, fixtures, test data, and relevant configuration constant. Change only the production behavior needed to recreate the specific defect. Record every material failed attempt: what changed, the outcome, and what the next run established.

Use a known-bad revision when it faithfully contains the defect. Otherwise make the smallest runnable production change in an isolated worktree or fixture. A syntax error, missing import, changed test setup, or stopped server is not a faithful known-bad comparison.

Afterward, remove only the temporary change and verify:

- the working implementation is restored;
- the same test passes again; and
- the original working-tree diff remains unchanged.

## Interpret unexpected results

| Observation | Classification and response |
| --- | --- |
| Known-bad run fails at another assertion | **Inconclusive.** Report the expected and observed assertion; fix the unrelated failure or choose a faithful reproduction before retrying. |
| Known-bad run passes | **Missed.** The test did not establish protection; strengthen its observable assertion or setup. |
| A retry passes without a relevant change | **Inconclusive.** Preserve both outcomes and report possible flakiness; stabilize the baseline before claiming proof. |
| Test setup, import, type, timeout, or environment fails | **Inconclusive.** Repair or isolate the environment; do not count the failure as an assertion-level catch. |
| Existing test already covers the behavior | Name the existing assertion and verify its sensitivity. Do not add a duplicate test. |
| A project-owned dependency is mocked | State the narrower behavior proved by the test, then prefer the real path with a narrow external boundary fake when practical. |

## Browser and server targets

Do not assume a documented port is current. Use test configuration, startup output, or the running process to find the actual target, then verify that target before rerunning. Report the corrected target and what the rerun proved. A stale-port connection failure is an environment result, not evidence about the regression.

## Optional skill evaluation comparison

When an evaluation runner can control selection mode, compare the same scenario with the skill absent, automatically selected, and explicitly invoked. Keep model, prompt, fixture, and tools fixed. Score activation separately from behavior; label unavailable modes and do not infer a comparison that was not run.
