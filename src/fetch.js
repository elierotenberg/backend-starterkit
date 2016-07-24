import fetch from 'node-fetch';
import url from 'url';

function headersToObject(headers) {
  if(typeof headers.raw === 'function') {
    return headers.raw();
  }
  if(typeof headers.forEach === 'function') {
    const o = {};
    headers.forEach((v, k) => {
      o[k] = v;
    });
    return o;
  }
  throw new Error('Could not find a suitable interface for converting headers to object');
}

export default (config) => {
  const { baseUrlObj } = config;
  const baseUrl = url.format(baseUrlObj);

  function resolve(path, query) {
    const urlObj = url.parse(url.resolve(baseUrl, path));
    urlObj.query = urlObj.query || {};
    Object.assign(urlObj.query, query);
    return url.format(urlObj);
  }

  function get(path, query, headers = {}) {
    return fetch(resolve(path, query), {
      method: 'GET',
      headers,
    });
  }

  function post(path, query, params, headers = {}) {
    return fetch(resolve(path, query), {
      method: 'POST',
      headers: Object.assign({}, headers, {
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(params),
    });
  }

  function put(path, query, params, headers = {}) {
    return fetch(resolve(path, query), {
      method: 'PUT',
      headers: Object.assign({}, headers, {
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(params),
    });
  }

  function del(path, query, params, headers = {}) {
    return fetch(resolve(path, query), {
      method: 'DELETE',
      headers: Object.assign({}, headers, {
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(params),
    });
  }

  function purge(path, query, params, headers = {}) {
    if(!config.cache.purge) {
      return {
        headers: {},
        json() {
          return Promise.resolve();
        },
      };
    }
    return fetch(resolve(path, query), {
      method: 'PURGE',
      headers: Object.assign({}, headers, {
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(params),
    });
  }

  async function getJSON(path, query, headers = {}) {
    return await (await get(path, query, headers)).json();
  }

  async function getHeaders(path, query, headers = {}) {
    return headersToObject((await get(path, query, headers)).headers);
  }

  async function postJSON(path, query, params, headers = {}) {
    return await (await post(path, query, params, headers)).json();
  }

  async function postHeaders(path, query, params, headers = {}) {
    return headersToObject((await post(path, query, params, headers)).headers);
  }

  async function putJSON(path, query, params, headers = {}) {
    return await (await put(path, query, params, headers)).json();
  }

  async function putHeaders(path, query, params, headers = {}) {
    return headersToObject((await put(path, query, params, headers)).headers);
  }

  async function delJSON(path, query, params, headers = {}) {
    return await (await del(path, query, params, headers)).json();
  }

  async function delHeaders(path, query, params, headers = {}) {
    return headersToObject((await del(path, query, params, headers)).headers);
  }

  async function purgeJSON(path, query, params, headers = {}) {
    return await (await purge(path, query, params, headers)).json();
  }

  async function purgeHeaders(path, query, params, headers = {}) {
    return headersToObject((await purge(path, query, params, headers)).headers);
  }

  return {
    resolve,
    get,
    post,
    put,
    del,
    getJSON,
    getHeaders,
    postJSON,
    postHeaders,
    putJSON,
    putHeaders,
    delJSON,
    delHeaders,
    purge,
    purgeJSON,
    purgeHeaders,
  };
};
