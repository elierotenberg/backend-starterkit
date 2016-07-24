import './prelude';
import _ from 'lodash';
import cluster from 'cluster';

import Config from './Config';
import Server from './Server';

const config = Config.guess();

if(cluster.isMaster) {
  const { cluster: { numWorkers } } = config;
  _.range(numWorkers).forEach(() => cluster.fork());
  cluster.on('exit', (worker, code, signal) => {
    console.warn(`Worker died (pid=${worker.process.pid}, code=${code}, signal=${signal}), restarting`);
  });
}
else {
  const server = new Server(config);
  server.start();
}
