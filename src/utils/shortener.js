import request from 'superagent';

const SHORTENER_URL = 'https://djnd.si/yomamasofat/';
const SHORT_CACHE = {};

function shortenUrl(longUrl, callback) {
  if (SHORT_CACHE[longUrl]) {
    callback(SHORT_CACHE[longUrl]);
    return null;
  }
  return request
    .post(SHORTENER_URL)
    .field('fatmama', longUrl)
    .then((res) => {
      SHORT_CACHE[longUrl] = res.text;
      callback(res.text);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Shortener Error!', error);
    });
}

function fetchShortUrl(url) {
  return request
    .post(SHORTENER_URL)
    .field('fatmama', url)
    .then((res) => {
      SHORT_CACHE[url] = res.text;
      return res.text;
    });
}

async function shortenUrls(urls, text) {
  let replacedText = text;
  const promises = urls.map(url => SHORT_CACHE[url] || fetchShortUrl(url));
  await Promise.all(promises)
    .then((shortUrls) => {
      shortUrls.forEach((shortUrl, i) => {
        replacedText = replacedText.replace(urls[i], shortUrl);
      });
    })
    .catch((error) => {
      replacedText = text;
      // eslint-disable-next-line no-console
      console.error('shortenUrls', error);
    });
  return replacedText;
}

export {
  shortenUrl,
  shortenUrls,
  fetchShortUrl,
};
