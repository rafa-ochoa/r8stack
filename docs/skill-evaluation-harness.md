# Skill evaluation harness

This document specifies a small, opt-in harness that can later run each skill's fixed prompts against a chosen agent and compare a candidate skill revision with its baseline. It is a specification only: **no model runner is implemented in this catalog**, and no CI job calls a model.

What already exists and runs in CI is deterministic: `node scripts/validate-skill-evaluations.mjs` guarantees every skill ships a well-formed prompt set with unique, stable evaluation IDs. A future runner depends on that guarantee instead of re-validating prompts itself.

## Principles

- **Opt-in.** The runner only starts when a person invokes it with an explicit agent, model, and budget. It never runs on push, pull request, or schedule.
- **Fixed inputs.** The prompts, fixture, and expectations are chosen before the candidate is written and do not change during a comparison.
- **Human judgment.** The runner collects evidence; a reviewer decides. Nothing is promoted automatically.

## Versioned prompt sets

Each skill's prompt set is its `skills/<skill-name>/evals/evals.json`:

- `trigger.positive` and `trigger.negative` check routing.
- `evals[]` check behavior. Each entry has a unique positive integer `id`, a `prompt`, an `expected_output`, and `expectations`.

A prompt set version is the git commit of that file. A comparison names it as `<skill-name>@<commit>`, and a single case as `<skill-name>@<commit>#<id>`. Never renumber or reuse an `id` for a different case; add a new one and retire the old.

A candidate skill revision must be evaluated against the prompt set from **before** the revision. Removing or weakening a case in the same change as the candidate invalidates the comparison (see the second `skill-engineering` evaluation).

## Fixed repository fixture

Behavior cases run in a disposable git worktree checked out at a recorded commit of a fixture repository. The run record stores:

- fixture repository and commit;
- setup commands and their exit status;
- a clean `git status` before each case.

Each case starts from a fresh worktree so one case cannot leak state into the next. The worktree is deleted after its transcript and diff are saved.

## Observable outputs

The runner records only what can be checked afterwards:

- the full transcript, including tool calls;
- the final diff and changed-file list;
- commands the agent ran, with exit status;
- whether the skill was invoked (for routing cases).

`expectations` are written as observable statements so a reviewer can mark each one met, not met, or unclear from these artifacts alone.

## Human review step

For each case, the reviewer marks every expectation and adds a short note for any not met or unclear. The runner may pre-fill candidate marks, but a mark counts only after the reviewer confirms it. The review record names the reviewer and date.

## Baseline versus candidate

| Run | Skill text | Prompt set | Fixture | Agent settings |
| --- | --- | --- | --- | --- |
| Baseline | Current published revision | `<skill>@<commit>` | Recorded commit | Same agent, model, and effort |
| Candidate | Proposed revision | Same | Same | Same |

Compare per case, not by an aggregate score alone. Report regressions first: any expectation met by the baseline and not by the candidate is a blocker until explained.

## Unavailable credentials, cost, and nondeterminism

- **Credentials.** If the chosen agent's credentials are absent, the runner exits with a distinct status and the message `skipped: credentials unavailable`. It never falls back to another provider or model, and a skip is never reported as a pass.
- **Cost.** The invoker sets a maximum number of cases and runs before starting. The runner prints the planned run count first and stops when the budget is reached, marking remaining cases `not run`.
- **Nondeterminism.** Run each case at least three times per side. Record every run. Treat a case as changed only when the difference is consistent across runs; otherwise mark it `inconclusive`. Do not rerun until a preferred result appears.

## Promotion

The harness never edits, merges, or publishes a skill. Its output is an evidence record that `skill-engineering` and a human reviewer use to accept, reject, or call the revision inconclusive. Promotion is a separate, explicitly approved change.
