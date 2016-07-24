import _ from 'lodash';

function setCacheControl(ctx, cacheControl = {}) {
  if(_.size(cacheControl) === 0) {
    return;
  }
  ctx.set('Cache-Control', _(cacheControl)
    .map((value, key) => {
      if(typeof value === 'boolean') {
        if(value) {
          return key;
        }
        return '';
      }
      return `${key}=${value}`;
    })
  .join(', '));
}

export default function assignCacheControl() {
  return function* _assignCacheControl(next) {
    this.state.cacheControl = (cacheControl) => setCacheControl(this, cacheControl);
    yield next;
  };
}
