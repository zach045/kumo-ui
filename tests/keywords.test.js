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

test('snapshot opportunities preserve their source evidence', async () => {
  const source = await readSource('../src/pages/Keywords.vue');

  assert.match(source, /dispatch\('fetchAllSnapshots'\)/);
  assert.match(source, /suggestions\?\.long_tail_keywords/);
  assert.match(source, /existing\.sources\.set/);
  assert.match(source, /name: 'snapshot-item'/);
});

test('tracked keyword state uses the keyword API', async () => {
  const [page, actions, store] = await Promise.all([
    readSource('../src/pages/Keywords.vue'),
    readSource('../src/store/modules/keywords/actions.js'),
    readSource('../src/store/index.js'),
  ]);

  assert.match(store, /keywordsModule/);
  assert.match(page, /dispatch\('fetchKeywords'\)/);
  assert.match(page, /dispatch\('createKeyword'/);
  assert.match(page, /dispatch\('updateKeyword'/);
  assert.match(page, /dispatch\('deleteKeyword'/);
  assert.match(actions, /api\.get\('\/keywords'/);
  assert.match(actions, /api\.post\('\/keywords'/);
  assert.match(actions, /api\.patch\(`\/keywords\/\$\{id\}`/);
  assert.match(actions, /api\.delete\(`\/keywords\/\$\{id\}`/);
});

test('keywords workspace separates opportunities from tracked records', async () => {
  const source = await readSource('../src/pages/Keywords.vue');

  assert.match(source, /activeTab === 'opportunities'/);
  assert.match(source, /activeTab === 'tracked'/);
  assert.match(source, /Track keyword/);
  assert.match(source, /Add keyword/);
  assert.match(source, /Keyword status/);
  assert.match(source, /Keyword priority/);
  assert.match(source, />\s*Remove\s*</);
  assert.match(source, /removeTrackedKeyword\(keyword\)/);
});

test('keywords workspace does not present unsupported SEO metrics', async () => {
  const source = await readSource('../src/pages/Keywords.vue');

  assert.match(source, /verified data provider/);
  assert.doesNotMatch(source, /Math\.random/);
});

test('keywords workspace supports filtering, API errors, and dark mode', async () => {
  const source = await readSource('../src/pages/Keywords.vue');

  assert.match(source, /v-model="query"/);
  assert.match(source, /v-model="selectedSnapshot"/);
  assert.match(source, /role="alert"/);
  assert.match(source, /dark:bg-slate-900/);
});


test('keyword tag analysis is fetched and displayed without claiming SERP rank', async () => {
  const [page, actions, mutations] = await Promise.all([
    readSource('../src/pages/Keywords.vue'),
    readSource('../src/store/modules/keywords/actions.js'),
    readSource('../src/store/modules/keywords/mutations.js'),
  ]);

  assert.match(actions, /api\.get\(\`\/keywords\/\$\{id\}\/analysis\`\)/);
  assert.match(actions, /api\.post\(\`\/keywords\/\$\{id\}\/analyze\`\)/);
  assert.match(mutations, /SET_KEYWORD_ANALYSIS/);
  assert.match(page, /View tag analysis/);
  assert.match(page, /Placement/);
  assert.match(page, /Content quality/);
  assert.match(page, /Captured occurrences/);
  assert.match(page, /not a Google ranking position/);
});

test('older snapshots communicate the required rescan state', async () => {
  const source = await readSource('../src/pages/Keywords.vue');

  assert.match(source, /coverageStatus === 'requires_rescan'/);
  assert.match(source, /needs to be rescanned/);
  assert.match(source, /Run a new snapshot/);
});
