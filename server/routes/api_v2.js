import db from '../database.js';
import { getFullImageURL } from '../utils/image.js';
import { parseDate } from '../utils/date.js';
import { stringifyQuery } from '../utils/query.js';

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
    .then((data) => data[0]['count(*)']);
}

function countPostsBefore(timestamp, sort) {
  return db('posts')
    .where('type', 'published')
    .andWhere('date', sort[0] === '-' ? '>' : '<', timestamp)
    .count()
    .then((data) => data[0]['count(*)']);
}

function getPosts({ limit, offset, sort }) {
  return db('posts')
    .where('type', 'published')
    .orderBy('date', sort[0] === '-' ? 'desc' : 'asc')
    .offset(offset)
    .limit(limit);
}

function mapPost(post, request) {
  const dateTime = new Date(post.date).toISOString();
  const urlDate = dateTime.split('T')[0].split('-').reverse().join('.');
  const imageURL = getFullImageURL(post.imageURL);
  const baseURL = `${request.protocol}://${request.hostname}`;
  const fullImageURL = /^https?:\/\//g.test(imageURL)
    ? imageURL
    : `${baseURL}${imageURL}`;
  return {
    id: post.id,
    timestamp: post.date,
    datetime: dateTime,
    url: `${baseURL}/${urlDate}`,
    title: post.title,
    content_html: post.content,
    content_plain: post.fbtext,
    description: post.description,
    image_url: fullImageURL,
    image_source: post.imageCaption,
    image_source_url: post.imageCaptionURL,
    image_alt_text: post.imageAltText,
  };
}

function getPostsHandler(request, reply) {
  const path = `${request.protocol}://${request.hostname}${request.routerPath}`;

  const query = {
    limit: clamp(request.query.limit, 1, 50, 10),
    offset: clamp(request.query.offset, 0, Number.MAX_SAFE_INTEGER, 0),
    sort: validateSort(request.query.sort, '-timestamp'),
  };

  if (query.sort === false) {
    reply.status(400).send({
      error: 'Bad Request (invalid `sort` value)',
    });
    return;
  }

  if (request.query.start_date != null && request.query.offset != null) {
    reply.status(400).send({
      error:
        'Bad Request (both `start_date` and `offset` defined at the same time)',
    });
    return;
  }

  let waitForPromise = Promise.resolve();

  if (request.query.start_date != null) {
    const startDate = parseDate(request.query.start_date, false);

    if (!startDate) {
      reply.status(400).send({
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
      const prevOffset =
        query.offset >= query.limit ? query.offset - query.limit : 0;
      const nextOffset = query.offset + query.limit;
      const lastOffset = Math.max(
        0,
        Math.floor((count - 1) / query.limit) * query.limit
      );

      return getPosts(query).then((posts) => {
        reply.send({
          links: {
            first: `${path}?${stringifyQuery({
              ...query,
              offset: 0,
            })}`,
            prev:
              query.offset > 0
                ? `${path}?${stringifyQuery({
                    ...query,
                    offset: prevOffset,
                  })}`
                : null,
            self: `${path}?${stringifyQuery(query)}`,
            next:
              nextOffset <= lastOffset
                ? `${path}?${stringifyQuery({
                    ...query,
                    offset: nextOffset,
                  })}`
                : null,
            last: `${path}?${stringifyQuery({
              ...query,
              offset: lastOffset,
            })}`,
          },
          count,
          data: posts.map((post) => mapPost(post, request)),
        });
      });
    })
    .catch((err) => {
      reply.status(500).send({
        error: err.message,
      });
    });
}

export default function registerRoutes(fastify, opts, done) {
  fastify.get('/posts', getPostsHandler);
  done();
}
