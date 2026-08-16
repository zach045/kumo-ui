import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const readSource = (relativePath) => readFile(new URL(relativePath, import.meta.url), 'utf8');

test('keywords route uses the implemented workspace', async () => {
  const router = await readSource('../src/router/index.js');

  assert.match(router, /import Keywords from '..\/pages\/Keywords\.vue'/);
  assert.match(router, /path: '\/keywords'[\s\S]*component: Keywords/);
  assert.doesNotMatch(router, /protectedModule\('\/keywords'/);
});

test('keywords are derived from snapshot recommendations and preserve evidence', async () => {
  const source = await readSource('../src/pages/Keywords.vue');

  assert.match(source, /dispatch\('fetchAllSnapshots'\)/);
  assert.match(source, /suggestions\?\.long_tail_keywords/);
  assert.match(source, /existing\.sources\.set/);
  assert.match(source, /name: 'snapshot-item'/);
});

test('keywords workspace does not present unsupported SEO metrics', async () => {
  const source = await readSource('../src/pages/Keywords.vue');

  assert.match(source, /verified data provider/);
  assert.doesNotMatch(source, /mock|fake|estimated volume/i);
  assert.doesNotMatch(source, /Math\.random/);
});

test('keywords workspace supports filtering and dark mode', async () => {
  const source = await readSource('../src/pages/Keywords.vue');

  assert.match(source, /v-model="query"/);
  assert.match(source, /v-model="selectedSnapshot"/);
  assert.match(source, /dark:bg-slate-900/);
});
