import knex from 'knex';

const db = knex({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'djnd',
    timezone: 'Z',
    charset: 'utf8',
  },
});

function parseDate(input) {
  const str = String(input);
  const parts = str.split('.');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    if (day && month && year) {
      return new Date(Date.UTC(year, month - 1, day));
    }
  }
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

function getAgrument(req, res) {
  let query;
  if (req.query.date && req.query.direction) {
    /**
     * Date and direction provided:
     *  - if valid direction return first post after that date in that direction or empty if none
     *  - if invalid direction return error
     */
    const date = parseDate(req.query.date);
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
    const date = parseDate(req.query.date);
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

export {
  getAgrument,
};
