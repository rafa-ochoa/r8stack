import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { validateSkillEvaluations } from '../scripts/validate-skill-evaluations.mjs';

const repositoryPath = join(import.meta.dirname, '..');

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

const comparedEvaluation = {
  ...structuredClone(validEvaluation),
  skill_name: 'judgment-led-delivery',
  overlap_review: { compared_with: ['example-skill'], decision: 'Owns product judgment, not audits.' }
};

async function writeSkill(catalogPath, skillName, evaluation) {
  const skillPath = join(catalogPath, 'skills', skillName);

  await mkdir(join(skillPath, 'evals'), { recursive: true });
  await writeFile(
    join(skillPath, 'SKILL.md'),
    `---\nname: ${skillName}\ndescription: Example skill.\n---\n`
  );
  await writeFile(join(skillPath, 'README.md'), '# Example skill\n');
  await writeFile(join(skillPath, 'evals', 'evals.json'), JSON.stringify(evaluation));
}

async function createCatalog(evaluation = validEvaluation) {
  const catalogPath = await mkdtemp(join(tmpdir(), 'r8-skills-'));

  await writeSkill(catalogPath, 'example-skill', evaluation);
  await writeSkill(catalogPath, 'judgment-led-delivery', comparedEvaluation);

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

test('rejects a skill whose directory does not match its declared name', async () => {
  const catalogPath = await createCatalog();
  await writeFile(
    join(catalogPath, 'skills', 'example-skill', 'SKILL.md'),
    '---\nname: different-skill\ndescription: Example skill.\n---\n'
  );

  const violations = await validateSkillEvaluations(catalogPath);

  assert.deepEqual(violations, [
    'skills/example-skill directory name must match different-skill',
    'skills/example-skill/evals/evals.json skill_name must match different-skill'
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

test('rejects behavioral evaluation ids that are not positive integers', async () => {
  const evaluation = structuredClone(validEvaluation);
  evaluation.evals[0].id = 0;
  const catalogPath = await createCatalog(evaluation);

  const violations = await validateSkillEvaluations(catalogPath);

  assert.deepEqual(violations, [
    'skills/example-skill/evals/evals.json evals ids must be unique positive integers'
  ]);
});

test('rejects duplicate behavioral evaluation ids', async () => {
  const evaluation = structuredClone(validEvaluation);
  evaluation.evals[2].id = 1;
  const catalogPath = await createCatalog(evaluation);

  const violations = await validateSkillEvaluations(catalogPath);

  assert.deepEqual(violations, [
    'skills/example-skill/evals/evals.json evals ids must be unique positive integers'
  ]);
});

test('rejects a whitespace-only trigger prompt', async () => {
  const evaluation = structuredClone(validEvaluation);
  evaluation.trigger.negative[0].prompt = '   ';
  const catalogPath = await createCatalog(evaluation);

  const violations = await validateSkillEvaluations(catalogPath);

  assert.deepEqual(violations, [
    'skills/example-skill/evals/evals.json must include at least 2 negative triggers'
  ]);
});

test('rejects an overlap review that names a skill outside the catalog', async () => {
  const evaluation = structuredClone(validEvaluation);
  evaluation.overlap_review.compared_with = ['judgment-led-delivery', 'missing-skill'];
  const catalogPath = await createCatalog(evaluation);

  const violations = await validateSkillEvaluations(catalogPath);

  assert.deepEqual(violations, [
    'skills/example-skill/evals/evals.json overlap_review.compared_with names unknown skill missing-skill'
  ]);
});

test('rejects a Markdown link to a missing local file', async () => {
  const catalogPath = await createCatalog();
  await writeFile(
    join(catalogPath, 'skills', 'example-skill', 'README.md'),
    '# Example\n\n[Instructions](SKILL.md#use) and [notes](references/missing.md).\n'
  );

  const violations = await validateSkillEvaluations(catalogPath);

  assert.deepEqual(violations, [
    'skills/example-skill/README.md links to missing file references/missing.md'
  ]);
});

test('rejects a missing SVG image without rendering it', async () => {
  const catalogPath = await createCatalog();
  await writeFile(join(catalogPath, 'skills', 'example-skill', 'present.svg'), 'not an svg');
  await writeFile(
    join(catalogPath, 'skills', 'example-skill', 'README.md'),
    '![Present](present.svg)\n![Cover](cover.svg)\n'
  );

  const violations = await validateSkillEvaluations(catalogPath);

  assert.deepEqual(violations, [
    'skills/example-skill/README.md links to missing file cover.svg'
  ]);
});

test('rejects a Markdown link that leaves the repository', async () => {
  const catalogPath = await createCatalog();
  await writeFile(join(catalogPath, 'README.md'), '[Outside](../outside.md)\n');

  const violations = await validateSkillEvaluations(catalogPath);

  assert.deepEqual(violations, [
    'README.md links outside the repository: ../outside.md'
  ]);
});

test('ignores external URLs, anchors, and links inside code fences', async () => {
  const catalogPath = await createCatalog();
  await writeFile(
    join(catalogPath, 'README.md'),
    '# Top\n\n[Web](https://example.com) [Mail](mailto:a@example.com) [Here](#top)\n\n```md\n[Fake](missing.md)\n```\n'
  );

  const violations = await validateSkillEvaluations(catalogPath);

  assert.deepEqual(violations, []);
});

test('delivery-flow evaluates every supported route before it is published', async () => {
  const evaluationPath = join(repositoryPath, 'skills', 'delivery-flow', 'evals', 'evals.json');
  const evaluation = JSON.parse(await readFile(evaluationPath, 'utf8'));
  const expectedRoutes = [
    ['clear-feature', ['intake', 'build', 'verify', 'done']],
    ['narrow-bug-fix', ['intake', 'build', 'verify', 'done']],
    ['high-risk-blocked', ['intake', 'clarify', 'blocked']],
    ['high-risk-approved', ['intake', 'clarify', 'build', 'verify', 'blocked']],
    ['regression-proof', ['intake', 'prove-regression', 'done']],
    ['mod-evaluation', ['intake', 'evaluate-mod', 'done']],
    ['skill-assessment', ['intake', 'assess-skill', 'done']]
  ];

  assert.deepEqual(
    evaluation.evals.map(({ route, expected_states: expectedStates }) => [route, expectedStates]),
    expectedRoutes
  );

  for (const { expectations } of evaluation.evals) {
    assert.ok(expectations.some(expectation => expectation.includes('stops')));
  }

  for (const { prompt } of evaluation.trigger.positive) {
    assert.match(prompt, /^Use delivery-flow\b/);
  }
});

test('delivery-flow requires an explicit Codex invocation and prepares host-visible handoffs', async () => {
  const skillPath = join(repositoryPath, 'skills', 'delivery-flow');
  const [skill, policy] = await Promise.all([
    readFile(join(skillPath, 'SKILL.md'), 'utf8'),
    readFile(join(skillPath, 'agents', 'openai.yaml'), 'utf8')
  ]);

  assert.match(policy, /allow_implicit_invocation:\s*false/);
  assert.match(skill, /Prepare an explicit next-stage prompt and handoff record/);
  assert.doesNotMatch(skill, /hand the actual diff and evidence to/);
});
