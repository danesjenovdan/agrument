import _ from 'lodash';
import express from 'express';
import db from '../database';

const router = express.Router();

router.get('/last_agrument', (req, res) => {
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

router.get('/word_count', (req, res) => {
  db('posts')
    .where('type', 'published')
    .select()
    .then((data) => {
      const allWords = data
        .map(e => e.content)
        .map(e => (e ? e.split(' ').length : 0));
      res.json({
        count: _.sum(allWords),
      });
    });
});

export default router;
