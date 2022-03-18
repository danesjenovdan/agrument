import { dash } from './api.js';

export async function addSubmission(userId, date) {
  const { data } = await dash.post('/submissions/add', {
    author: userId,
    date,
  });
  if (data.success !== 'Added submission') {
    throw new Error('Adding submission failed!');
  }
}

export async function removeSubmission(id) {
  const { data } = await dash.delete(`/submissions/remove/${id}`);
  if (data.success !== 'Removed submission') {
    throw new Error('Removing submission failed!');
  }
}

// const POST_DISABLE_USER = `${API_DASH}/users/disable/:id`;
// const POST_CREATE_USER_TOKEN = `${API_DASH}/users/createtoken/:id`;
// const GET_USERS_TOKENS = `${API_DASH}/users/tokens`;
// const POST_CREATE_USER = `${API_DASH}/users/create`;

// const POST_EDIT_SUBMISSION = `${API_DASH}/submissions/edit/:id`;
// const POST_SUBMIT_PENDING = `${API_DASH}/pending/submit/:id`;
// const POST_PUBLISH_VOTABLE = `${API_DASH}/votable/publish/:id`;
// const GET_EDITABLE = `${API_DASH}/edit/:date`;
// const GET_VOTES = `${API_DASH}/votes/:id`;
// const POST_VOTE = `${API_DASH}/vote/:id`;

// function disableUser(id, disabled) {
//   return request.post(POST_DISABLE_USER.replace(':id', id))
//     .send({ disabled });
// }

// function createUserToken(id) {
//   return request.post(POST_CREATE_USER_TOKEN.replace(':id', id));
// }

// function getTokenUsers() {
//   return request.get(GET_USERS_TOKENS);
// }

// function createUser() {
//   return request.post(POST_CREATE_USER);
// }

// function editSubmission(id, data) {
//   return request.post(POST_EDIT_SUBMISSION.replace(':id', id))
//     .send(data);
// }

// function uploadImage(id, imageURL, imageName) {
//   return request.post(POST_EDIT_SUBMISSION.replace(':id', id))
//     .attach('imageURL', imageURL, imageName);
// }

// function submitPending(id) {
//   return request.post(POST_SUBMIT_PENDING.replace(':id', id));
// }

// function publishVotable(id) {
//   return request.post(POST_PUBLISH_VOTABLE.replace(':id', id));
// }

// function getEditable(date) {
//   return request.get(GET_EDITABLE.replace(':date', date));
// }

// function getVotes(id) {
//   return request.get(GET_VOTES.replace(':id', id));
// }

// function submitVote(id, vote) {
//   return request.post(POST_VOTE.replace(':id', id))
//     .send({
//       id,
//       vote,
//     });
// }

// export {
//   disableUser,
//   createUserToken,
//   getTokenUsers,
//   createUser,
//   editSubmission,
//   uploadImage,
//   submitPending,
//   publishVotable,
//   getEditable,
//   getVotes,
//   submitVote,
// };
