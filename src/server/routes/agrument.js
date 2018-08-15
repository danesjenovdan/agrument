import express from 'express';
import { isArray } from 'lodash';
import db from '../database';
import { toDateTimestamp } from '../../utils/date';
import { getFullImageURL } from '../utils/image';

const router = express.Router();

router.get('/', (req, res) => {
  let query = db('posts')
    .where('type', 'published');
  if (req.query.all) {
    query = query.select();
  } else if (req.query.date && req.query.direction) {
    /**
     * Date and direction provided:
     *  - if valid direction return first post after that date in that direction or empty if none
     *  - if invalid direction return error
     */
    const date = toDateTimestamp(req.query.date);
    if (req.query.direction === 'newer') {
      query = query
        .andWhere('date', '>', date)
        .orderBy('date', 'asc')
        .first();
    } else if (req.query.direction === 'older') {
      query = query
        .andWhere('date', '<', date)
        .orderBy('date', 'desc')
        .first();
    } else {
      res.status(400).json({
        error: 'Bad Request (invalid direction)',
      });
      return;
    }
  } else if (req.query.date) {
    /**
     * Date was provided:
     *  - if valid date return first post with that date or empty if no posts on that day
     *  - if invalid date return first post with todays date or empty if no posts today
     */
    const date = toDateTimestamp(req.query.date);
    query = query
      .andWhere('date', date)
      .first();
  } else {
    /**
     * No date provided:
     *  - return latest post
     */
    query = query
      .orderBy('date', 'desc')
      .first();
  }

  query
    .then((data) => {
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
        res.json({
          post: mapped,
        });
      } else if (data) {
        const post = data;
        if (post.imageURL) {
          post.imageURL = getFullImageURL(post.imageURL);
        }
        res.json({
          post,
        });
      } else {
        res.json({
          post: undefined,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

export default router;
