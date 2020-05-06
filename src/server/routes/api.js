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
  db('posts')
    .where('type', 'published')
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
