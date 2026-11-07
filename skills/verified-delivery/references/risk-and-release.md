# Risk and release

Classify risk from the actual blast radius and reversibility, not file count or confidence.

| Risk | Typical characteristics | Minimum response |
| --- | --- | --- |
| Low | Isolated, reversible change; no sensitive data, authorization, persistence, or production impact | Targeted behavior/regression evidence and diff review |
| Medium | Shared path, meaningful user impact, external dependency, or a reversible persistence/configuration change | Targeted plus relevant integration checks; state containment or rollback approach |
| High | Authentication/authorization, personal or regulated data, payments, destructive action, secrets, production infrastructure, migration, broad audience impact, or difficult reversal | Deep boundary checks, explicit rollback/containment plan, and human approval before merge |

Raise the classification when the environment, observability, ownership, or rollback path is uncertain. A small permission condition can be high risk; a large documentation diff can be low risk.

## Rollback questions

Before recommending review for medium/high risk work, establish what applies:

- Can the code be reverted independently of data/schema changes?
- Is a feature flag, kill switch, or safe disablement path available and tested?
- For data changes, is backward compatibility preserved and is reversal safe, or is a forward repair required?
- What signal detects harm, and who can act on it?
- Does rollback itself create privacy, integrity, or availability risk?

State unknown answers as gaps. Do not perform a deployment, data change, or rollback merely to prove readiness without explicit authorization.
