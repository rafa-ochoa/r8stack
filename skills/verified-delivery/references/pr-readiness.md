# PR readiness

Use this structure only when a pull request or review handoff is requested. Keep it factual and scaled to the diff.

```md
## Summary
- What changed and the requirement it satisfies

## Verification
- [passed] `<command or action>` — what it covered
- [not run / unavailable] `<check>` — why and whether it blocks review

## Review and risk
- Risk: low / medium / high — rationale
- Review: <rounds completed>/3; validated findings fixed or unresolved
- Security/privacy/data considerations: <only applicable facts>

## Rollback and approval
- Containment or reversal: <actual mechanism or known gap>
- Required approval: <if any>; no merge or deploy performed
```

Do not include empty headings, invented links, generic risk boilerplate, or a statement that approval has been granted when it has not.
