import request from 'superagent';
import { toSloDateString } from './date';

const GET_POST_URL = '/api/agrument';

function getInitialPost(date) {
  return request.get(GET_POST_URL)
    .query({ date });
}

function getOlderPost(date) {
  return request.get(GET_POST_URL)
    .query({
      date: toSloDateString(date),
      direction: 'older',
    });
}

function getNewerPost(date) {
  return request.get(GET_POST_URL)
    .query({
      date: toSloDateString(date),
      direction: 'newer',
    });
}

export {
  getInitialPost,
  getOlderPost,
  getNewerPost,
};
