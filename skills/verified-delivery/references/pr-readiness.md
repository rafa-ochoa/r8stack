# PR readiness

Use this structure only when a pull request or review handoff is requested. Keep it factual and scaled to the diff.

```md
## Summary
- What changed and the requirement it satisfies

## Review guide
| Acceptance criterion or behavior | Change | Evidence and result | Reviewer check or gap |
| --- | --- | --- | --- |
| <user-observable claim> | <link to relevant diff or file and lines> | <revision-bound test, run, or browser trace and outcome> | <material gap or review decision, if any> |

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

Use the review guide for material or multi-part changes. Group rows by behavior so reviewers can follow the intent across files. For a narrow change, a short bullet can carry the same information.

Link to the exact revision's diff, test run, or browser artifact when available. For local-only evidence, give the revision, command or browser path, and outcome. Keep earlier-revision or inspection evidence explicitly labeled. Highlight changes to tests, fixtures, and snapshots that affect what a result can establish. Put missing essential evidence in the verdict as well as in the relevant row. Keep shared commands and run details under Verification when several rows reference them.
