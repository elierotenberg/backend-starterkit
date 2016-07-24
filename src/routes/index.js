import createRouter from 'koa-router';

import getPing from './getPing';
import getVersion from './getVersion';

export default () =>
  createRouter()
    .get('getPing', '/ping', getPing)
    .get('getVersion', '/version', getVersion);
