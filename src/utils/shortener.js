import request from 'superagent';

const SHORTENER_URL = 'http://djnd.si/yomamasofat/';

function shortenUrl(longUrl, callback) {
  return request
    .get(SHORTENER_URL)
    .query({ fatmama: longUrl })
    .end((err, res) => {
      if (err) {
        console.error('Shortener Error!', err);
      } else {
        callback(res.text);
      }
    });
}

export {
  shortenUrl,
};
