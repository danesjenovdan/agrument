function parseQuery(queryString) {
  return Object.fromEntries(new URLSearchParams(queryString));
}

export { parseQuery };
