# Sabotage tests

**Prove a test detects the regression it claims to prevent.**

`sabotage-tests` verifies a test by breaking the relevant production behavior in a safe, isolated copy and confirming the test fails at the intended assertion. It catches false confidence from broad snapshots, project-owned mocks, coverage-only claims, or a test that never notices a wrong result.

It does not replace feature implementation, test-first development, or release verification. It proves the sensitivity of tests that already exist or have just been changed.

## Install

Install this skill for Codex and Claude Code:

```bash
npx skills add rafa-ochoa/r8a-skills --skill sabotage-tests -g -a codex -a claude-code -y
```

Remove `-g` for a project-only installation. After the skill is merged, update it with:

```bash
npx skills update sabotage-tests -g -y
```

## Use

> Use sabotage-tests to prove the new save-error test detects a failed persistence call. Work in a scratch copy and do not modify the production checkout.

> Review these checkout tests with sabotage-tests. Find project-owned mocks, then prove the remaining assertions detect the important failures.

## What you get

Each reported behavior is classified as caught, missed, inconclusive, or untestable. The report records the safe sabotage and the assertion-level evidence, rather than simply counting green tests or coverage.

## Read more

- [Skill instructions](SKILL.md)
- [Evaluations](evals/evals.json)
