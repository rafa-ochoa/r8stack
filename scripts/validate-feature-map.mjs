import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const evidenceKinds = new Set(['test', 'trace', 'screenshot', 'manual']);
const riskLevels = new Set(['low', 'medium', 'high']);
const criticalityLevels = new Set(['low', 'medium', 'high']);

export function validateFeatureMap(featureMap) {
  const violations = [];

  if (!isNonEmptyString(featureMap?.feature)) violations.push('feature must be a non-empty string');
  if (!isCommitRevision(featureMap?.revision)) violations.push('revision must be a 40-character Git commit SHA');
  if (!riskLevels.has(featureMap?.risk)) violations.push('risk must be low, medium, or high');

  if (!Array.isArray(featureMap?.flows) || featureMap.flows.length === 0) {
    violations.push('flows must include at least one user-observable flow');
    return violations;
  }

  const flowIds = new Set();
  featureMap.flows.forEach((flow, flowIndex) => {
    const prefix = `flows[${flowIndex}]`;
    if (!isNonEmptyString(flow?.id)) {
      violations.push(`${prefix}.id must be a non-empty string`);
    } else if (flowIds.has(flow.id)) {
      violations.push(`${prefix}.id must be unique`);
    } else {
      flowIds.add(flow.id);
    }

    if (!isNonEmptyString(flow?.outcome)) violations.push(`${prefix}.outcome must be a non-empty string`);
    if (!criticalityLevels.has(flow?.criticality)) {
      violations.push(`${prefix}.criticality must be low, medium, or high`);
    }
    validateVerification(flow?.verification, prefix, violations);
  });

  return violations;
}

function validateVerification(verification, prefix, violations) {
  if (!Array.isArray(verification) || verification.length === 0) {
    violations.push(`${prefix}.verification must include at least one evidence item`);
    return;
  }

  verification.forEach((evidence, evidenceIndex) => {
    const evidencePrefix = `${prefix}.verification[${evidenceIndex}]`;
    if (!evidenceKinds.has(evidence?.kind)) {
      violations.push(`${evidencePrefix}.kind must be test, trace, screenshot, or manual`);
      return;
    }

    if (evidence.kind === 'test' && !isNonEmptyString(evidence.command)) {
      violations.push(`${evidencePrefix} test evidence must include the command run`);
    }
    if (evidence.kind !== 'test' && !isNonEmptyString(evidence.path)) {
      violations.push(`${evidencePrefix} ${evidence.kind} evidence must include an artifact path`);
    }
    if (evidence.kind === 'screenshot' && !['recorded', 'unavailable', 'not-applicable'].includes(evidence.status)) {
      violations.push(`${evidencePrefix} screenshot evidence must use status recorded, unavailable, or not-applicable`);
    }
    if (evidence.kind !== 'screenshot' && !['passed', 'failed', 'recorded', 'unavailable', 'not-applicable'].includes(evidence.status)) {
      violations.push(`${evidencePrefix}.status must record the observed result`);
    }
  });
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isCommitRevision(value) {
  return typeof value === 'string' && /^[0-9a-f]{40}$/i.test(value);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const featureMapPath = process.argv[2];
  if (featureMapPath === undefined) {
    console.error('Usage: node scripts/validate-feature-map.mjs <feature-map.json>');
    process.exitCode = 1;
  } else {
    try {
      const featureMap = JSON.parse(await readFile(featureMapPath, 'utf8'));
      const violations = validateFeatureMap(featureMap);
      if (violations.length > 0) {
        console.error(violations.map(violation => `- ${violation}`).join('\n'));
        process.exitCode = 1;
      } else {
        console.log('Feature map: valid');
      }
    } catch (error) {
      console.error(`Could not validate feature map: ${error.message}`);
      process.exitCode = 1;
    }
  }
}
