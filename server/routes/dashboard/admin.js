import randomstring from 'randomstring';
import db from '../../database.js';
import { toSloDateString } from '../../utils/date.js';

function getUsersHandler(request, reply) {
  db('users')
    .whereNot('name', '')
    .andWhereNot('password', '')
    .select('id', 'name', 'username', 'group', 'token', 'disabled')
    .then((data) => {
      reply.send({
        users: data,
      });
    })
    .catch((err) => {
      reply.status(500).send({
        error: err.message,
      });
    });
}

function postUsersDisableIdHandler(request, reply) {
  db('users')
    .andWhere('id', request.params.id)
    .update({
      disabled: request.body.disabled,
      token: null,
    })
    .then(() => {
      reply.send({
        success: 'Updated user',
      });
    })
    .catch((err) => {
      reply.status(500).send({
        error: err.message,
      });
    });
}

function postUsersCreateTokenIdHandler(request, reply) {
  db('users')
    .where('token', null)
    .andWhere('id', request.params.id)
    .update({
      token: randomstring.generate(8),
    })
    .then(() => {
      reply.send({
        success: 'Created token',
      });
    })
    .catch((err) => {
      reply.status(500).send({
        error: err.message,
      });
    });
}

function getUsersTokensHandler(request, reply) {
  db('users')
    .where('name', '')
    .andWhere('password', '')
    .andWhereNot('token', null)
    .select('id', 'token')
    .then((data) => {
      reply.send({
        users: data,
      });
    })
    .catch((err) => {
      reply.status(500).send({
        error: err.message,
      });
    });
}

function postUsersCreateHandler(request, reply) {
  db.transaction((trx) => {
    const tempUsername = Date.now().toString(); // db needs a unique username
    const uniqueToken = randomstring.generate(8);
    return trx
      .insert({
        username: tempUsername,
        name: '',
        password: '',
        token: uniqueToken,
      })
      .into('users')
      .then((ids) => {
        const id = ids[0];
        return trx.first('id', 'token').from('users').where('id', id);
      });
  })
    .then((data) => {
      reply.send({
        user: data,
      });
    })
    .catch((err) => {
      reply.status(500).send({
        error: err.message,
      });
    });
}

function getSubmissionsHandler(request, reply) {
  db('posts')
    .whereIn('type', ['votable', 'pending'])
    .orderBy('date', 'asc')
    .leftOuterJoin('users', 'posts.author', 'users.id')
    .select(
      'posts.id',
      'posts.date',
      'posts.author',
      'posts.title',
      'posts.type',
      'users.username as author_name'
    )
    .then((data) => {
      reply.send({
        submissions: data,
      });
    })
    .catch((err) => {
      reply.status(500).send({
        error: err.message,
      });
    });
}

function postSubmissionsAddHandler(request, reply) {
  db.transaction((trx) => {
    const { date } = request.body;
    return trx
      .select('id')
      .from('posts')
      .where('date', date)
      .then((rows) => {
        if (rows && rows.length !== 0) {
          throw new Error('Submission with this date already exists');
        }
        return trx
          .insert({
            date: request.body.date,
            author: request.body.author,
            title: '',
            content: '',
            description: '',
            imageURL: '',
            imageCaption: '',
            imageCaptionURL: '',
            imageAltText: '',
            hasEmbed: 0,
            rights: '',
            type: 'pending',
          })
          .into('posts');
      });
  })
    .then(() => {
      reply.send({
        success: 'Added submission',
      });
    })
    .catch((err) => {
      reply.status(500).send({
        error: err.message,
      });
    });
}

function deleteSubmissionsRemoveIdHandler(request, reply) {
  db.transaction(async (trx) => {
    await trx
      .from('posts')
      .whereIn('type', ['votable', 'pending'])
      .andWhere('id', request.params.id)
      .delete();

    await trx.from('votes').where('post', request.params.id).delete();
  })
    .then(() => {
      reply.send({
        success: 'Removed submission',
      });
    })
    .catch((err) => {
      reply.status(500).send({
        error: err.message,
      });
    });
}

function postVotablePublishIdHandler(request, reply) {
  db.transaction(async (trx) => {
    const post = await trx
      .from('posts')
      .where('type', 'votable')
      .andWhere('id', request.params.id)
      .first();

    await trx
      .from('posts')
      .where('type', 'votable')
      .andWhere('id', request.params.id)
      .update({
        type: 'published',
      });

    const url = `https://danesjenovdan.si/agrument/${toSloDateString(
      post.date
    )}`;

    // if (process.env.NODE_ENV === 'production') {
    //   try {
    //     const text = `${post.tweet}\n${url}`;
    //     const response = await request_
    //       .post('https://api.djnd.si/sendTweet/')
    //       .field('tweet_text', text)
    //       .field('secret', process.env.TWITTER_SECRET);
    //     // eslint-disable-next-line no-console
    //     console.log('Twitter post response:', response.status, response.text);
    //   } catch (error) {
    //     sendErrorToSlack('twitterPost', error);
    //   }
    //   try {
    //     const response = await request_
    //       .post('https://podpri.djnd.si/api/send-agrument-mail/')
    //       .send({
    //         url,
    //         title: post.title,
    //         content_html: post.content,
    //         image_url: `https://agrument.danesjenovdan.si${getFullImageURL(
    //           post.imageURL
    //         )}`,
    //         image_source: post.imageCaption,
    //         image_source_url: post.imageCaptionURL,
    //         image_alt_text: post.imageAltText,
    //         email_template_id: post.emailTemplate === 'project' ? 232 : 42,
    //       })
    //       .set('Authorization', process.env.MAUTIC_SECRET);
    //     // eslint-disable-next-line no-console
    //     console.log(
    //       'Mautic send mail response:',
    //       response.status,
    //       response.text
    //     );
    //   } catch (error) {
    //     sendErrorToSlack('sendMauticMail', error);
    //   }
    // }
  })
    .then(() => {
      reply.send({
        success: 'Published',
      });
    })
    .catch((err) => {
      reply.status(500).send({
        error: err.message,
      });
    });
}

function requireAdmin(request, reply, done) {
  if (!request.user || request.user.group !== 'admin') {
    reply.status(403).send({
      error: 'Forbidden',
    });
  } else {
    done();
  }
}

export default function registerRoutes(fastify, opts, done) {
  // Require that the user is logged in for all requests on this router.
  fastify.addHook('preHandler', requireAdmin);

  fastify.get('/users', getUsersHandler);
  fastify.post('/users/disable/:id', postUsersDisableIdHandler);
  fastify.post('/users/createtoken/:id', postUsersCreateTokenIdHandler);
  fastify.get('/users/tokens', getUsersTokensHandler);
  fastify.post('/users/create', postUsersCreateHandler);
  fastify.get('/submissions', getSubmissionsHandler);
  fastify.post('/submissions/add', postSubmissionsAddHandler);
  fastify.delete('/submissions/remove/:id', deleteSubmissionsRemoveIdHandler);
  fastify.post('/votable/publish/:id', postVotablePublishIdHandler);

  done();
}
