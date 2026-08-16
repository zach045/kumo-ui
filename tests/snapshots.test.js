import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const readSource = (relativePath) => readFile(new URL(relativePath, import.meta.url), 'utf8');

test('persistent account greeting uses the application typography', async () => {
  const layout = await readSource('../src/components/layout/BaseLayout.vue');
  assert.equal(layout.includes('orbitron-regular'), false);
  assert.match(layout, /Hi, \{\{ user\.name \}\}/);
  assert.match(layout, /font-semibold tracking-tight/);
});

test('snapshot library fetches data and exposes search and pagination', async () => {
  const list = await readSource('../src/components/seo/SnapshotList.vue');
  assert.match(list, /dispatch\('fetchAllSnapshots'\)/);
  assert.match(list, /v-model="query"/);
  assert.match(list, /paginatedSites/);
  assert.match(list, /name: 'snapshot-item'/);
});

test('snapshot details fetch by route id and delete through the store', async () => {
  const item = await readSource('../src/components/seo/SnapshotItem.vue');
  assert.match(item, /dispatch\('fetchSnapshotById'/);
  assert.match(item, /dispatch\('deleteSnapshot'/);
  assert.match(item, /router\.push\(\{ name: 'seo-snapshot' \}\)/);
  assert.equal(item.includes('console.log'), false);
});


test('authenticated experience persists and applies the selected theme', async () => {
  const [layout, mobileNav, theme, dashboard, list, item] = await Promise.all([
    readSource('../src/components/layout/BaseLayout.vue'),
    readSource('../src/components/layout/MobileNav.vue'),
    readSource('../src/composables/useTheme.js'),
    readSource('../src/pages/Dashboard.vue'),
    readSource('../src/components/seo/SnapshotList.vue'),
    readSource('../src/components/seo/SnapshotItem.vue'),
  ]);

  assert.match(layout, /:class="\{ dark: isDark \}"/);
  assert.match(layout, /@click="toggleTheme"/);
  assert.match(mobileNav, /@click="toggleTheme"/);
  assert.match(theme, /localStorage\.setItem\(STORAGE_KEY/);

  for (const source of [layout, mobileNav, dashboard, list, item]) {
    assert.equal(source.includes('dark:'), true);
  }
});
