import request from 'superagent';

const GET_POSTS_URL = '/data/agrument.json';

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function formatDateForURL(date) {
  const dateObj = new Date(date);
  return `${dateObj.getDate()}.${dateObj.getMonth() + 1}.${dateObj.getFullYear()}`;
}

function getPostByID(id) {
  return request.get(GET_POSTS_URL)
    .query({ id });
}

function getInitialPost(dateString) {
  let req = request.get(GET_POSTS_URL);
  if (dateString) {
    req = req.query({ date: dateString });
  }
  return req;
}

export {
  validateEmail,
  formatDateForURL,
  getPostByID,
  getInitialPost,
};
