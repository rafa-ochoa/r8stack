# TokenEconomizer integration review

`TokenEconomizer` is an external Apache-2.0 plugin, not code maintained by this skill catalog. It is relevant because it already provides three execution mechanisms that overlap with common Mod proposals:

| Mechanism | What it does | Catalog boundary |
| --- | --- | --- |
| Micro-skills | Learns repository facts from prior sessions and injects them later | May reduce rediscovery; must not replace repository instructions or handoff evidence |
| Tool pruning | Proposes or applies a reversible deny list for unused tools | Changes the agent's available capabilities; requires explicit approval and a restore path |
| Loop guard | Detects a failing-loop pattern and redirects a stuck turn | May interrupt waste; cannot call a change verified or suppress a necessary diagnostic path |

## Local compatibility finding

The installed plugin documents Claude Code support through version 2.1.310. The local host was observed at 2.1.319. This is an **inspection finding**, not a compatibility result. Do not infer that an enabled installation remains supported after a host update.

## Safe evaluation sequence

1. Record the current plugin version, host version, enabled mechanisms, and repository-local configuration.
2. Read the exact hook and configuration behavior for the mechanism under consideration. Do not rely on its marketing page or benchmark headline.
3. Use a disposable or low-risk repository and a fixed task set. Keep acceptance criteria, test commands, and evidence requirements identical with and without the mechanism.
4. Start with status-only or proposal-only behavior. Do not allow tool pruning to write a repository configuration until the proposal and restore command have been reviewed.
5. Confirm that failing-test output, paths, changed-file information, decisions, blockers, and required checks remain available to the agent and reviewer.
6. Compare task completion and verification outcomes before latency or usage. Reject any candidate that skips a required check or loses material diagnostic detail.
7. Keep the mechanism only with explicit approval and a tested disable or restore path. Record the host and plugin versions tested.

## Non-goals

This catalog does not vendor TokenEconomizer, promise its benchmark results, install it, enable a mechanism, grant hook permissions, change its settings, or update its checkout. Use the external project's own documentation and tests for its runtime behavior.
