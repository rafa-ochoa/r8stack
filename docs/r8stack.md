# r8stack decision record

`r8stack` is the project's official identity and repository name. It preserves compatibility with Codex and Claude Code through the standard Agent Skills format and the same explicit agent targets in its installation commands.

## System, not a factory

The Software Factory framing is useful when it means a coherent engineering system: skills, executable restrictions, evidence, and feedback reinforce each other. It is rejected when it implies a heavy control plane, autonomous publishing, or a mandatory multi-agent assembly line. `delivery-flow` is therefore optional and prepares explicit handoffs rather than automatically invoking tools or agents.

## Product judgment before throughput

The Zach Lloyd discussion is reconciled as a bias toward a fast, low-friction developer experience. That does not justify bypassing product judgment: `judgment-led-delivery` remains the entry point for deciding whether a change should exist and for delivering the smallest complete user outcome.

## Mods are optimization experiments

Claude Mods are neither part of delivery evidence nor an installed dependency of this catalog. `efficient-execution` and the [Mod compatibility pilot](mod-compatibility-pilot.md) treat them as opt-in, reversible experiments. A Mod cannot remove real repository checks, and activation needs separate explicit authorization.

## Learning is measured and human-approved

The Lauren Tan discussion is reconciled as a learning-loop requirement: repeated, attributable failures become a hypothesis, fixed versioned evaluations compare baseline and candidate, and a human approves promotion. `skill-engineering` owns that process. `enforceable-guardrails` handles the earlier question of whether the root cause instead belongs in the product, test suite, or repository tooling.

## Operating model

1. Choose the smallest useful outcome with `judgment-led-delivery`.
2. Prevent demonstrated recurring failures with `enforceable-guardrails`.
3. Verify the implemented revision with `verified-delivery`, including a feature map when risk warrants it.
4. Use `delivery-flow` only when one explicit entry point helps coordinate the above.
5. Improve skills only through `skill-engineering`'s fixed evaluations and human approval.

This is intentionally a composable stack, not a requirement to run five stages for every task.
