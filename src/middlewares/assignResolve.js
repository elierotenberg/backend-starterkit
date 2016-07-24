import _ from 'lodash';
import url from 'url';

export default function assignResolve() {
  return function* _assignResolve(next) {
    const { config, router } = this.app.context;
    const { baseUrlObj } = config;
    const requestUrlObj = Object.assign({}, baseUrlObj, _.pick(this.request, [
      'protocol',
      'host',
    ]));
    const requestUrl = url.format(requestUrlObj);
    this.state.resolve = (route, params, query = {}) => {
      const urlObj = url.parse(url.resolve(requestUrl, router.url(route, params)), true);
      urlObj.query = urlObj.query || {};
      Object.assign(urlObj, { query });
      return url.format(urlObj);
    };
    yield next;
  };
}
