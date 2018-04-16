import request from 'superagent';

const SHORTENER_URL = 'https://djnd.si/yomamasofat/';

function shortenUrl(longUrl, callback) {
  return request
    .post(SHORTENER_URL)
    .field('fatmama', longUrl)
    .then((res) => {
      callback(res.text);
    })
    .catch((error) => {
      console.error('Shortener Error!', error);
    });
}

export {
  shortenUrl,
};
