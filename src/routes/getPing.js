import { selectCurrentTimestamp } from '../sql';

export default function* getPing(next) {
  const { db } = this.app.context;
  this.state.cacheControl({
    'no-store': true,
  });
  this.body = {
    ping: (yield db.one(selectCurrentTimestamp)).now.toISOString(),
  };
  yield next;
}
