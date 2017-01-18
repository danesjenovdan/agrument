import request from 'superagent';

const GET_POST_URL = '/api/agrument';

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function formatDateForURL(date) {
  const dateObj = new Date(date);
  return `${dateObj.getDate()}.${dateObj.getMonth() + 1}.${dateObj.getFullYear()}`;
}

function getInitialPost(date) {
  return request.get(GET_POST_URL)
    .query({ date });
}

function getOlderPost(date) {
  return request.get(GET_POST_URL)
    .query({
      date: formatDateForURL(date),
      direction: 'older',
    });
}

function getNewerPost(date) {
  return request.get(GET_POST_URL)
    .query({
      date: formatDateForURL(date),
      direction: 'newer',
    });
}

export {
  validateEmail,
  formatDateForURL,
  getInitialPost,
  getOlderPost,
  getNewerPost,
};
