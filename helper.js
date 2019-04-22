import nodeFetch from 'node-fetch';

export async function fetch(...params) {
  return new Promise((resolve, reject) => {
    nodeFetch(...params).then(res => {
      if (res.ok) {
        resolve(res);
      } else {
        reject(res);
      }
    });
  });
}
