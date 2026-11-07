# Contributing

Have a reusable skill that helps an AI agent perform real work more effectively? Contributions are welcome across any discipline.

1. Add `skills/<skill-name>/SKILL.md` following the [Agent Skills specification](https://agentskills.io/specification). Include a clear `name`, `description`, when to use it, instructions, and how to verify the result.
2. Keep it self-contained and agent-agnostic. Use `references/` only for detail the agent needs occasionally. Avoid unnecessary scripts, frameworks, and overlapping skills.
3. Follow these rules in every skill:
   - State a narrow purpose and boundary so the skill complements, rather than duplicates or hijacks, other skills and project instructions.
   - Preserve user intent, repository conventions, and authorization boundaries. A passing check or quality verdict is never permission to commit, push, merge, deploy, publish, or make an external change.
   - Require honest evidence: distinguish checks run now, reported earlier, code inspection, and unverified behavior. Never fabricate results, approvals, screenshots, metrics, or integrations.
   - Make the workflow proportional to risk and task size. Name the higher standard for sensitive data, security, authorization, migrations, destructive actions, or difficult-to-reverse changes without imposing heavyweight ceremony on routine work.
   - Include a stopping condition for iterative or externally mutating work. Validate review findings before acting on them; avoid open-ended agent loops, speculative scope, and generic instruction-file rules in place of root-cause fixes.
   - Put shared operating rules in `SKILL.md` and link to focused references only when they add material, occasional-use guidance. Do not duplicate reference content in the entrypoint.
   - Add behavior-focused evaluations for a new or substantially revised skill. Cover the intended trigger, a likely misroute, and the safety or quality constraint most likely to fail; do not test headings or exact phrasing.
4. Add a brief `README.md` with a real example. A visual cover (`cover.svg` or `cover.png`) is encouraged for sharing, **not required** for community contributions.
5. Open a pull request describing the problem the skill solves, a sample invocation, and any tools, risks, or permissions involved.

Keep private information, secrets, and proprietary prompts out of the repository. Attribute source material and follow the [MIT license](LICENSE).

You can optionally validate an individual skill with `skills-ref validate skills/<skill-name>` if you have the [reference validator](https://github.com/agentskills/agentskills) installed. No custom repository tooling is required.
