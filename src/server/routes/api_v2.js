import express from 'express';
import cors from 'cors';
import qs from 'querystring';
import db from '../database';
import { getFullImageURL } from '../utils/image';
import { parseDate } from '../../utils/date';

const BASE_URL = 'https://agrument.danesjenovdan.si';

function clamp(val, min, max, def) {
  return Math.min(Math.max(Number.parseInt(val, 10) || def, min), max);
}

function validateSort(sortVal, def) {
  if (sortVal === '' || sortVal == null) {
    return def;
  }
  if (['-timestamp', 'timestamp', '-datetime', 'datetime'].includes(sortVal)) {
    return sortVal;
  }
  return false;
}

function countPosts() {
  return db('posts')
    .where('type', 'published')
    .count()
    .then(data => data[0]['count(*)']);
}

function countPostsBefore(timestamp, sort) {
  return db('posts')
    .where('type', 'published')
    .andWhere('date', sort[0] === '-' ? '>' : '<', timestamp)
    .count()
    .then(data => data[0]['count(*)']);
}

function getPosts({ limit, offset, sort }) {
  return db('posts')
    .where('type', 'published')
    .orderBy('date', sort[0] === '-' ? 'desc' : 'asc')
    .offset(offset)
    .limit(limit);
}

function mapPost(post) {
  const dateTime = new Date(post.date).toISOString();
  const urlDate = dateTime.split('T')[0].split('-').reverse().join('.');
  const imageURL = getFullImageURL(post.imageURL);
  const fullImageURL = /^https?:\/\//g.test(imageURL) ? imageURL : `${BASE_URL}${imageURL}`;
  return {
    id: post.id,
    timestamp: post.date,
    datetime: dateTime,
    url: `${BASE_URL}/${urlDate}`,
    title: post.title,
    content_html: post.content,
    content_plain: post.fbtext,
    description: post.description,
    image_url: fullImageURL,
    image_source: post.imageCaption,
    image_source_url: post.imageCaptionURL,
  };
}

const router = express.Router();

router.use(cors());

router.get('/posts', (req, res) => {
  const path = `${req.baseUrl}${req.path}`;

  const query = {
    limit: clamp(req.query.limit, 1, 50, 10),
    offset: clamp(req.query.offset, 0, Number.MAX_SAFE_INTEGER, 0),
    sort: validateSort(req.query.sort, '-timestamp'),
  };

  if (query.sort === false) {
    res.status(400).json({
      error: 'Bad Request (invalid `sort` value)',
    });
    return;
  }

  if (req.query.start_date != null && req.query.offset != null) {
    res.status(400).json({
      error: 'Bad Request (both `start_date` and `offset` defined at the same time)',
    });
    return;
  }

  let waitForPromise = Promise.resolve();

  if (req.query.start_date != null) {
    const startDate = parseDate(req.query.start_date, false);

    if (!startDate) {
      res.status(400).json({
        error: 'Bad Request (invalid `start_date` value)',
      });
      return;
    }

    if (startDate) {
      const startTime = startDate.getTime();
      waitForPromise = countPostsBefore(startTime, query.sort).then((count) => {
        query.offset = count;
      });
    }
  }

  waitForPromise
    .then(() => countPosts())
    .then((count) => {
      const prevOffset = query.offset >= query.limit ? query.offset - query.limit : 0;
      const nextOffset = query.offset + query.limit;
      const lastOffset = Math.floor(count / query.limit) * query.limit;

      return getPosts(query)
        .then((posts) => {
          res.json({
            links: {
              first: `${BASE_URL}${path}?${qs.stringify({ ...query, offset: 0 })}`,
              prev: query.offset > 0 ? `${BASE_URL}${path}?${qs.stringify({ ...query, offset: prevOffset })}` : null,
              self: `${BASE_URL}${path}?${qs.stringify(query)}`,
              next: nextOffset <= lastOffset ? `${BASE_URL}${path}?${qs.stringify({ ...query, offset: nextOffset })}` : null,
              last: `${BASE_URL}${path}?${qs.stringify({ ...query, offset: lastOffset })}`,
            },
            data: posts.map(mapPost),
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

export default router;
