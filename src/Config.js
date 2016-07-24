import _ from 'lodash';
import cluster from 'cluster';
import fs from 'fs';
import os from 'os';
import parseArgs from 'minimist';

// by default leave 2 CPUs free (assuming HAProxy & Varnish)
const CPUS_LEFT_FREE = 2;

const defaultConfig = {
  http: {
    port: 8888,
    hostname: 'localhost',
  },
  cluster: {
    workerId: cluster.worker ? cluster.worker.id : process.pid,
    numWorkers: Math.max(1, os.cpus().length - CPUS_LEFT_FREE), // leave some CPUs free for other processes
  },
  verbosity: {
    logRequests: false,
    logErrors: true,
  },
  security: {
    proxy: false,
    hideWorkerId: false,
    hideErrors: true,
    hideStackTrace: true,
    hideRequestId: false,
  },
  baseUrlObj: {},
  cache: {
    // ignore all purge calls
    purge: false,
  },
  pgp: {
    promiseLib: Promise,
    pgNative: true,
    noLocking: true,
    query: () => void 0,
    receive: () => void 0,
  },
  pg: {
    host: 'localhost',
    port: 5432,
    database: '',
    user: '',
    password: '',
    'application_name': '',
    poolIdleTimeout: 30000,
    poolSize: 12,
  },
};

const IGNORE_ARGS = 2;

class Config {
  static guess(config) {
    const envConfig = process.env.CONFIG ? JSON.parse(process.env.CONFIG) : {};

    const args = parseArgs(process.argv.slice(IGNORE_ARGS));
    const argsConfig = args.config ? JSON.parse(args.config) : {};

    let fileConfig = {};
    if(args.configFile) {
      try {
        fileConfig = JSON.parse(fs.readFileSync(args.configFile)); // eslint-disable-line no-sync
      }
      catch(err) { void err; }
    }

    let localConfig = {};
    try {
      localConfig = require('./localConfig'); // eslint-disable-line global-require
    }
    catch(err) { void err; }
    return new this(config, fileConfig, argsConfig, envConfig, localConfig);
  }

  constructor(...configs) {
    _.defaultsDeep(this, ...configs, defaultConfig);
  }
}

export default Config;
