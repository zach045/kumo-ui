import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { isValidEmail } from '../src/utils/validation.js';

const readSource = async (relativePath) => (
  readFile(new URL(relativePath, import.meta.url), 'utf8')
);

test('email validation rejects suffix-less addresses', () => {
  assert.equal(isValidEmail('user@localhost'), false);
  assert.equal(isValidEmail('user@example.com'), true);
});

test('authentication and snapshot stores do not read browser tokens', async () => {
  const sources = await Promise.all([
    readSource('../src/store/modules/auth/actions.js'),
    readSource('../src/store/modules/auth/mutations.js'),
    readSource('../src/store/modules/seo/actions.js'),
  ]);

  for (const source of sources) {
    assert.equal(source.includes('localStorage'), false);
    assert.equal(source.includes('sessionStorage'), false);
  }
});

test('authentication no longer waits for dashboard insights', async () => {
  const source = await readSource('../src/store/modules/auth/actions.js');
  assert.equal(source.includes("dispatch('fetchInsights')"), false);
});

test('shared API client sends secure session cookies', async () => {
  const source = await readSource('../src/services/api.js');
  assert.equal(source.includes('withCredentials: true'), true);
});

test('Google login does not depend on a browser-readable token', async () => {
  const source = await readSource('../src/components/GoogleSignIn.vue');
  assert.equal(source.includes("localStorage.getItem('token')"), false);
});
