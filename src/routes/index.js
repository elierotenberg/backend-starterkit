import createRouter from 'koa-router';

import getPing from './getPing';
import getVersion from './getVersion';
import postProfiling from './postProfiling';

export default () =>
  createRouter()
    .get('getPing', '/ping', getPing)
    .get('getVersion', '/version', getVersion)
    .post('postProfiling', '/profiling', postProfiling);
