import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';

const minimumPositiveTriggers = 3;
const minimumNegativeTriggers = 2;
const minimumBehaviorEvaluations = 3;

export async function validateSkillEvaluations(catalogPath) {
  const skillsPath = join(catalogPath, 'skills');
  const skillEntries = await readdir(skillsPath, { withFileTypes: true });
  const skillDirectories = skillEntries.filter(entry => entry.isDirectory());
  const catalogSkillNames = new Set(skillDirectories.map(entry => entry.name));
  const violations = [];

  for (const skillDirectory of skillDirectories) {
    const skillPath = join(skillsPath, skillDirectory.name);
    const skillFilePath = join(skillPath, 'SKILL.md');
    const evaluationFilePath = join(skillPath, 'evals', 'evals.json');
    const skillName = await readSkillName(skillFilePath, catalogPath, violations);
    const evaluation = await readEvaluation(evaluationFilePath, catalogPath, violations);

    if (skillName === null || evaluation === null) continue;

    validateSkillDirectoryName(skillDirectory.name, skillName, skillPath, catalogPath, violations);
    await validateSkillReadme(skillPath, catalogPath, violations);
    validateEvaluationName(evaluation, skillName, evaluationFilePath, catalogPath, violations);
    validateTriggerPrompts(evaluation, evaluationFilePath, catalogPath, violations);
    validateBehaviorEvaluations(evaluation, evaluationFilePath, catalogPath, violations);
    validateEvaluationIds(evaluation, evaluationFilePath, catalogPath, violations);
    validateOverlapReview(evaluation, evaluationFilePath, catalogPath, catalogSkillNames, violations);
  }

  await validateMarkdownLinks(catalogPath, violations);

  return violations;
}

function validateSkillDirectoryName(directoryName, skillName, skillPath, catalogPath, violations) {
  if (directoryName !== skillName) {
    violations.push(`${toCatalogPath(skillPath, catalogPath)} directory name must match ${skillName}`);
  }
}

async function validateSkillReadme(skillPath, catalogPath, violations) {
  const readmePath = join(skillPath, 'README.md');
  try {
    await readFile(readmePath, 'utf8');
  } catch {
    violations.push(`${toCatalogPath(readmePath, catalogPath)} is required`);
  }
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

function validateEvaluationIds(evaluation, evaluationFilePath, catalogPath, violations) {
  if (!Array.isArray(evaluation.evals)) return;

  const ids = evaluation.evals.map(behaviorEvaluation => behaviorEvaluation?.id);
  const hasPositiveIds = ids.every(id => Number.isInteger(id) && id > 0);

  if (!hasPositiveIds || new Set(ids).size !== ids.length) {
    violations.push(`${toCatalogPath(evaluationFilePath, catalogPath)} evals ids must be unique positive integers`);
  }
}

function validateOverlapReview(evaluation, evaluationFilePath, catalogPath, catalogSkillNames, violations) {
  const evaluationPath = toCatalogPath(evaluationFilePath, catalogPath);
  const overlapReview = evaluation.overlap_review;
  const hasComparedSkills = Array.isArray(overlapReview?.compared_with)
    && overlapReview.compared_with.length > 0
    && overlapReview.compared_with.every(skillName => typeof skillName === 'string' && skillName.length > 0);
  const hasDecision = typeof overlapReview?.decision === 'string' && overlapReview.decision.trim().length > 0;

  if (!hasComparedSkills || !hasDecision) {
    violations.push(`${evaluationPath} must include overlap_review.compared_with and overlap_review.decision`);
    return;
  }

  for (const comparedSkill of overlapReview.compared_with) {
    if (!catalogSkillNames.has(comparedSkill)) {
      violations.push(`${evaluationPath} overlap_review.compared_with names unknown skill ${comparedSkill}`);
    }
  }
}

async function validateMarkdownLinks(catalogPath, violations) {
  const entries = await readdir(catalogPath, { recursive: true, withFileTypes: true });
  const markdownPaths = entries
    .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
    .map(entry => join(entry.parentPath, entry.name))
    .filter(filePath => !toCatalogPath(filePath, catalogPath).split('/').some(part => part === '.git' || part === 'node_modules'))
    .sort();

  for (const markdownPath of markdownPaths) {
    const markdown = await readFile(markdownPath, 'utf8');
    const prose = markdown.replace(/^```[\s\S]*?^```/gm, '').replace(/`[^`\n]*`/g, '');
    const markdownCatalogPath = toCatalogPath(markdownPath, catalogPath);

    for (const [, target] of prose.matchAll(/!?\[[^\]]*\]\(<?([^)\s>]+)>?(?:\s+"[^"]*")?\)/g)) {
      if (target.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue;

      const localTarget = decodeURIComponent(target.split(/[#?]/)[0]);
      const resolvedTarget = resolve(dirname(markdownPath), localTarget);
      const catalogRelativeTarget = relative(catalogPath, resolvedTarget);

      if (catalogRelativeTarget === '..' || catalogRelativeTarget.startsWith(`..${sep}`) || isAbsolute(catalogRelativeTarget)) {
        violations.push(`${markdownCatalogPath} links outside the repository: ${target}`);
      } else if (!(await pathExists(resolvedTarget))) {
        violations.push(`${markdownCatalogPath} links to missing file ${localTarget}`);
      }
    }
  }
}

async function pathExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return false;
    throw error;
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
