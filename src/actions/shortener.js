import request from 'superagent';

function shortenUrl(longUrl, callback) {
  return request
    .get('http://djnd.si/yomamasofat/')
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
