import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import test from 'node:test';

const catalogPath = join(dirname(fileURLToPath(import.meta.url)), '..');
const repository = 'rafa-ochoa/r8-skills';

const skillNames = (await readdir(join(catalogPath, 'skills'), { withFileTypes: true }))
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name);

const readmePaths = [
  join(catalogPath, 'README.md'),
  ...skillNames.map(skillName => join(catalogPath, 'skills', skillName, 'README.md'))
];

const markdownPaths = (await readdir(catalogPath, { recursive: true, withFileTypes: true }))
  .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
  .map(entry => join(entry.parentPath, entry.name))
  .filter(filePath => !relative(catalogPath, filePath).split(/[\\/]/).some(part => part === '.git' || part === 'node_modules'));

async function readCommands(prefix) {
  const commands = [];

  for (const readmePath of readmePaths) {
    const readme = await readFile(readmePath, 'utf8');
    for (const [command] of readme.matchAll(new RegExp(`${prefix}[^\\n\`]*`, 'g'))) {
      commands.push({ file: relative(catalogPath, readmePath), command: command.trim() });
    }
  }

  return commands;
}

test('every published install command targets this repository and an existing skill', async () => {
  const commands = await readCommands('npx skills add ');

  assert.ok(commands.some(({ file }) => file === 'README.md'), 'README.md must publish a collection install command');

  for (const { file, command } of commands) {
    assert.ok(command.split(/\s+/).includes(repository), `${file}: "${command}" must reference ${repository}`);

    for (const [, skillName] of command.matchAll(/--skill\s+(\S+)/g)) {
      assert.ok(skillNames.includes(skillName), `${file}: "${command}" names missing skill ${skillName}`);
    }
  }
});

test('every published single-skill update command names an existing skill', async () => {
  const commands = await readCommands('npx skills update ');

  for (const { file, command } of commands) {
    const [skillName] = command.replace('npx skills update ', '').split(/\s+/);
    if (skillName.startsWith('-')) continue;

    assert.ok(skillNames.includes(skillName), `${file}: "${command}" names missing skill ${skillName}`);
  }
});

test('active documentation does not reference the former r8a-skills name', async () => {
  for (const markdownPath of markdownPaths) {
    const lines = (await readFile(markdownPath, 'utf8')).split('\n');

    lines.forEach((line, index) => {
      const isLabelledHistorical = /historical/i.test(line);
      assert.ok(
        !line.includes('r8a-skills') || isLabelledHistorical,
        `${relative(catalogPath, markdownPath)}:${index + 1} references r8a-skills without a historical label`
      );
    });
  }
});
