import express from 'express';
import { Feed } from 'feed';
import db from '../database';
import { getFullImageURL } from '../utils/image';
import { toSloDateString } from '../../utils/date';

const router = express.Router();

async function getFeed() {
  const posts = await db
    .from('posts')
    .where('type', 'published')
    .orderBy('date', 'desc')
    .limit(50)
    .select();

  const feed = new Feed({
    title: 'Agrument',
    description: 'Divja misel kiselkastega okusa.',
    id: 'https://agrument.danesjenovdan.si/',
    link: 'https://agrument.danesjenovdan.si/',
    image: 'https://danesjenovdan.si/img/agrum.png',
    favicon: 'https://danesjenovdan.si/favicon.ico',
    updated: new Date(posts[0].date),
    generator: 'feed',
    feedLinks: {
      json: 'https://agrument.danesjenovdan.si/rss/json',
      atom: 'https://agrument.danesjenovdan.si/rss/atom',
    },
  });

  posts.forEach((post) => {
    const url = `https://agrument.danesjenovdan.si/${toSloDateString(post.date)}`;
    const imageURL = `https://agrument.danesjenovdan.si${getFullImageURL(post.imageURL)}`;
    feed.addItem({
      guid: url,
      title: post.title,
      id: url,
      link: url,
      description: post.description,
      content: `<img src="${imageURL}"><br>${post.content}`,
      date: new Date(post.date),
      image: imageURL,
    });
  });

  return feed;
}

router.get('/', (req, res) => {
  getFeed()
    .then((feed) => {
      res.set('Content-Type', 'application/rss+xml');
      res.send(feed.rss2());
    })
    .catch((err) => {
      console.error(err);
      res.send(err);
    });
});

router.get('/atom', (req, res) => {
  getFeed()
    .then((feed) => {
      res.set('Content-Type', 'application/atom+xml');
      res.send(feed.atom1());
    })
    .catch((err) => {
      console.error(err);
      res.send(err);
    });
});

router.get('/json', (req, res) => {
  getFeed()
    .then((feed) => {
      res.set('Content-Type', 'application/json');
      res.send(feed.json1());
    })
    .catch((err) => {
      console.error(err);
      res.send(err);
    });
});

export default router;
