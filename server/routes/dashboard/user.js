import fs from 'fs-extra';
import _ from 'lodash';
import db from '../../database.js';
import { getFullImagePath, getFullImageURL } from '../../utils/image.js';

function getUserHandler(request, reply) {
  reply.send({
    user: _.pick(request.user, ['id', 'username', 'name', 'group']),
  });
}

function getPublishedHandler(request, reply) {
  let afterDate = null;
  let afterOffset = null;
  if (request.query.after && request.query.after.indexOf('+') !== -1) {
    const parts = request.query.after.split('+');
    // eslint-disable-next-line prefer-destructuring
    afterDate = parts[0];
    afterOffset = Number(parts[1]) || 0;
  }

  let query = db('posts').where('type', 'published');

  if (afterDate) {
    query = query.andWhere('date', '<=', afterDate);
  }

  if (request.query.q) {
    if (request.query.q === 'X:no-image') {
      query = query
        .orderBy('date', 'desc')
        .leftOuterJoin('users', 'posts.author', 'users.id')
        .select(
          'posts.imageURL',
          'posts.id',
          'posts.date',
          'posts.author',
          'posts.title',
          'users.username as author_name'
        )
        .then((data) => {
          const noImage = data.filter((e) => {
            const img = getFullImagePath(e.imageURL);
            return !fs.existsSync(img);
          });
          reply.send({
            ignorePagination: true,
            published: noImage,
          });
        })
        .catch((err) => {
          reply.status(500).send({
            error: err.message,
          });
        });
      return;
    }

    query = query.andWhere((qb) => {
      const q = `%${request.query.q}%`;
      qb.where('title', 'like', q).orWhere('content', 'like', q);
    });
  }

  query = query
    .orderBy('date', 'desc')
    .leftOuterJoin('users', 'posts.author', 'users.id')
    .select(
      'posts.id',
      'posts.date',
      'posts.author',
      'posts.title',
      'users.username as author_name'
    )
    .limit(21); // one more than is needed to see if there are any more pages after this

  if (afterOffset != null) {
    query = query.offset(afterOffset);
  }

  query
    .then((data) => {
      reply.send({
        published: data,
      });
    })
    .catch((err) => {
      reply.status(500).send({
        error: err.message,
      });
    });
}

function postSubmissionEditIdHandler(request, reply) {
  db.transaction(async (trx) => {
    // omit some keys so you can't for example change the id or author by mistake
    let disallowed;
    if (request.user.group === 'admin') {
      disallowed = ['id', 'author_name'];
    } else {
      disallowed = ['id', 'author_name', 'author', 'type', 'date'];
    }
    const { imageURL, imageName, ...data } = _.omit(request.body, disallowed);

    // if (req.file) {
    //   await optimizeImage(req.file.path);
    //   data.imageURL = req.file.filename;
    // }

    if (Object.keys(data).length) {
      const numRows = await trx
        .from('posts')
        .andWhere('id', request.params.id)
        .update(data);

      if (numRows && request.body.type === 'pending') {
        await trx.from('votes').where('post', request.params.id).delete();
      }
    }

    return data.imageURL;
  })
    .then((imageURL) => {
      const returnData = {
        success: 'Edited submission',
      };
      if (imageURL) {
        returnData.imageURL = getFullImageURL(imageURL);
      }
      reply.send(returnData);
    })
    .catch((err) => {
      reply.status(500).send({
        error: err.message,
      });
    });
}

function getPendingHandler(request, reply) {
  db('posts')
    .where('type', 'pending')
    .andWhere('author', request.user.id)
    .orderBy('date', 'asc')
    .leftOuterJoin('users', 'posts.author', 'users.id')
    .select('posts.*', 'users.username as author_name')
    .then((data) => {
      const mapped = data.map((post) => {
        if (post.imageURL) {
          return {
            ...post,
            imageURL: getFullImageURL(post.imageURL),
          };
        }
        return post;
      });
      reply.send({
        pending: mapped,
      });
    })
    .catch((err) => {
      reply.status(500).send({
        error: err.message,
      });
    });
}

function postPendingSubmitIdHandler(request, reply) {
  db.transaction(async (trx) => {
    const { title, fbtext } = await trx
      .from('posts')
      .where('type', 'pending')
      .andWhere('id', request.params.id)
      .first('title', 'fbtext');

    const text = fbtext
      .slice(fbtext.indexOf('\n\n') + 2, fbtext.lastIndexOf('\n\nSlika: '))
      .replace(/\s?\[https?:\/\/.+?\]/g, '')
      .replace(/\s\s+/g, ' ')
      .replace(/(^[\s\u200b]*|[\s\u200b]*$)/g, ''); // \u200b is zero-width space

    await trx
      .from('posts')
      .where('type', 'pending')
      .andWhere('author', request.user.id)
      .andWhere('id', request.params.id)
      .update({
        type: 'votable',
      });

    // if (
    //   process.env.NODE_ENV === 'production' &&
    //   process.env.SLACK_WEBHOOK_NOTIFY_URL
    // ) {
    //   await request_.post(process.env.SLACK_WEBHOOK_NOTIFY_URL).send({
    //     text: 'Yo, <!channel>! Imamo <https://agrument.danesjenovdan.si/dash|nov agrument>!',
    //     attachments: [
    //       {
    //         fallback: 'Your client is stupid, go vote.',
    //         color: '#36a64f',
    //         fields: [
    //           {
    //             title,
    //             value: text,
    //             short: false,
    //           },
    //         ],
    //         actions: [
    //           {
    //             type: 'button',
    //             text: 'Glasuj! 🗳️',
    //             url: 'https://agrument.danesjenovdan.si/dash',
    //           },
    //         ],
    //       },
    //     ],
    //   });
    // }
  })
    .then(() => {
      reply.send({
        success: 'Submitted for vote',
      });
    })
    .catch((err) => {
      reply.status(500).send({
        error: err.message,
      });
    });
}

function getVotableHandler(request, reply) {
  db('posts')
    .where('type', 'votable')
    .orderBy('date', 'asc')
    .leftOuterJoin('users', 'posts.author', 'users.id')
    .select('posts.*', 'users.username as author_name')
    .then((data) => {
      const mapped = data.map((post) => {
        if (post.imageURL) {
          return {
            ...post,
            imageURL: getFullImageURL(post.imageURL),
          };
        }
        return post;
      });
      reply.send({
        votable: mapped,
      });
    })
    .catch((err) => {
      reply.status(500).send({
        error: err.message,
      });
    });
}

function getEditDateHandler(request, reply) {
  let query;
  if (request.user.group === 'admin') {
    query = db('posts').where('date', request.params.date);
  } else {
    query = db('posts')
      .where('date', request.params.date)
      .andWhere((builder) =>
        builder.where('author', request.user.id).orWhere('type', 'votable')
      );
  }

  query
    .leftOuterJoin('users', 'posts.author', 'users.id')
    .select('posts.*', 'users.username as author_name')
    .first()
    .then((data) => {
      if (data) {
        const post = data;
        if (post.imageURL) {
          post.imageURL = getFullImageURL(post.imageURL);
        }
        reply.send({
          data: post,
        });
      } else {
        reply.status(404).send({
          error: 'Not Found',
        });
      }
    })
    .catch((err) => {
      reply.status(500).send({
        error: err.message,
      });
    });
}

function getVotesIdHandler(request, reply) {
  db('votes')
    .where('post', request.params.id)
    .leftOuterJoin('users', 'votes.author', 'users.id')
    .select('votes.*', 'users.username as author_name')
    .then((data) => {
      reply.send({
        votes: data,
      });
    })
    .catch((err) => {
      reply.status(500).send({
        error: err.message,
      });
    });
}

function postVoteId(request, reply) {
  db.transaction(async (trx) => {
    const { vote } = request.body;
    const { id } = request.params;

    if (vote === 'veto') {
      const { lastVetoVote } = await trx
        .from('users')
        .where('id', request.user.id)
        .first('lastVetoVote');

      if (
        lastVetoVote &&
        new Date(lastVetoVote).getUTCMonth() === new Date().getUTCMonth()
      ) {
        throw new Error('Veto limit reached!');
      }
    }

    const rows = await trx
      .from('votes')
      .where('post', id)
      .andWhere('author', request.user.id)
      .select('author', 'post', 'vote');

    // if user not voted yet just insert the vote
    if (rows.length === 0) {
      if (vote === 'veto') {
        await trx.from('users').where('id', request.user.id).update({
          lastVetoVote: Date.now(),
        });
      }
      return trx
        .insert({
          author: request.user.id,
          post: id,
          vote,
        })
        .into('votes');
    }

    // if vote is not veto allow changing
    if (rows[0].vote !== 'veto') {
      // voting the same again removes that vote
      if (rows[0].vote === vote) {
        return trx
          .from('votes')
          .where('post', id)
          .andWhere('author', request.user.id)
          .delete();
      }
      // voting differently changes the vote
      return trx
        .from('votes')
        .where('post', id)
        .andWhere('author', request.user.id)
        .update({
          vote,
        });
    }
    return null;
  })
    .then(() => {
      reply.send({
        success: 'Vote updated',
      });
    })
    .catch((err) => {
      reply.status(500).send({
        error: err.message,
      });
    });
}

function requireLoggedIn(request, reply, done) {
  if (!request.user) {
    reply.status(403).send({
      error: 'Forbidden',
    });
  } else {
    done();
  }
}

export default function registerRoutes(fastify, opts, done) {
  // Require that the user is logged in for all requests on this router.
  fastify.addHook('preHandler', requireLoggedIn);

  fastify.get('/user', getUserHandler);
  fastify.get('/published', getPublishedHandler);
  fastify.post('/submissions/edit/:id', postSubmissionEditIdHandler); // FIXME: add pre hook? imageUploader.single('imageURL')
  fastify.get('/pending', getPendingHandler);
  fastify.post('/pending/submit/:id', postPendingSubmitIdHandler);
  fastify.get('/votable', getVotableHandler);
  fastify.get('/edit/:date', getEditDateHandler);
  fastify.get('/votes/:id', getVotesIdHandler);
  fastify.post('/vote/:id', postVoteId);

  done();
}
