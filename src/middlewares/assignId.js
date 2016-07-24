import assert from 'assert';
import shortid from 'shortid';

const MAX_WORKER_ID = 16;
let initializedWorkedId = null;

export default function assignId() {
  return function* _assignId(next) {
    const { cluster: { workerId } } = this.app.context.config;
    if(initializedWorkedId) {
      assert(initializedWorkedId === workerId, 'shortid.worker should only be called once');
    }
    else {
      shortid.worker(workerId % MAX_WORKER_ID);
      initializedWorkedId = workerId;
    }
    this.state.id = shortid.generate();
    yield next;
  };
}
