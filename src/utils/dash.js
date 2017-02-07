import request from 'superagent';

const GET_PENDING_URL = '/api/dash/pending';
const EDIT_PENDING_URL = '/api/dash/pending/edit';
const GET_VOTABLE_URL = '/api/dash/votable';
const GET_PINNED_URL = '/api/dash/pinned';
const REMOVE_PINNED_URL = '/api/dash/pinned/remove';
const ADD_PINNED_URL = '/api/dash/pinned/add';
const USER_URL = '/api/dash/user';

function getPending() {
  return request.get(GET_PENDING_URL);
}

function editPending(id, data) {
  return request.post(`${EDIT_PENDING_URL}/${id}`)
    .send(data);
}

function getVotable() {
  return request.get(GET_VOTABLE_URL);
}

function getPinned() {
  return request.get(GET_PINNED_URL);
}

function removePinned(id) {
  return request.del(`${REMOVE_PINNED_URL}/${id}`);
}

function addPinned(message) {
  return request.post(ADD_PINNED_URL)
    .send({ message });
}

function getUser() {
  return request.get(USER_URL);
}

export {
  getPending,
  editPending,
  getVotable,
  getPinned,
  removePinned,
  addPinned,
  getUser,
};
