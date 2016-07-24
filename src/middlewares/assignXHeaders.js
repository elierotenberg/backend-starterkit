export default function assignXHeaders() {
  return function* _assignXHeaders(next) {
    const { cluster: { workerId }, security: { hideWorkerId, hideRequestId } } = this.app.context.config;
    if(!hideWorkerId) {
      this.set('X-WorkerId', workerId);
    }
    if(!hideRequestId) {
      this.set('X-RequestId', this.state.id);
    }
    yield next;
  };
}
