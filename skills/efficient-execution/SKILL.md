---
name: efficient-execution
description: "Plans and evaluates coding-agent efficiency improvements without weakening correctness. Use when reducing agent token use, context size, model effort, browser payloads, or long-session friction; when reviewing or selecting Claude Code Mods, hooks, plugins, or model routers; or when deciding whether an execution optimization is worth its operational and verification risk. Not for installing, enabling, or changing a plugin without explicit authorization; not for product scope, implementation delivery, or proving a regression test."
license: MIT
---

# Efficient execution

Optimize execution only when the expected saving can be measured without reducing the evidence required for the work. Treat Mods, hooks, plugins, model gateways, and context processors as privileged code: inspect their behavior, permissions, data handling, failure mode, and rollback path before recommending activation.

## Operating rules

- Start with a concrete baseline: task type, completion quality, verification result, latency, and available usage data. A claimed percentage saving without a comparable baseline is a hypothesis, not an outcome.
- Preserve source paths, line numbers, stack traces, structured errors, test output, changed-file lists, decisions, blockers, and verification evidence. Summaries may compress routine material only when they retain the information needed to act safely.
- Never downgrade required reasoning, model capability, review depth, test coverage, security checks, or human approval because a task is expensive. High-risk work is ineligible for automatic downgrades.
- Keep optimization reversible. Prefer an opt-in configuration, a dry run, or a scoped pilot; record how to disable or remove it. Do not install, enable, authenticate, grant permissions to, or update a Mod without explicit authorization.
- Do not run untrusted plugins merely to inspect their claims. Read the manifest, source, documentation, and tests first; classify unknown code or unavailable source as unverified.
- Attribute outcomes honestly as **measured now**, **reported earlier**, **inspection**, or **unverified**. Do not represent marketing claims, synthetic benchmarks, or a green plugin test suite as proof of safety or savings in the user's environment.
- Stop when the requested recommendation, audit, or bounded pilot result is supported. Do not create a self-tuning loop that repeatedly changes routing policies without new evidence and an independent benchmark.

## 1. Classify the optimization and its safety floor

Identify the mechanism and what it can affect:

| Mechanism | Acceptable objective | Safety floor |
| --- | --- | --- |
| Context reduction | Remove duplicate or low-value routine material | Preserve failures, decisions, affected paths, and evidence verbatim or in structured fields |
| Model or effort routing | Match routine work to an adequate capability | Never downgrade security, data, authorization, incident, migration, or required-review work |
| Handoff | Continue a long task with a compact state | Preserve goal, decisions, changed files, current diff, checks and outcomes, blockers, and next action |
| Browser payload reduction | Reduce visual payload where detail is nonessential | Keep full-resolution evidence when diagnosing UI, visual, accessibility, or image defects |
| Cache use | Reuse stable context when the host supports it | Measure actual billed usage and avoid churn that invalidates a useful cache |
| Loop control | Detect repeated unproductive work | Escalate with evidence; never suppress a necessary fix or falsely declare success |

If the mechanism can rewrite prompts, tool arguments, tool results, permissions, commands, files, credentials, network traffic, or user-visible output, treat it as privileged and require source review plus an explicit activation decision.

## 2. Select the smallest safe trial

Choose one independently measurable change. Define a fixed representative task set, the baseline configuration, candidate configuration, completion criteria, required verification, and stop condition before changing the setup.

Compare quality before cost:

1. Run the same task category with the existing setup and record outcome, verification, elapsed time, and usage available from the host.
2. Run the candidate only in an opt-in, reversible scope.
3. Reject the candidate if it loses required evidence, changes a protected outcome, causes a new failure, or cannot be attributed reliably.
4. Keep it only when the outcome is comparable and the measured saving justifies its complexity and operational risk.

Do not infer savings from token totals alone when cache pricing, model changes, retries, or hidden side calls differ. Compare the available billed usage and task outcome on the same basis; otherwise state that cost evidence is incomplete.

## 3. Coordinate with delivery skills

- `judgment-led-delivery` owns whether the product work is useful and whether the user journey is ready.
- `verified-delivery` owns implementation evidence, risk-sensitive review, rollback readiness, and merge readiness.
- `verify-regression-tests` owns proof that a named test detects its protected behavior.

This skill may make those workflows more efficient, but it cannot replace or weaken their checks. When a Mod reports a test result, verify it through the repository's real command before treating it as delivery evidence.

For the existing TokenEconomizer integration, use [the focused review](references/tokeneconomizer-integration.md). It documents the shared boundary and a safe evaluation sequence; it is not installation approval.

## 4. Report a bounded decision

Lead with one of: **recommend pilot**, **do not adopt**, **not enough evidence**, or **safe to activate with approval**. Include the mechanism, what was inspected or measured, protected evidence, explicit permissions or side effects, rollback method, and the next action only when it is needed.

## Red flags

- Installing or enabling a plugin because its README promises savings
- Dropping stack traces, exact failures, paths, decisions, or test output from a handoff
- Automatically routing high-risk work to a cheaper or lower-effort model
- Counting a lower token total as success when completion quality or verification changed
- Letting an optimization rewrite its own benchmark or promote itself without independent evidence
- Treating a plugin's passing unit tests as a security audit
