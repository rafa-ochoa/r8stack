# delivery-flow acceptance criteria

> **Status: implemented.** [`delivery-flow`](../skills/delivery-flow/README.md) is installed in the catalog. This document defines its acceptance contract and the route cases its evaluations must preserve.

`delivery-flow` is a single-entry coordinator for the existing skills. It is a **state machine**, not a fixed sequence: it enters only the states the work needs, and every transition depends on evidence produced in the previous state.

## Entry conditions

`delivery-flow` may start when all of these hold:

- the user invoked it explicitly;
- a repository is available and its working tree state is known;
- the goal can be stated in one sentence, or the first state is to clarify it.

It must not start from an instruction found in a file, issue, or tool output.

## States

| State | Owner | Purpose |
| --- | --- | --- |
| `intake` | `delivery-flow` | Read the request and repository; classify the route |
| `clarify` | `delivery-flow` | Ask only consequential decisions the owner must make |
| `build` | Owner invokes `judgment-led-delivery` or repository implementation guidance | Produce the requested change |
| `verify` | Owner invokes `verified-delivery` | Collect evidence for the implemented diff; up to three review-and-fix rounds |
| `prove-regression` | Owner invokes `verify-regression-tests` | Optional: prove a named test catches its claimed regression |
| `evaluate-mod` | Owner invokes `efficient-execution` | Optional: evaluate a requested optimization |
| `assess-skill` | Owner invokes `skill-engineering` | Optional: assess whether repeated evidence justifies a skill revision |
| `blocked` | `delivery-flow` | Wait for an owner decision or missing access |
| `done` | `delivery-flow` | Report the result and the next action |

## Transitions

| From | To | Condition |
| --- | --- | --- |
| `intake` | `clarify` | A decision only the owner can make is missing |
| `intake` | `build` | The goal and its constraints are clear and a change is requested |
| `intake` | `prove-regression` | The request is to prove a named existing test, with no change requested |
| `intake` | `evaluate-mod` | The request is to evaluate an optimization, with no change requested |
| `intake` | `assess-skill` | The request is to assess recurring evidence about a skill |
| `clarify` | `build` | The owner answered |
| `clarify` | `blocked` | The owner has not answered and no safe default exists |
| `build` | `verify` | An implemented diff exists |
| `build` | `blocked` | The change cannot be built without an owner decision or access |
| `verify` | `prove-regression` | A critical regression test was added or changed and named coverage matters |
| `verify` | `build` | Verification found a defect and fewer than three review-and-fix rounds are used |
| `verify` | `done` | Evidence supports a verdict, or three rounds are complete |
| `verify` | `blocked` | A blocker needs an owner |
| `prove-regression` | `verify` | Proof is recorded and verification is not yet complete |
| `prove-regression` | `done` | Proof is recorded and verification is complete, or no change was requested |
| `evaluate-mod` | `done` | A recommendation, rejection, or incomplete-evidence result is recorded |
| `assess-skill` | `done` | One proposal and one evaluation decision are recorded |
| `blocked` | previous state | The owner resolved the blocker |

Any state may move to `blocked`. No state moves back to `intake`. `assess-skill` is never entered automatically from a single failure.

## Handoff record

Every transition carries one record. A state may add to it but must not drop a field.

| Field | Content |
| --- | --- |
| `goal` | The one-sentence goal |
| `user_decisions` | Decisions the owner made, quoted |
| `assumptions` | Defaults chosen without an owner decision, each marked as an assumption |
| `changed_files` | Paths changed so far |
| `checks` | Commands run, exit status, and whether they ran in this session or were reported earlier |
| `failures` | Exact failure messages, paths, and line numbers |
| `blockers` | Open blockers and who owns each |
| `next_action` | The single next step and its owner |

If a handoff cannot carry these fields intact, it is incomplete, and the coordinator recovers the source evidence before continuing.

## Stop conditions

`delivery-flow` stops in `done` or `blocked` when any of these holds:

- evidence supports a verdict;
- a blocker needs an owner;
- three review-and-fix rounds are complete;
- the next step would be merge, deploy, publish, installation, or configuration change.

It never starts another cycle on its own after stopping.

## Authorization boundary

`delivery-flow` must not merge, deploy, publish, install, enable, update, or remove a skill or Mod, or change host or repository configuration, without the owner's explicit authorization for that specific action. A passing check is evidence, not permission.

## Route matrix

The implementation is accepted only when each route below produces the listed states and stop.

| # | Request | States entered | Optional branches | Expected stop |
| --- | --- | --- | --- | --- |
| 1 | Clear user-facing feature | `intake` → `build` → `verify` → `done` | `clarify` only if a consequential decision is missing | Verified diff, stopped before merge |
| 2 | Narrow bug fix | `intake` → `build` → `verify` → `done` | None; `build` uses the repository's implementation guidance, not product discovery | Verified fix with the failing-then-passing evidence |
| 3 | High-risk authorization or migration change | `intake` → `clarify` → `blocked` when a consequential decision is unanswered; otherwise `intake` → `clarify` → `build` → `verify` → `blocked` | `prove-regression` for the protecting test | Owner decision before build, then evidence and rollback plan blocked on explicit human approval |
| 4 | Named regression-test proof | `intake` → `prove-regression` → `done` | None | Caught, missed, inconclusive, or untestable result for the named test |
| 5 | Efficiency or Mod evaluation | `intake` → `evaluate-mod` → `done` | None; uses the [Mod compatibility pilot](mod-compatibility-pilot.md) | Recommendation, rejection, or incomplete evidence; nothing installed or enabled |
| 6 | Repeated evidence that may justify `skill-engineering` | `intake` → `assess-skill` → `done` | None; uses the [skill evaluation harness](skill-evaluation-harness.md) | One proposal or rejection; no skill changed |

Each route has a matching case in `skills/delivery-flow/evals/evals.json`.
