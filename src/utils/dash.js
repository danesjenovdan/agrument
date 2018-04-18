import request from 'superagent';

const API_DASH = '/api/dash';

const GET_USER = `${API_DASH}/user`;
const GET_USERS = `${API_DASH}/users`;
const GET_USERS_TOKENS = `${API_DASH}/users/tokens`;
const POST_CREATE_USER = `${API_DASH}/users/create`;
const GET_PUBLISHED = `${API_DASH}/published`;
const GET_SUBMISSIONS = `${API_DASH}/submissions`;
const POST_ADD_SUBMISSION = `${API_DASH}/submissions/add`;
const POST_ADD_BULK_SUBMISSION = `${API_DASH}/submissions/addbulk`;
const DELETE_REMOVE_SUBMISSION = `${API_DASH}/submissions/remove/:id`;
const POST_EDIT_SUBMISSION = `${API_DASH}/submissions/edit/:id`;
const GET_PENDING = `${API_DASH}/pending/`;
const POST_SUBMIT_PENDING = `${API_DASH}/pending/submit/:id`;
const GET_VOTABLE = `${API_DASH}/votable`;
const POST_PUBLISH_VOTABLE = `${API_DASH}/votable/publish/:id`;
const GET_PINNED = `${API_DASH}/pinned`;
const POST_ADD_PINNED = `${API_DASH}/pinned/add`;
const DELETE_REMOVE_PINNED = `${API_DASH}/pinned/remove/:id`;
const GET_EDITABLE = `${API_DASH}/edit/:date`;
const GET_VOTES = `${API_DASH}/votes`;
const VOTE_FOR = `${API_DASH}/vote/for`;
const VOTE_AGAINST = `${API_DASH}/vote/against`;
const VOTE_VETO = `${API_DASH}/vote/veto`;

function getUser() {
  return request.get(GET_USER);
}

function getUsers() {
  return request.get(GET_USERS);
}

function getTokenUsers() {
  return request.get(GET_USERS_TOKENS);
}

function createUser() {
  return request.post(POST_CREATE_USER);
}

function getPublished(date, offset, searchQuery) {
  let req = request.get(GET_PUBLISHED);
  const queryObj = {};
  if (searchQuery) {
    queryObj.q = searchQuery;
  }
  if (date && offset != null) {
    queryObj.after = `${date}+${offset}`;
  }
  req = req.query(queryObj);
  return req;
}

function getSubmissions() {
  return request.get(GET_SUBMISSIONS);
}

function addSubmission(userId, deadline) {
  return request.post(POST_ADD_SUBMISSION)
    .send({
      author: userId,
      deadline,
      date: deadline,
    });
}

function addBulkSubmission(data) {
  return request.post(POST_ADD_BULK_SUBMISSION)
    .send(data);
}

function removeSubmission(id) {
  return request.del(DELETE_REMOVE_SUBMISSION.replace(':id', id));
}

function editSubmission(id, data) {
  return request.post(POST_EDIT_SUBMISSION.replace(':id', id))
    .send(data);
}

function getPending() {
  return request.get(GET_PENDING);
}

function submitPending(id) {
  return request.post(POST_SUBMIT_PENDING.replace(':id', id));
}

function getVotable() {
  return request.get(GET_VOTABLE);
}

function publishVotable(id) {
  return request.post(POST_PUBLISH_VOTABLE.replace(':id', id));
}

function getPinned() {
  return request.get(GET_PINNED);
}

function addPinned(message) {
  return request.post(POST_ADD_PINNED)
    .send({ message });
}

function removePinned(id) {
  return request.del(DELETE_REMOVE_PINNED.replace(':id', id));
}

function getEditable(date) {
  return request.get(GET_EDITABLE.replace(':date', date));
}

function getVotes() {
  return request.get(GET_VOTES);
}

function voteFor(data) {
  return request.post(VOTE_FOR)
    .send({ data });
}

function voteAgainst(data) {
  return request.post(VOTE_AGAINST)
    .send({ data });
}

function voteVeto(data) {
  return request.post(VOTE_VETO)
    .send({ data });
}

export {
  getUser,
  getUsers,
  getTokenUsers,
  createUser,
  getPublished,
  getSubmissions,
  addSubmission,
  addBulkSubmission,
  removeSubmission,
  editSubmission,
  getPending,
  submitPending,
  getVotable,
  publishVotable,
  getPinned,
  addPinned,
  removePinned,
  getVotes,
  voteFor,
  voteAgainst,
  voteVeto,
  getEditable,
};
