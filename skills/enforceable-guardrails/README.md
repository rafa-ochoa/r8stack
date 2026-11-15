# Enforceable guardrails

Turn a known failure into a check that prevents it at the right boundary.

Install it globally for Codex and Claude Code:

```bash
npx skills add rafa-ochoa/r8stack --skill enforceable-guardrails -g -a codex -a claude-code -y
```

> Use enforceable-guardrails to prevent release evidence from being attributed to the wrong revision. Reuse the repository's existing verification path, add a positive and negative test, and record the resulting feature map. Do not publish or change CI configuration.

Use this after a recurring failure or a specific review finding—not for a generic request to make agents more careful. It complements [Verified delivery](../verified-delivery/README.md), which gathers release evidence, and [Skill engineering](../skill-engineering/README.md), which evaluates changes to agent instructions.

## Feature-map artifact

For a feature with meaningful risk, create a JSON record from [`examples/feature-map.json`](../../examples/feature-map.json). It captures the revision, user-observable flows, checks run, and visual/runtime artifacts when available.

Validate it with:

```bash
node scripts/validate-feature-map.mjs path/to/feature-map.json
```

The validator checks that a map has an exact revision and meaningful evidence metadata. It does not execute the recorded commands or pretend unavailable screenshots exist.

[Skill instructions](SKILL.md) · [Evaluations](evals/evals.json)
