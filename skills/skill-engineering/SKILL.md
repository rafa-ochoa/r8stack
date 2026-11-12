---
name: skill-engineering
description: "Improves a coding-agent skill from repeated, attributable delivery evidence. Use when a recurring agent failure suggests a skill may need a focused revision, when comparing a proposed skill change against fixed evaluations, or when designing a bounded skill-improvement workflow. Not for automatically rewriting skills, changing an evaluation to make a candidate pass, or replacing an application-level root-cause fix with instructions."
license: MIT
---

# Skill engineering

Improve skills from measured recurring failures, not from dissatisfaction, generic reviewer advice, or a desire for more instructions. A skill change is a hypothesis: identify the failure it should prevent, compare it against fixed evaluation criteria, and stop after a bounded decision.

## Operating rules

- Preserve the primary fix at the lowest effective layer. Correct production code, tests, architecture, tooling, permissions, or documentation before adding instructions when those are the real cause.
- Start with attributable evidence from multiple comparable tasks or sessions. Record the observed failure, user impact, task context, existing instruction, and why a skill change could plausibly prevent recurrence.
- Keep candidate instructions narrow and operational. Do not add broad reminders, duplicate repository rules, speculative safeguards, or a second workflow that conflicts with an existing skill.
- Use fixed, versioned evaluations that the candidate cannot edit to approve itself. Separate trigger routing, behavioral expectations, and overlap decisions.
- Compare baseline and candidate using the same task set and acceptance criteria. Record missed cases, regressions, and uncertainty; do not call a candidate better because its wording is longer or a reviewer prefers it.
- Require independent human approval before publishing, installing, enabling, or promoting a skill revision. A passing evaluation is evidence, not authorization.
- Stop after one proposal and one evaluation decision. A rejected or inconclusive candidate requires new delivery evidence before another revision cycle.

## 1. Establish whether a skill change is justified

Classify the problem before proposing text:

| Observed problem | Preferred response |
| --- | --- |
| A deterministic defect or missing guard | Fix code or tooling and add focused coverage |
| Missing product decision | Ask the owner or document the decision |
| One-off model mistake | Report it; do not add a permanent rule yet |
| Repeated, similar reasoning failure despite adequate system support | Propose a focused skill change |
| Evaluation cannot distinguish baseline from candidate | Improve the independent benchmark before changing the skill |

## 2. Form and test one hypothesis

State the failure, scope, proposed behavior, non-goals, fixed evaluation set, and rollback. Add or amend behavior-focused evaluations only when they describe the failure mode, not a preferred heading or exact phrase.

Run the baseline and candidate against the same evaluation version. A candidate is acceptable only when it improves the intended behavior without causing a material routing, safety, quality, or usability regression. If the evidence is incomplete, return **inconclusive**.

## 3. Report and stop

Lead with **propose revision**, **reject revision**, or **inconclusive**. State the evidence source, the root-cause layer selected, fixed evaluations, observed trade-offs, approval required, and the one next action if needed. Do not schedule continuous self-modification or let a candidate alter its own criteria.

## Boundaries

- `judgment-led-delivery` owns product scope and user-journey readiness.
- `verified-delivery` owns delivery evidence and review readiness.
- `verify-regression-tests` owns proof of named test sensitivity.
- `efficient-execution` owns evidence-preserving efficiency evaluation.

This skill only governs the measured improvement of those instructions and their evaluations.
