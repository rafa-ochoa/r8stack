import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { validateSkillEvaluations } from '../scripts/validate-skill-evaluations.mjs';

const validEvaluation = {
  skill_name: 'example-skill',
  trigger: {
    positive: [
      { prompt: 'Audit account recovery before release.' },
      { prompt: 'Review the onboarding flow without editing files.' },
      { prompt: 'Check the checkout error state.' }
    ],
    negative: [
      { prompt: 'Build a new dashboard.' },
      { prompt: 'Fix the deployment pipeline.' }
    ]
  },
  overlap_review: {
    compared_with: ['judgment-led-delivery'],
    decision: 'This skill audits an existing named journey; it does not own implementation or a product-wide readiness verdict.'
  },
  evals: [
    { id: 1, prompt: 'Audit sign-up.', expected_output: 'An audit.', expectations: ['No file edits.'] },
    { id: 2, prompt: 'Audit checkout.', expected_output: 'An audit.', expectations: ['Evidence is labeled.'] },
    { id: 3, prompt: 'Audit filters.', expected_output: 'An audit.', expectations: ['Gaps are named.'] }
  ]
};

async function createCatalog(evaluation = validEvaluation) {
  const catalogPath = await mkdtemp(join(tmpdir(), 'r8a-skills-'));
  const skillPath = join(catalogPath, 'skills', 'example-skill');

  await mkdir(join(skillPath, 'evals'), { recursive: true });
  await writeFile(
    join(skillPath, 'SKILL.md'),
    '---\nname: example-skill\ndescription: Example skill.\n---\n'
  );
  await writeFile(join(skillPath, 'evals', 'evals.json'), JSON.stringify(evaluation));

  return catalogPath;
}

test('accepts a skill with routing, behavioral, and overlap evidence', async () => {
  const catalogPath = await createCatalog();

  const violations = await validateSkillEvaluations(catalogPath);

  assert.deepEqual(violations, []);
});

test('rejects a skill without three positive triggers', async () => {
  const evaluation = structuredClone(validEvaluation);
  evaluation.trigger.positive.pop();
  const catalogPath = await createCatalog(evaluation);

  const violations = await validateSkillEvaluations(catalogPath);

  assert.deepEqual(violations, [
    'skills/example-skill/evals/evals.json must include at least 3 positive triggers'
  ]);
});

test('rejects a skill without two negative triggers', async () => {
  const evaluation = structuredClone(validEvaluation);
  evaluation.trigger.negative.pop();
  const catalogPath = await createCatalog(evaluation);

  const violations = await validateSkillEvaluations(catalogPath);

  assert.deepEqual(violations, [
    'skills/example-skill/evals/evals.json must include at least 2 negative triggers'
  ]);
});

test('rejects a skill without three behavioral evaluations', async () => {
  const evaluation = structuredClone(validEvaluation);
  evaluation.evals.pop();
  const catalogPath = await createCatalog(evaluation);

  const violations = await validateSkillEvaluations(catalogPath);

  assert.deepEqual(violations, [
    'skills/example-skill/evals/evals.json must include at least 3 complete behavioral evaluations'
  ]);
});

test('rejects a skill without a documented overlap decision', async () => {
  const evaluation = structuredClone(validEvaluation);
  delete evaluation.overlap_review;
  const catalogPath = await createCatalog(evaluation);

  const violations = await validateSkillEvaluations(catalogPath);

  assert.deepEqual(violations, [
    'skills/example-skill/evals/evals.json must include overlap_review.compared_with and overlap_review.decision'
  ]);
});

test('rejects an overlap review that names no compared skills', async () => {
  const evaluation = structuredClone(validEvaluation);
  evaluation.overlap_review.compared_with = [];
  const catalogPath = await createCatalog(evaluation);

  const violations = await validateSkillEvaluations(catalogPath);

  assert.deepEqual(violations, [
    'skills/example-skill/evals/evals.json must include overlap_review.compared_with and overlap_review.decision'
  ]);
});
