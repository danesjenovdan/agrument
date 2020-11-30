import _ from 'lodash';
import express from 'express';
import cors from 'cors';
import db from '../database';

const router = express.Router();

router.use(cors());

router.get('/last-agrument', (req, res) => {
  db('posts')
    .where('type', 'published')
    .orderBy('date', 'desc')
    .first()
    .then((data) => {
      res.json({
        post: data,
      });
    });
});

router.get('/word-count', (req, res) => {
  let year = null;
  if (req.query.year && req.query.year.length === 4) {
    const parsedYear = parseInt(req.query.year, 10);
    if (parsedYear && parsedYear > 999 && parsedYear <= 9999) {
      year = parsedYear;
    }
  }

  let query = db('posts').where('type', 'published');

  if (year) {
    const startOfYear = Date.UTC(year, 0, 1);
    const endOfYear = Date.UTC(year + 1, 0, 1) - 1;
    query = query.andWhereBetween('date', [startOfYear, endOfYear]);
  }

  query
    .select('content')
    .then((data) => {
      const allWords = data
        .map((e) => (e.content ? e.content.split(' ').length : 0));
      res.json({
        count: _.sum(allWords),
      });
    });
});

export default router;
