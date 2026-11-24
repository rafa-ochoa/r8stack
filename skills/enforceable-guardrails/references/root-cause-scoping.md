# Root-cause scoping

Read this reference when it is unclear which layer should own a guardrail, when the proposed check feels broader than the failure, or when the evidence for the failure is thin.

## Confirm the failure is attributable

A guardrail needs a failure you can point to. Before choosing an enforcement point, record:

| Field | What counts |
| --- | --- |
| Occurrences | At least one concrete instance with a revision, file, command, or review link. Recurrence or a high-impact single incident justifies a check; a hypothetical does not. |
| Unsafe state | The exact value, artifact, or transition that should have been impossible. |
| Entry point | Where that state is created or first accepted: user input, an API response, a generated file, a handoff record, a merge. |
| Impact | Who or what was harmed, or would be, when the state slipped through. |

If you cannot fill these in, ask for the evidence or report the request as speculative. "Agents should be more careful" names no unsafe state and no entry point.

## Choose the enforcement point

Pick the earliest layer that can reliably reject the unsafe state on the same code path production uses.

| The unsafe state is… | Prefer | Avoid |
| --- | --- | --- |
| Invalid data inside the product | A type, constructor, or domain validator at the input boundary | A CI grep for the bad value |
| Wrong behavior of working code | A behavior test through the public interface, then `verify-regression-tests` to prove it is sensitive | An instruction asking agents to remember the behavior |
| A static convention in source | An existing linter rule or a narrow custom rule | A reviewer checklist item |
| A malformed repository artifact or handoff record | The repository validator that already reads that artifact | A new standalone script that duplicates parsing |
| Evidence attributed to the wrong revision | A check that compares the recorded revision with the revision being verified | Trusting a summary's claim that checks ran |
| An agent's reasoning or routing | `skill-engineering` with measured, repeated evidence | An unevaluated rule added to a skill or instruction file |

When two layers could own it, choose the one closer to where the state is created. A product invariant protects every caller; a CI check protects only what CI sees.

## Keep the check narrow

- Reject exactly the observed unsafe state and its direct variants. Do not generalize into a rule engine, a configurable policy, or checks for failures nobody has seen.
- Reuse the harness, validator, or test file that already owns the boundary. A new script needs a reason the existing owner cannot hold the check.
- Make the failure message name the invariant and the offending value or path, so whoever hits it can fix it without reading the check's source.
- Do not weaken, skip, or bypass an existing check to make room for the new one.

## Prove it both ways

Run the guardrail through its public command or interface:

1. **Rejects:** feed the recorded unsafe state, or a faithful reproduction of it, and capture the failure output.
2. **Accepts:** feed a realistic valid state from the same domain and capture the pass.

A check that has only been written or described has not passed. When one direction cannot be run, for example because the unsafe state needs production data, say so and name the evidence still required.

## Stop

Stop and report when the root cause is protected and both directions are recorded, when the right layer needs an owner decision (such as a CI configuration or schema change you are not authorized to make), or when the evidence does not support a guardrail. A passing guardrail never authorizes a commit, push, merge, deploy, or configuration change.
