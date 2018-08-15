import express from 'express';
import { isArray } from 'lodash';
import db from '../database';
import { toDateTimestamp } from '../../utils/date';
import { getFullImageURL } from '../utils/image';

const router = express.Router();

function getData(queryObj) {
  const query = db('posts')
    .where('type', 'published');
  if (queryObj.all) {
    return query.select();
  }
  if (queryObj.date && queryObj.direction) {
    /**
     * Date and direction provided:
     *  - if valid direction return first post after that date in that direction or empty if none
     *  - if invalid direction return error
     */
    const date = toDateTimestamp(queryObj.date);
    if (queryObj.direction === 'newer') {
      return query
        .andWhere('date', '>', date)
        .orderBy('date', 'asc')
        .first();
    }
    if (queryObj.direction === 'older') {
      return query
        .andWhere('date', '<', date)
        .orderBy('date', 'desc')
        .first();
    }
    throw new Error('Bad Request (invalid direction)');
  }
  if (queryObj.date) {
    /**
     * Date was provided:
     *  - if valid date return first post with that date or empty if no posts on that day
     *  - if invalid date return first post with todays date or empty if no posts today
     */
    const date = toDateTimestamp(queryObj.date);
    return query
      .andWhere('date', date)
      .first();
  }
  /**
   * No date provided:
   *  - return latest post
   */
  return query
    .orderBy('date', 'desc')
    .first();
}

async function getPost(queryObj) {
  const data = await getData(queryObj);
  if (isArray(data)) {
    const mapped = data.map((post) => {
      if (post.imageURL) {
        return {
          ...post,
          imageURL: getFullImageURL(post.imageURL),
        };
      }
      return post;
    });
    return mapped;
  }
  if (data) {
    const post = data;
    if (post.imageURL) {
      post.imageURL = getFullImageURL(post.imageURL);
    }
    return post;
  }
  return null;
}

router.get('/', (req, res) => {
  getPost(req.query)
    .then((post) => {
      res.json({
        post,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

export default router;
export {
  getPost,
};
