import nodeFetch from 'node-fetch';

export function fetch(...params) {
  return new Promise((resolve, reject) => {
    nodeFetch(...params)
      .then(res => {
        if (res.ok) {
          resolve(res);
        } else {
          res.text().then(text => {
            reject(text);
          });
        }
      })
      .catch(err => {
        reject('catch fail:' + err);
      });
  });
}
