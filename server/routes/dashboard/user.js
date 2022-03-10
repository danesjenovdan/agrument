// import fs from 'fs-extra';
import _ from 'lodash';
// import randomstring from 'randomstring';
// import request from 'superagent';
// import db from '../database.js';
// import {
//   getFullImagePath,
//   getFullImageURL,
//   imageUploader,
//   optimizeImage,
// } from '../utils/image';
// import { fetchShortUrl } from '../../utils/shortener';
// import { toSloDateString } from '../../utils/date';
// import { sendErrorToSlack } from '../slack';

function getUserHandler(req, res) {
  res.json({
    user: _.pick(req.user, ['id', 'username', 'name', 'group']),
  });
}

// router.get('/published', (req, res) => {
//   let afterDate = null;
//   let afterOffset = null;
//   if (req.query.after && req.query.after.indexOf('+') !== -1) {
//     const parts = req.query.after.split('+');
//     afterDate = parts[0];
//     afterOffset = Number(parts[1]) || 0;
//   }

//   let query = db('posts').where('type', 'published');

//   if (afterDate) {
//     query = query.andWhere('date', '<=', afterDate);
//   }

//   if (req.query.q) {
//     if (req.query.q === 'X:no-image') {
//       query = query
//         .orderBy('date', 'desc')
//         .leftOuterJoin('users', 'posts.author', 'users.id')
//         .select(
//           'posts.imageURL',
//           'posts.id',
//           'posts.date',
//           'posts.author',
//           'posts.title',
//           'users.username as author_name'
//         )
//         .then((data) => {
//           const noImage = data.filter((e) => {
//             const img = getFullImagePath(e.imageURL);
//             return !fs.existsSync(img);
//           });
//           res.json({
//             ignorePagination: true,
//             published: noImage,
//           });
//         })
//         .catch((err) => {
//           res.status(500).json({
//             error: err.message,
//           });
//         });
//       return;
//     }

//     query = query.andWhere((qb) => {
//       const q = `%${req.query.q}%`;
//       qb.where('title', 'like', q).orWhere('content', 'like', q);
//     });
//   }

//   query = query
//     .orderBy('date', 'desc')
//     .leftOuterJoin('users', 'posts.author', 'users.id')
//     .select(
//       'posts.id',
//       'posts.date',
//       'posts.author',
//       'posts.title',
//       'users.username as author_name'
//     )
//     .limit(21); // one more than is needed to see if there are any more pages after this

//   if (afterOffset != null) {
//     query = query.offset(afterOffset);
//   }

//   query
//     .then((data) => {
//       res.json({
//         published: data,
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err.message,
//       });
//     });
// });

// router.post(
//   '/submissions/edit/:id',
//   imageUploader.single('imageURL'),
//   (req, res) => {
//     db.transaction(async (trx) => {
//       // omit some keys so you can't for example change the id or author by mistake
//       let disallowed;
//       if (req.user.group === 'admin') {
//         disallowed = ['id', 'author_name'];
//       } else {
//         disallowed = ['id', 'author_name', 'author', 'type', 'date'];
//       }
//       const { imageURL, imageName, ...data } = _.omit(req.body, disallowed);

//       if (req.file) {
//         await optimizeImage(req.file.path);
//         data.imageURL = req.file.filename;
//       }

//       if (Object.keys(data).length) {
//         const numRows = await trx
//           .from('posts')
//           .andWhere('id', req.params.id)
//           .update(data);

//         if (numRows && req.body.type === 'pending') {
//           await trx.from('votes').where('post', req.params.id).delete();
//         }
//       }

//       return data.imageURL;
//     })
//       .then((imageURL) => {
//         const returnData = {
//           success: 'Edited submission',
//         };
//         if (imageURL) {
//           returnData.imageURL = getFullImageURL(imageURL);
//         }
//         res.json(returnData);
//       })
//       .catch((err) => {
//         res.status(500).json({
//           error: err.message,
//         });
//       });
//   }
// );

// router.get('/pending', (req, res) => {
//   db('posts')
//     .where('type', 'pending')
//     .andWhere('author', req.user.id)
//     .orderBy('date', 'asc')
//     .leftOuterJoin('users', 'posts.author', 'users.id')
//     .select('posts.*', 'users.username as author_name')
//     .then((data) => {
//       const mapped = data.map((post) => {
//         if (post.imageURL) {
//           return {
//             ...post,
//             imageURL: getFullImageURL(post.imageURL),
//           };
//         }
//         return post;
//       });
//       res.json({
//         pending: mapped,
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err.message,
//       });
//     });
// });

// router.post('/pending/submit/:id', (req, res) => {
//   db.transaction(async (trx) => {
//     const { title, fbtext } = await trx
//       .from('posts')
//       .where('type', 'pending')
//       .andWhere('id', req.params.id)
//       .first('title', 'fbtext');

//     const text = fbtext
//       .slice(fbtext.indexOf('\n\n') + 2, fbtext.lastIndexOf('\n\nSlika: '))
//       .replace(/\s?\[https?:\/\/.+?\]/g, '')
//       .replace(/\s\s+/g, ' ')
//       .replace(/(^[\s\u200b]*|[\s\u200b]*$)/g, ''); // \u200b is zero-width space

//     await trx
//       .from('posts')
//       .where('type', 'pending')
//       .andWhere('author', req.user.id)
//       .andWhere('id', req.params.id)
//       .update({
//         type: 'votable',
//       });

//     if (
//       process.env.NODE_ENV === 'production' &&
//       process.env.SLACK_WEBHOOK_NOTIFY_URL
//     ) {
//       await request.post(process.env.SLACK_WEBHOOK_NOTIFY_URL).send({
//         text: 'Yo, <!channel>! Imamo <https://agrument.danesjenovdan.si/dash|nov agrument>!',
//         attachments: [
//           {
//             fallback: 'Your client is stupid, go vote.',
//             color: '#36a64f',
//             fields: [
//               {
//                 title,
//                 value: text,
//                 short: false,
//               },
//             ],
//             actions: [
//               {
//                 type: 'button',
//                 text: 'Glasuj! 🗳️',
//                 url: 'https://agrument.danesjenovdan.si/dash',
//               },
//             ],
//           },
//         ],
//       });
//     }
//   })
//     .then(() => {
//       res.json({
//         success: 'Submitted for vote',
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err.message,
//       });
//     });
// });

// router.get('/votable', (req, res) => {
//   db('posts')
//     .where('type', 'votable')
//     .orderBy('date', 'asc')
//     .leftOuterJoin('users', 'posts.author', 'users.id')
//     .select('posts.*', 'users.username as author_name')
//     .then((data) => {
//       const mapped = data.map((post) => {
//         if (post.imageURL) {
//           return {
//             ...post,
//             imageURL: getFullImageURL(post.imageURL),
//           };
//         }
//         return post;
//       });
//       res.json({
//         votable: mapped,
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err.message,
//       });
//     });
// });

// router.get('/edit/:date', (req, res) => {
//   let query;
//   if (req.user.group === 'admin') {
//     query = db('posts').where('date', req.params.date);
//   } else {
//     query = db('posts')
//       .where('date', req.params.date)
//       .andWhere((builder) =>
//         builder.where('author', req.user.id).orWhere('type', 'votable')
//       );
//   }

//   query
//     .leftOuterJoin('users', 'posts.author', 'users.id')
//     .select('posts.*', 'users.username as author_name')
//     .first()
//     .then((data) => {
//       if (data) {
//         const post = data;
//         if (post.imageURL) {
//           post.imageURL = getFullImageURL(post.imageURL);
//         }
//         res.json({
//           data: post,
//         });
//       } else {
//         res.status(404).json({
//           error: 'Not Found',
//         });
//       }
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err.message,
//       });
//     });
// });

// router.get('/votes/:id', (req, res) => {
//   db('votes')
//     .where('post', req.params.id)
//     .leftOuterJoin('users', 'votes.author', 'users.id')
//     .select('votes.*', 'users.username as author_name')
//     .then((data) => {
//       res.json({
//         votes: data,
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err.message,
//       });
//     });
// });

// router.post('/vote/:id', (req, res) => {
//   db.transaction(async (trx) => {
//     const { vote } = req.body;
//     const { id } = req.params;

//     if (vote === 'veto') {
//       const { lastVetoVote } = await trx
//         .from('users')
//         .where('id', req.user.id)
//         .first('lastVetoVote');

//       if (
//         lastVetoVote &&
//         new Date(lastVetoVote).getUTCMonth() === new Date().getUTCMonth()
//       ) {
//         throw new Error('Veto limit reached!');
//       }
//     }

//     const rows = await trx
//       .from('votes')
//       .where('post', id)
//       .andWhere('author', req.user.id)
//       .select('author', 'post', 'vote');

//     // if user not voted yet just insert the vote
//     if (rows.length === 0) {
//       if (vote === 'veto') {
//         await trx.from('users').where('id', req.user.id).update({
//           lastVetoVote: Date.now(),
//         });
//       }
//       return trx
//         .insert({
//           author: req.user.id,
//           post: id,
//           vote,
//         })
//         .into('votes');
//     }

//     // if vote is not veto allow changing
//     if (rows[0].vote !== 'veto') {
//       // voting the same again removes that vote
//       if (rows[0].vote === vote) {
//         return trx
//           .from('votes')
//           .where('post', id)
//           .andWhere('author', req.user.id)
//           .delete();
//       }
//       // voting differently changes the vote
//       return trx
//         .from('votes')
//         .where('post', id)
//         .andWhere('author', req.user.id)
//         .update({
//           vote,
//         });
//     }
//     return null;
//   })
//     .then(() => {
//       res.json({
//         success: 'Vote updated',
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err.message,
//       });
//     });
// });

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
  done();
}
