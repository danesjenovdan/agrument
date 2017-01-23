import db from './database';
import { toISODateString } from '../utils/date';

function getAgrument(req, res) {
  let query;
  if (req.query.all) {
    query = db('agrument')
      .select();
  } else if (req.query.date && req.query.direction) {
    /**
     * Date and direction provided:
     *  - if valid direction return first post after that date in that direction or empty if none
     *  - if invalid direction return error
     */
    const date = toISODateString(req.query.date);
    if (req.query.direction === 'newer') {
      query = db('agrument')
        .where('date', '>', date)
        .orderBy('date', 'asc')
        .first();
    } else if (req.query.direction === 'older') {
      query = db('agrument')
        .where('date', '<', date)
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
    const date = toISODateString(req.query.date);
    query = db('agrument')
      .where('date', date)
      .first();
  } else {
    /**
     * No date provided:
     *  - return latest post
     */
    query = db('agrument')
      .orderBy('date', 'desc')
      .first();
  }

  query
    .then((data) => {
      res.json({
        post: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
}

export default getAgrument;
