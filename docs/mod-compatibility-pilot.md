# Mod compatibility pilot

Use this template to decide whether an external Claude Code Mod, such as `TokenEconomizer`, is compatible with a specific host version and repository. Copy it into a dated record outside the catalog, or into a dated file in the repository being piloted. Do not commit one machine's result here as catalog truth.

> A plugin passing its own unit tests does not prove host compatibility, security, or savings. Those claims need a reversible pilot on the actual host, against a fixed baseline, with the evidence recorded below.

This catalog never installs, enables, updates, or reconfigures a Mod. Every step that changes plugin state is performed by the person running the pilot, after approval.

## Pilot record

Fill in every field. Write `not run` rather than leaving a field empty.

| Field | Value |
| --- | --- |
| Date | `YYYY-MM-DD` |
| Host and version | e.g. Claude Code `x.y.z` |
| Plugin and version | e.g. `TokenEconomizer` `x.y.z`, source commit |
| Repository and commit | |
| Pilot scope | Which tasks, sessions, and scenarios below |
| Enabled mechanisms | Micro-skills / tool pruning / loop guard; everything else off |
| Baseline command | Exact command or prompt run with the Mod disabled |
| Candidate command | The same command or prompt with the Mod enabled |
| Expected behavior | What must stay identical, and what may improve |
| Observed evidence | Transcripts, exit codes, token counts, file paths |
| Failures | Every deviation, including ones judged harmless |
| Rollback command | Exact command that restores the pre-pilot state, and proof it was run |
| Reviewer | Person who checked the evidence |
| Adoption decision | Adopt / reject / repeat with changes, and why |

Run the baseline and the candidate on the same repository commit, the same prompt, and the same model and effort settings. Record each run separately; do not compare a fresh candidate against a remembered baseline.

## Scenarios

Run only the scenarios for mechanisms in scope. Each scenario passes only when its expected behavior is observed in the candidate run.

### 1. Micro-skills

| Step | Expected behavior |
| --- | --- |
| Start a session in the pilot repository and list the injected facts | Every fact is attributable to a repository file or an earlier verified run |
| Change a fact's source (rename a script, change a test command) and start a new session | The stale fact is corrected, flagged, or dropped; it is not presented as current |
| Ask the agent to run the repository's checks | It runs the current command from the repository, not one remembered from a micro-skill |

Fail the scenario if an injected fact overrides repository instructions or replaces current test output.

### 2. Tool pruning: proposal, application, restoration

| Step | Expected behavior |
| --- | --- |
| Proposal | The Mod lists the exact tools it would remove, with the evidence of non-use. Nothing is written yet |
| Review | The reviewer confirms each tool is unused for the pilot scope and records the restore command before approving |
| Application | Only the approved tools are removed; the change is visible in the plugin's own configuration |
| Use | A task that needs a removed tool reports it as unavailable rather than failing silently |
| Restoration | The recorded restore command returns every removed tool; a new session shows the original tool list |

Fail the scenario if configuration changes before approval, or if restoration leaves any tool missing.

### 3. Loop-guard detection

| Step | Expected behavior |
| --- | --- |
| Give a task with a deliberately unfixable failing check (for example, an assertion against a value the task forbids changing) | The agent repeats an edit and failure cycle |
| Observe the loop guard | It flags the repetition and suggests a materially different next step |
| Inspect the result | The failure is still reported as a failure; the task is not declared fixed; required verification is not skipped |

Fail the scenario if the guard hides the failure, marks the task complete, or stops verification.

### 4. Exact test failures and paths

| Step | Expected behavior |
| --- | --- |
| Introduce a known failing test with a distinctive message, file path, and line number | The baseline transcript shows the exact message, path, and line |
| Run the same task with the Mod enabled | The candidate transcript and any summary or handoff show the identical message, path, line, and exit status |
| Compare changed-file lists | Both runs report the same changed files |

Fail the scenario if any of those values is paraphrased, truncated, or omitted. This is the safety floor from the [Claude execution workflow](claude-execution-workflow.md#non-negotiable-safety-floor).

## Decision rules

- Adopt only when every in-scope scenario passes, rollback was exercised, and the reviewer signed the record.
- Report savings only from paired baseline and candidate runs; a single run is not a savings claim.
- Treat any new host version or plugin version as unverified until this pilot is repeated.
- Prefer a native host capability when it preserves the same safety floor; see the workflow guide's native host evolution section.
