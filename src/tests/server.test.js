const { before, after, describe, it } = global;
import t from 'tcomb';
const DEBUG = process.env.DEBUG;

import fetch from '../fetch';
import Config from '../Config';
import Server from '../Server';

describe('routes', () => {
  const config = Config.guess({
    http: {
      port: 8889,
    },
    cluster: {
      workerId: 0,
    },
    security: {
      hideErrors: !DEBUG,
      hideStackTrace: !DEBUG,
    },
    verbosity: {
      logRequests: DEBUG,
      logErrors: DEBUG,
    },
    pg: {
      poolIdleTimeout: 1000,
    },
    pgp: {
      query: DEBUG ? ({ query }) => console.warn(query) : () => void 0,
      receive: DEBUG ? (query) => console.warn(query) : () => void 0,
    },
    baseUrlObj: {
      protocol: 'http',
      hostname: 'localhost',
      port: 8889,
    },
    cache: {
      purge: false,
    },
  });
  const { getJSON } = fetch(config);

  const server = new Server(config);
  const { db } = server.app.context;

  before(() => server.start());

  it('Connects to SQL database', async () => {
    await db.one('SELECT 1;');
  });

  it('GET /version', async () =>
    t.struct({
      version: t.String,
    }, { strict: true })(await getJSON('/version'))
  );

  it('GET /ping', async () =>
    t.struct({
      ping: t.String,
    }, { strict: true })(await getJSON('/ping'))
  );

  after(() => server.stop());
});
