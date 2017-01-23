import request from 'superagent';

const GET_PENDING_URL = '/api/dash/pending';
const GET_VOTABLE_URL = '/api/dash/votable';
const GET_PINNED_URL = '/api/dash/pinned';

function getPending() {
  return request.get(GET_PENDING_URL);
}

function getVotable() {
  return request.get(GET_VOTABLE_URL);
}

function getPinned() {
  return request.get(GET_PINNED_URL);
}

export {
  getPending,
  getVotable,
  getPinned,
};
