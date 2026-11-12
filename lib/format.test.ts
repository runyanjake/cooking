import assert from 'node:assert/strict';
import { test } from 'node:test';
import { capitalize } from './format';

test('capitalize uppercases the first letter only', () => {
  assert.equal(capitalize('italian'), 'Italian');
  assert.equal(capitalize('ice cream'), 'Ice cream');
  assert.equal(capitalize('BBQ'), 'BBQ');
  assert.equal(capitalize(''), '');
});
