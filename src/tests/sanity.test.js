import assert from 'assert';
const { describe, it } = global;
import semver from 'semver';

describe('Sanity checks', () => {
  it('Node version >= 6.3.0', () =>
    assert(semver.satisfies(process.versions.node, '>=6.3.0'))
  );
});
