import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const readSource = (relativePath) => readFile(new URL(relativePath, import.meta.url), 'utf8');

test('dashboard loads insights when opened', async () => {
  const source = await readSource('../src/pages/Dashboard.vue');
  assert.match(source, /onMounted\(async \(\) =>/);
  assert.match(source, /dispatch\('fetchInsights'\)/);
});

test('dashboard exposes the planned product modules', async () => {
  const [router, sideNav, mobileNav] = await Promise.all([
    readSource('../src/router/index.js'),
    readSource('../src/components/layout/SideNav.vue'),
    readSource('../src/components/layout/MobileNav.vue'),
  ]);

  for (const moduleName of ['keywords', 'reports', 'history', 'settings']) {
    assert.equal(router.includes(`'${moduleName}'`), true);
    assert.equal(sideNav.includes(`name: '${moduleName}'`), true);
    assert.equal(mobileNav.includes(`name: '${moduleName}'`), true);
  }
});

test('latest snapshot links to its complete analysis', async () => {
  const source = await readSource('../src/pages/Dashboard.vue');
  assert.match(source, /name: 'snapshot-item'/);
  assert.match(source, /params: \{ id: lastSnapshot\.id \}/);
});
