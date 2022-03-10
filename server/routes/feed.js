import { Feed } from 'feed';
import db from '../database.js';
import { getFullImageURL } from '../utils/image.js';
import { toSloDateString } from '../utils/date.js';

async function getFeed(request) {
  const baseURL = `${request.protocol}://${request.hostname}`;

  const posts = await db
    .from('posts')
    .where('type', 'published')
    .orderBy('date', 'desc')
    .limit(50)
    .select();

  const feed = new Feed({
    title: 'Agrument',
    description: 'Divja misel kiselkastega okusa.',
    id: `${baseURL}/`,
    link: `${baseURL}/`,
    image: 'https://danesjenovdan.si/img/agrum.png', // TODO: fix
    favicon: 'https://danesjenovdan.si/favicon.ico',
    updated: new Date(posts[0].date),
    generator: 'feed',
    feedLinks: {
      json: `${baseURL}/rss/json`,
      atom: `${baseURL}/rss/atom`,
    },
  });

  posts.forEach((post) => {
    const url = `${baseURL}/${toSloDateString(post.date)}`;
    const imageURL = getFullImageURL(post.imageURL);
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

function getRssHandler(request, reply) {
  getFeed(request)
    .then((feed) => {
      reply.type('application/rss+xml; charset=utf-8').send(feed.rss2());
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      reply.send(err);
    });
}

function getAtomHandler(request, reply) {
  getFeed(request)
    .then((feed) => {
      reply.type('application/atom+xml; charset=utf-8').send(feed.atom1());
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      reply.send(err);
    });
}

function getJsonHandler(request, reply) {
  getFeed(request)
    .then((feed) => {
      reply.type('application/json').send(feed.json1());
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      reply.send(err);
    });
}

export default function registerRoutes(fastify, opts, done) {
  fastify.get('/', getRssHandler);
  fastify.get('/atom', getAtomHandler);
  fastify.get('/json', getJsonHandler);
  done();
}
