import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const minimumRuns = 3;
const outcomes = new Set(['met', 'not-met', 'unclear']);

export function compareSkillEvaluations({ skillName, evaluationRevision, evaluation, baseline, candidate }) {
  validateCommit(evaluationRevision, 'evaluationRevision');
  const caseIds = evaluation.evals.map(({ id }) => id);
  validateResults(baseline, 'baseline', caseIds);
  validateResults(candidate, 'candidate', caseIds);

  const baselineOutcomes = summarizeOutcomes(baseline, caseIds);
  const candidateOutcomes = summarizeOutcomes(candidate, caseIds);
  const regressions = caseIds.flatMap(id => (
    baselineOutcomes[id] === 'met' && candidateOutcomes[id] !== 'met'
      ? [{ id, baseline: baselineOutcomes[id], candidate: candidateOutcomes[id] }]
      : []
  ));
  const hasInconclusiveCase = Object.values(candidateOutcomes).includes('inconclusive');

  return {
    format: 'r8stack-skill-evaluation/v1',
    skill: skillName,
    evaluation_revision: evaluationRevision,
    baseline_revision: baseline.revision,
    candidate_revision: candidate.revision,
    minimum_runs_per_side: minimumRuns,
    baseline: baselineOutcomes,
    candidate: candidateOutcomes,
    regressions,
    verdict: regressions.length > 0 ? 'reject' : hasInconclusiveCase ? 'inconclusive' : 'human-review-required',
    approval_required: true,
    promotion_performed: false
  };
}

function validateResults(results, side, caseIds) {
  if (results === null || typeof results !== 'object') throw new Error(`${side} results are required`);
  validateCommit(results.revision, `${side}.revision`);
  if (!Array.isArray(results.runs) || results.runs.length < minimumRuns) {
    throw new Error(`${side}.runs must contain at least ${minimumRuns} runs`);
  }

  for (const [runIndex, run] of results.runs.entries()) {
    if (!Array.isArray(run?.cases)) throw new Error(`${side}.runs[${runIndex}].cases must be an array`);
    const actualIds = run.cases.map(evaluationCase => evaluationCase?.id);
    if (actualIds.length !== caseIds.length || new Set(actualIds).size !== caseIds.length || !caseIds.every(id => actualIds.includes(id))) {
      throw new Error(`${side}.runs[${runIndex}].cases must contain each fixed evaluation exactly once`);
    }
    for (const evaluationCase of run.cases) {
      if (!outcomes.has(evaluationCase.outcome)) {
        throw new Error(`${side}.runs[${runIndex}] case ${evaluationCase.id} must have outcome met, not-met, or unclear`);
      }
    }
  }
}

function summarizeOutcomes(results, caseIds) {
  return Object.fromEntries(caseIds.map(id => {
    const runOutcomes = results.runs.map(run => run.cases.find(evaluationCase => evaluationCase.id === id).outcome);
    const stableOutcome = runOutcomes.every(outcome => outcome === runOutcomes[0]) ? runOutcomes[0] : 'inconclusive';
    return [id, stableOutcome];
  }));
}

function validateCommit(revision, label) {
  if (typeof revision !== 'string' || !/^[0-9a-f]{40}$/i.test(revision)) {
    throw new Error(`${label} must be a 40-character Git commit SHA`);
  }
}

async function main() {
  const argumentsByName = parseArguments(process.argv.slice(2));
  const requiredArguments = ['skill', 'evaluation', 'evaluation-revision', 'baseline-results', 'candidate-results', 'output'];
  const missingArgument = requiredArguments.find(name => argumentsByName[name] === undefined);
  if (missingArgument !== undefined) {
    throw new Error(`Missing --${missingArgument}. Usage: node scripts/evaluate-skill.mjs --skill <name> --evaluation <evals.json> --evaluation-revision <sha> --baseline-results <json> --candidate-results <json> --output <comparison.json>`);
  }

  const [evaluation, baseline, candidate] = await Promise.all([
    readJson(argumentsByName.evaluation),
    readJson(argumentsByName['baseline-results']),
    readJson(argumentsByName['candidate-results'])
  ]);
  if (evaluation.skill_name !== argumentsByName.skill) {
    throw new Error(`Evaluation skill_name must match ${argumentsByName.skill}`);
  }

  const comparison = compareSkillEvaluations({
    skillName: argumentsByName.skill,
    evaluationRevision: argumentsByName['evaluation-revision'],
    evaluation,
    baseline,
    candidate
  });
  const outputPath = resolve(argumentsByName.output);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(comparison, null, 2)}\n`);
  console.log(`Evaluation comparison written to ${outputPath}`);
  console.log(`Verdict: ${comparison.verdict}; human approval required: true`);
  process.exitCode = comparison.verdict === 'reject' ? 1 : 0;
}

function parseArguments(argumentList) {
  const argumentsByName = {};
  for (let index = 0; index < argumentList.length; index += 2) {
    const name = argumentList[index];
    const value = argumentList[index + 1];
    if (!name?.startsWith('--') || value === undefined || argumentsByName[name.slice(2)] !== undefined) {
      throw new Error('Arguments must be unique --name value pairs');
    }
    argumentsByName[name.slice(2)] = value;
  }
  return argumentsByName;
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error(`Skill evaluation failed: ${error.message}`);
    process.exitCode = 1;
  });
}
