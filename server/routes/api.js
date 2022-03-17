import fastifyCors from 'fastify-cors';
import _ from 'lodash';
import db from '../database.js';

function getLastAgrumentHandler(request, reply) {
  db('posts')
    .where('type', 'published')
    .orderBy('date', 'desc')
    .first()
    .then((data) => {
      reply.send({
        post: data,
      });
    });
}

function getWordCountHandler(request, reply) {
  let year = null;
  if (request.query.year && request.query.year.length === 4) {
    const parsedYear = parseInt(request.query.year, 10);
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

  query.select('content').then((data) => {
    const allWords = data.map((e) =>
      e.content ? e.content.split(' ').length : 0
    );
    reply.send({
      count: _.sum(allWords),
    });
  });
}

export default function registerRoutes(fastify, opts, done) {
  fastify.register(fastifyCors, {
    origin: '*',
  });

  fastify.get('/last-agrument', getLastAgrumentHandler);
  fastify.get('/word-count', getWordCountHandler);

  done();
}
