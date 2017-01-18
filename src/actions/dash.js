import request from 'superagent';

const GET_PENDING_URL = '/api/agrument/pending';
const GET_VOTABLE_URL = '/api/agrument/votable';

function getPending() {
  return request.get(GET_PENDING_URL);
}

function getVotable() {
  return request.get(GET_VOTABLE_URL);
}

export {
  getPending,
  getVotable,
};
