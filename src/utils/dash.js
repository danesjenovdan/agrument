import request from 'superagent';

const API_DASH = '/api/dash';

const GET_USER = `${API_DASH}/user`;
const GET_USERS = `${API_DASH}/users`;
const POST_DISABLE_USER = `${API_DASH}/users/disable/:id`;
const POST_CREATE_USER_TOKEN = `${API_DASH}/users/createtoken/:id`;
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
const GET_EDITABLE = `${API_DASH}/edit/:date`;
const GET_VOTES = `${API_DASH}/votes/:id`;
const POST_VOTE = `${API_DASH}/vote/:id`;

function getUser() {
  return request.get(GET_USER);
}

function getUsers() {
  return request.get(GET_USERS);
}

function disableUser(id, disabled) {
  return request.post(POST_DISABLE_USER.replace(':id', id))
    .send({ disabled });
}

function createUserToken(id) {
  return request.post(POST_CREATE_USER_TOKEN.replace(':id', id));
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

function addSubmission(userId, date) {
  return request.post(POST_ADD_SUBMISSION)
    .send({
      author: userId,
      date,
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

function uploadImage(id, imageURL, imageName) {
  return request.post(POST_EDIT_SUBMISSION.replace(':id', id))
    .attach('imageURL', imageURL, imageName);
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

function getEditable(date) {
  return request.get(GET_EDITABLE.replace(':date', date));
}

function getVotes(id) {
  return request.get(GET_VOTES.replace(':id', id));
}

function submitVote(id, vote) {
  return request.post(POST_VOTE.replace(':id', id))
    .send({
      id,
      vote,
    });
}

export {
  getUser,
  getUsers,
  disableUser,
  createUserToken,
  getTokenUsers,
  createUser,
  getPublished,
  getSubmissions,
  addSubmission,
  addBulkSubmission,
  removeSubmission,
  editSubmission,
  uploadImage,
  getPending,
  submitPending,
  getVotable,
  publishVotable,
  getEditable,
  getVotes,
  submitVote,
};
