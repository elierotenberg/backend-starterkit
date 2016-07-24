import pkg from '../../package.json';

export default function* getVersion(next) {
  this.state.cacheControl({
    // One year (will be purged upon server startup)
    's-max-age': 3600 * 24 * 365, // eslint-disable-line no-magic-numbers
  });
  this.body = {
    version: pkg.version,
  };
  yield next;
}
