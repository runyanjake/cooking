import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import matter from 'gray-matter';
import { parseRecipeContent, type CardTab } from './recipe-content';

const parse = (source: string) => parseRecipeContent(source, 'test.md');
const tabNames = (source: string) => parse(source).tabs.map((tab) => tab.name);
const card = (source: string) => parse(source).tabs.find((tab) => tab.type === 'card') as CardTab;

test('tabs follow file order, with no name or position treated specially', () => {
  const source = ':::references\n- a\n:::\n\n:::wine\n- b\n:::\n\n:::ingredients\n- c\n:::\n';
  assert.deepEqual(tabNames(source), ['references', 'wine', 'ingredients']);
});

test('titles come from the label, otherwise from the name', () => {
  const { tabs } = parse(':::wine-pairing\nx\n:::\n\n:::notes[Chef Tips]\ny\n:::\n');
  assert.deepEqual(tabs.map((tab) => tab.title), ['Wine Pairing', 'Chef Tips']);
});

test('a label is not rendered as tab content', () => {
  const [tab] = parse(':::notes[Chef Tips]\nbody\n:::\n').tabs;
  assert.equal(tab.type === 'markdown' && tab.content.children.length, 1);
});

test('a tab with no content is still a tab', () => {
  assert.deepEqual(tabNames(':::notes\n:::\n'), ['notes']);
});

test('prose before and after the tabs is intro and outro; prose between them is an error', () => {
  const { intro, outro } = parse('before\n\n:::notes\nx\n:::\n\nafter\n');
  assert.equal(intro.children.length, 1);
  assert.equal(outro.children.length, 1);
  assert.throws(() => parse(':::a\nx\n:::\n\nbetween\n\n:::b\ny\n:::\n'), /test\.md:5: Content between tabs/);
});

test('recipes without a card have no card tab', () => {
  assert.equal(card(':::ingredients\n- a\n:::\n'), undefined);
});

test('the card sits where it is written and has its own title', () => {
  const source = ':::notes\nx\n:::\n\n:::card[Print Me]\n::notes\n:::\n\n:::references\ny\n:::\n';
  assert.deepEqual(tabNames(source), ['notes', 'card', 'references']);
  assert.equal(card(source).title, 'Print Me');
});

test('the card shows only what it lists, in the order listed', () => {
  const source = ':::a\nx\n:::\n\n:::b\ny\n:::\n\n:::c\nz\n:::\n\n:::card\n::c\n::a\n:::\n';
  assert.deepEqual(card(source).sections.map((s) => s.name), ['c', 'a']);
});

test('the card can list a tab written after it', () => {
  assert.deepEqual(card(':::card\n::notes\n:::\n\n:::notes\nx\n:::\n').sections.map((s) => s.name), ['notes']);
});

test('the card mixes references with blocks written just for it', () => {
  const source = ':::ingredients\n- a\n- b\n:::\n\n::::card\n::ingredients\n:::instructions[Short Steps]\n1. x\n:::\n::::\n';
  assert.deepEqual(card(source).sections.map((s) => s.title), ['Ingredients', 'Short Steps']);
});

test('invalid cards fail with the file and line', () => {
  assert.throws(() => parse(':::card\n::missing\n:::\n'), /test\.md:2: .*no :::missing tab/);
  assert.throws(() => parse(':::card\n:::\n'), /test\.md:1: .*one or two sections/);
  assert.throws(() => parse(':::a\nx\n:::\n\n:::card\n::a\n::a\n:::\n'), /test\.md:7: .*more than once/);
  assert.throws(() => parse(':::a\nx\n:::\n:::b\ny\n:::\n:::c\nz\n:::\n:::card\n::a\n::b\n::c\n:::\n'), /one or two sections/);
  assert.throws(() => parse(':::card\nsome prose\n:::\n'), /test\.md:2: .*may only contain/);
});

test('duplicate tabs and top-level leaf directives are errors', () => {
  assert.throws(() => parse(':::notes\nx\n:::\n\n:::notes\ny\n:::\n'), /test\.md:5: Duplicate :::notes/);
  assert.throws(() => parse('::card\n'), /test\.md:1: Tabs need the container form/);
});

test('`:word` in prose stays literal, and image paragraphs become figures', () => {
  const [tab] = parse(':::notes\nTip:Use salt\n\n![Alt](./a.jpg "Cap")\n:::\n').tabs;
  assert(tab.type === 'markdown');
  const [prose, figure] = tab.content.children;
  assert.equal(prose.type === 'paragraph' && prose.children.map((c) => ('value' in c ? c.value : '')).join(''), 'Tip:Use salt');
  assert.equal(figure.data?.hName, 'figure');
});

test('every recipe in the repo parses and declares its card', () => {
  const recipesDir = path.join(process.cwd(), 'recipes');
  const files = fs.readdirSync(recipesDir, { recursive: true, encoding: 'utf8' })
    .filter((file) => file.endsWith('.md') && path.basename(file).toLowerCase() !== 'readme.md');
  assert(files.length > 0);
  for (const file of files) {
    const { content } = matter(fs.readFileSync(path.join(recipesDir, file), 'utf8'));
    const parsed = parseRecipeContent(content, file);
    assert(parsed.tabs.some((tab) => tab.type === 'card'), `${file} has no :::card`);
  }
});
