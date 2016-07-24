import koa from 'koa';
import bodyParser from 'koa-bodyparser';
import pgp from 'pg-promise';

import assignId from './middlewares/assignId';
import assignXHeaders from './middlewares/assignXHeaders';
import assignResolve from './middlewares/assignResolve';
import assignCacheControl from './middlewares/assignCacheControl';
import handleErrors from './middlewares/handleErrors';
import log from './middlewares/log';

import createRouter from './routes';
import fetch from './fetch';

class Server {
  constructor(config) {
    const router = createRouter();
    const db = pgp(config.pgp)(config.pg);
    const app = koa();
    const { purge } = fetch(config);

    app.proxy = config.security.proxy;
    app.context.config = config;
    app.context.purge = purge;
    app.context.db = db;
    app.context.tx = (fn) => db.tx(fn);
    app.context.task = (fn) => db.task(fn);
    app.context.router = router;
    app
      .use(bodyParser())
      .use(assignId())
      .use(assignXHeaders())
      .use(assignResolve())
      .use(log())
      .use(handleErrors())
      .use(assignCacheControl())
      .use(router.routes())
      .use(router.allowedMethods());

    this.app = app;
  }

  start() {
    const { app } = this;
    const { http: { port, hostname }, cluster: { workerId } } = app.context.config;
    console.log(`Server starting (workerId=${workerId}, hostname=${hostname}, port=${port})`);
    app.context.purge('/version');

    this.server = this.app.listen(port, hostname);
    return this;
  }

  stop() {
    this.server.close();
  }
}

export default Server;
