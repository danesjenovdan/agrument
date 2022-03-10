import querystring from 'querystring';

function parseSearch(search) {
  const searchString = search[0] === '?' ? search.slice(1) : search;
  return querystring.parse(searchString);
}

export {
  parseSearch,
};
