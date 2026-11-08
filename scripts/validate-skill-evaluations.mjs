import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve } from 'node:path';

const minimumPositiveTriggers = 3;
const minimumNegativeTriggers = 2;
const minimumBehaviorEvaluations = 3;

export async function validateSkillEvaluations(catalogPath) {
  const skillsPath = join(catalogPath, 'skills');
  const skillEntries = await readdir(skillsPath, { withFileTypes: true });
  const skillDirectories = skillEntries.filter(entry => entry.isDirectory());
  const violations = [];

  for (const skillDirectory of skillDirectories) {
    const skillPath = join(skillsPath, skillDirectory.name);
    const skillFilePath = join(skillPath, 'SKILL.md');
    const evaluationFilePath = join(skillPath, 'evals', 'evals.json');
    const skillName = await readSkillName(skillFilePath, catalogPath, violations);
    const evaluation = await readEvaluation(evaluationFilePath, catalogPath, violations);

    if (skillName === null || evaluation === null) continue;

    validateEvaluationName(evaluation, skillName, evaluationFilePath, catalogPath, violations);
    validateTriggerPrompts(evaluation, evaluationFilePath, catalogPath, violations);
    validateBehaviorEvaluations(evaluation, evaluationFilePath, catalogPath, violations);
    validateOverlapReview(evaluation, evaluationFilePath, catalogPath, violations);
  }

  return violations;
}

async function readSkillName(skillFilePath, catalogPath, violations) {
  let skillFile;

  try {
    skillFile = await readFile(skillFilePath, 'utf8');
  } catch {
    violations.push(`${toCatalogPath(skillFilePath, catalogPath)} is required`);
    return null;
  }

  const skillName = skillFile.match(/^name:\s*([^\n]+)$/m)?.[1]?.trim();
  if (skillName === undefined || skillName.length === 0) {
    violations.push(`${toCatalogPath(skillFilePath, catalogPath)} must declare a name`);
    return null;
  }

  return skillName.replace(/^['"]|['"]$/g, '');
}

async function readEvaluation(evaluationFilePath, catalogPath, violations) {
  let evaluationFile;

  try {
    evaluationFile = await readFile(evaluationFilePath, 'utf8');
  } catch {
    violations.push(`${toCatalogPath(evaluationFilePath, catalogPath)} is required`);
    return null;
  }

  try {
    return JSON.parse(evaluationFile);
  } catch {
    violations.push(`${toCatalogPath(evaluationFilePath, catalogPath)} must contain valid JSON`);
    return null;
  }
}

function validateEvaluationName(evaluation, skillName, evaluationFilePath, catalogPath, violations) {
  if (evaluation.skill_name !== skillName) {
    violations.push(`${toCatalogPath(evaluationFilePath, catalogPath)} skill_name must match ${skillName}`);
  }
}

function validateTriggerPrompts(evaluation, evaluationFilePath, catalogPath, violations) {
  const evaluationPath = toCatalogPath(evaluationFilePath, catalogPath);
  const positiveTriggers = evaluation.trigger?.positive;
  const negativeTriggers = evaluation.trigger?.negative;

  if (!hasPromptEntries(positiveTriggers, minimumPositiveTriggers)) {
    violations.push(`${evaluationPath} must include at least ${minimumPositiveTriggers} positive triggers`);
  }

  if (!hasPromptEntries(negativeTriggers, minimumNegativeTriggers)) {
    violations.push(`${evaluationPath} must include at least ${minimumNegativeTriggers} negative triggers`);
  }
}

function validateBehaviorEvaluations(evaluation, evaluationFilePath, catalogPath, violations) {
  const evaluationPath = toCatalogPath(evaluationFilePath, catalogPath);
  const behaviorEvaluations = evaluation.evals;
  const hasMinimumEvaluations = Array.isArray(behaviorEvaluations)
    && behaviorEvaluations.length >= minimumBehaviorEvaluations;
  const hasCompleteEvaluations = hasMinimumEvaluations
    && behaviorEvaluations.every(hasBehaviorEvaluationShape);

  if (!hasCompleteEvaluations) {
    violations.push(`${evaluationPath} must include at least ${minimumBehaviorEvaluations} complete behavioral evaluations`);
  }
}

function validateOverlapReview(evaluation, evaluationFilePath, catalogPath, violations) {
  const evaluationPath = toCatalogPath(evaluationFilePath, catalogPath);
  const overlapReview = evaluation.overlap_review;
  const hasComparedSkills = Array.isArray(overlapReview?.compared_with)
    && overlapReview.compared_with.length > 0
    && overlapReview.compared_with.every(skillName => typeof skillName === 'string' && skillName.length > 0);
  const hasDecision = typeof overlapReview?.decision === 'string' && overlapReview.decision.trim().length > 0;

  if (!hasComparedSkills || !hasDecision) {
    violations.push(`${evaluationPath} must include overlap_review.compared_with and overlap_review.decision`);
  }
}

function hasPromptEntries(entries, minimumEntries) {
  return Array.isArray(entries)
    && entries.length >= minimumEntries
    && entries.every(entry => typeof entry?.prompt === 'string' && entry.prompt.trim().length > 0);
}

function hasBehaviorEvaluationShape(evaluation) {
  return Number.isInteger(evaluation?.id)
    && typeof evaluation.prompt === 'string'
    && evaluation.prompt.trim().length > 0
    && typeof evaluation.expected_output === 'string'
    && evaluation.expected_output.trim().length > 0
    && Array.isArray(evaluation.expectations)
    && evaluation.expectations.length > 0
    && evaluation.expectations.every(expectation => typeof expectation === 'string' && expectation.trim().length > 0);
}

function toCatalogPath(filePath, catalogPath) {
  return relative(catalogPath, filePath).replaceAll('\\', '/');
}

const isCliInvocation = process.argv[1] === fileURLToPath(import.meta.url);

if (isCliInvocation) {
  const catalogPath = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const violations = await validateSkillEvaluations(catalogPath);

  if (violations.length > 0) {
    console.error(violations.map(violation => `- ${violation}`).join('\n'));
    process.exitCode = 1;
  } else {
    console.log('Skill evaluation policy: valid');
  }
}
