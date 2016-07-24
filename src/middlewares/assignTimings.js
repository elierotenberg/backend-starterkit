import _ from 'lodash';

export default function assignTimings() {
  return function* _assignTimings(next) {
    const { logTimings } = this.app.context.config.verbosity;
    const timings = [];
    this.state.tick = (eventName = '') => {
      if(logTimings) {
        timings.push([eventName, Date.now()]);
      }
    };
    this.state.tick('begin');
    yield next;
    this.state.tick('end');
    if(logTimings) {
      const initialT = timings[0][1];
      let previousT = initialT;
      _.each(timings, ([eventName, t]) => {
        const delta = t - previousT;
        const total = t - initialT;
        console.log(this.state.id, eventName, delta, total);
        previousT = t;
      });
    }
  };
}
