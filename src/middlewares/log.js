import util from 'util';

export default function log() {
  return function* _log(next) {
    const { verbosity: { logRequests } } = this.app.context.config;
    if(logRequests) {
      console.log('<<', util.inspect({
        t: new Date().toISOString(),
        id: this.state.id,
        ip: this.request.ip,
        method: this.request.method,
        pathname: this.request.path,
        query: this.request.query,
        body: this.request.body,
      }, { depth: 10, colors: true }));
    }
    yield next;
    if(logRequests) {
      console.log('>>', this.state.id, util.inspect({
        t: new Date().toISOString(),
        id: this.state.id,
        status: this.response.status,
        body: this.response.body,
      }, { depth: 10, colors: true }));
    }
  };
}
