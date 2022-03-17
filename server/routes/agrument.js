import fastifyCors from 'fastify-cors';
import _ from 'lodash';
import db from '../database.js';
import { toDateTimestamp } from '../utils/date.js';
import { getFullImageURL } from '../utils/image.js';

const MLADINA_EXTRA_PARAGRAPH =
  '<p><a href="https://agrument.danesjenovdan.si" target="blank">Agrument</a> ustvarja <a href="https://danesjenovdan.si/" target="blank">Danes je nov dan</a>.</p>';

function getData(queryObj) {
  const query = db('posts').where('type', 'published');
  if (queryObj.all) {
    return query.select();
  }
  if (queryObj.date && queryObj.direction) {
    /**
     * Date and direction provided:
     *  - if valid direction return first post after that date in that direction or empty if none
     *  - if invalid direction return error
     */
    const date = toDateTimestamp(queryObj.date);
    if (queryObj.direction === 'newer') {
      return query.andWhere('date', '>', date).orderBy('date', 'asc').first();
    }
    if (queryObj.direction === 'older') {
      return query.andWhere('date', '<', date).orderBy('date', 'desc').first();
    }
    throw new Error('Bad Request (invalid direction)');
  }
  if (queryObj.date) {
    /**
     * Date was provided:
     *  - if valid date return first post with that date or empty if no posts on that day
     *  - if invalid date return first post with todays date or empty if no posts today
     */
    const date = toDateTimestamp(queryObj.date);
    return query.andWhere('date', date).first();
  }
  /**
   * No date provided:
   *  - return latest post
   */
  return query.orderBy('date', 'desc').first();
}

async function getPost(queryObj) {
  const data = await getData(queryObj);
  if (_.isArray(data)) {
    const mapped = data.map((post) => {
      if (post.imageURL) {
        return {
          ...post,
          imageURL: getFullImageURL(post.imageURL),
          content: queryObj.mladina
            ? post.content + MLADINA_EXTRA_PARAGRAPH
            : post.content,
        };
      }
      return post;
    });
    return mapped;
  }
  if (data) {
    const post = data;
    if (post.imageURL) {
      post.imageURL = getFullImageURL(post.imageURL);
    }
    if (queryObj.mladina && post.content) {
      post.content += MLADINA_EXTRA_PARAGRAPH;
    }
    return post;
  }
  return null;
}

function getAgrumentHandler(request, reply) {
  getPost(request.query)
    .then((post) => {
      reply.send({
        post,
      });
    })
    .catch((err) => {
      reply.status(500).send({
        error: err.message,
      });
    });
}

export { getPost };

export default function registerRoutes(fastify, opts, done) {
  fastify.register(fastifyCors, {
    origin: '*',
  });

  fastify.get('/', getAgrumentHandler);

  done();
}
