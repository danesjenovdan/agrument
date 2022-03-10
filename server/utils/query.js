function stringifyQuery(params) {
  return new URLSearchParams(params).toString();
}

export { stringifyQuery };
