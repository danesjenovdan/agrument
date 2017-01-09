import request from 'superagent';

const GET_SUBMISSIONS_URL = '/data/dash/active_submissions.json';

function getSubmissions() {
  return request.get(GET_SUBMISSIONS_URL);
}

export {
  getSubmissions,
};
