// router.get('/users', requireAdmin, (req, res) => {
//   db('users')
//     .whereNot('name', '')
//     .andWhereNot('password', '')
//     .select('id', 'name', 'username', 'group', 'token', 'disabled')
//     .then((data) => {
//       res.json({
//         users: data,
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err.message,
//       });
//     });
// });

// router.post('/users/disable/:id', requireAdmin, (req, res) => {
//   db('users')
//     .andWhere('id', req.params.id)
//     .update({
//       disabled: req.body.disabled,
//       token: null,
//     })
//     .then(() => {
//       res.json({
//         success: 'Updated user',
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err.message,
//       });
//     });
// });

// router.post('/users/createtoken/:id', requireAdmin, (req, res) => {
//   db('users')
//     .where('token', null)
//     .andWhere('id', req.params.id)
//     .update({
//       token: randomstring.generate(8),
//     })
//     .then(() => {
//       res.json({
//         success: 'Created token',
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err.message,
//       });
//     });
// });

// router.get('/users/tokens', requireAdmin, (req, res) => {
//   db('users')
//     .where('name', '')
//     .andWhere('password', '')
//     .andWhereNot('token', null)
//     .select('id', 'token')
//     .then((data) => {
//       res.json({
//         users: data,
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err.message,
//       });
//     });
// });

// router.post('/users/create', requireAdmin, (req, res) => {
//   db.transaction((trx) => {
//     const tempUsername = Date.now().toString(); // db needs a unique username
//     const uniqueToken = randomstring.generate(8);
//     return trx
//       .insert({
//         username: tempUsername,
//         name: '',
//         password: '',
//         token: uniqueToken,
//       })
//       .into('users')
//       .then((ids) => {
//         const id = ids[0];
//         return trx.first('id', 'token').from('users').where('id', id);
//       });
//   })
//     .then((data) => {
//       res.json({
//         user: data,
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err.message,
//       });
//     });
// });

// router.get('/submissions', requireAdmin, (req, res) => {
//   db('posts')
//     .whereIn('type', ['votable', 'pending'])
//     .orderBy('date', 'asc')
//     .leftOuterJoin('users', 'posts.author', 'users.id')
//     .select(
//       'posts.id',
//       'posts.date',
//       'posts.author',
//       'posts.title',
//       'posts.type',
//       'users.username as author_name'
//     )
//     .then((data) => {
//       res.json({
//         submissions: data,
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err.message,
//       });
//     });
// });

// router.post('/submissions/addbulk', requireAdmin, (req, res) => {
//   db.transaction((trx) => {
//     const all = req.body.map((entry) => {
//       const obj = {
//         title: entry.title,
//         description: entry.description,
//         content: entry.content,
//         date: entry.date,
//         rights: entry.rights,
//         type: entry.type,
//         hasEmbed: entry.hasEmbed,
//         author: entry.author,
//         imageURL: entry.imageURL,
//         imageCaption: entry.imageCaption,
//         imageCaptionURL: entry.imageCaptionURL,
//         imageAltText: entry.imageAltText,
//       };

//       const { date } = obj;
//       return trx
//         .select('id')
//         .from('posts')
//         .where('date', date)
//         .then((rows) => {
//           if (rows && rows.length !== 0) {
//             throw new Error('Submission with this date already exists');
//           }
//           return trx.insert(obj).into('posts');
//         });
//     });

//     return Promise.all(all);
//   })
//     .then(() => {
//       res.json({
//         success: 'Bulk added submissions',
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err.message,
//       });
//     });
// });

// router.post('/submissions/add', requireAdmin, (req, res) => {
//   db.transaction((trx) => {
//     const { date } = req.body;
//     return trx
//       .select('id')
//       .from('posts')
//       .where('date', date)
//       .then((rows) => {
//         if (rows && rows.length !== 0) {
//           throw new Error('Submission with this date already exists');
//         }
//         return trx
//           .insert({
//             date: req.body.date,
//             author: req.body.author,
//             title: '',
//             content: '',
//             description: '',
//             imageURL: '',
//             imageCaption: '',
//             imageCaptionURL: '',
//             imageAltText: '',
//             hasEmbed: 0,
//             rights: '',
//             type: 'pending',
//           })
//           .into('posts');
//       });
//   })
//     .then(() => {
//       res.json({
//         success: 'Added submission',
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err.message,
//       });
//     });
// });

// router.delete('/submissions/remove/:id', requireAdmin, (req, res) => {
//   db.transaction(async (trx) => {
//     await trx
//       .from('posts')
//       .whereIn('type', ['votable', 'pending'])
//       .andWhere('id', req.params.id)
//       .delete();

//     await trx.from('votes').where('post', req.params.id).delete();
//   })
//     .then(() => {
//       res.json({
//         success: 'Removed submission',
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err.message,
//       });
//     });
// });

// router.post('/votable/publish/:id', requireAdmin, (req, res) => {
//   db.transaction(async (trx) => {
//     const post = await trx
//       .from('posts')
//       .where('type', 'votable')
//       .andWhere('id', req.params.id)
//       .first();

//     await trx
//       .from('posts')
//       .where('type', 'votable')
//       .andWhere('id', req.params.id)
//       .update({
//         type: 'published',
//       });

//     const url = `https://agrument.danesjenovdan.si/${toSloDateString(
//       post.date
//     )}`;

//     if (process.env.NODE_ENV === 'production') {
//       try {
//         const shortUrl = await fetchShortUrl(url);
//         const text = `${post.tweet}\n${shortUrl}`;
//         const response = await request
//           .post('https://api.djnd.si/sendTweet/')
//           .field('tweet_text', text)
//           .field('secret', process.env.TWITTER_SECRET);
//         // eslint-disable-next-line no-console
//         console.log('Twitter post response:', response.status, response.text);
//       } catch (error) {
//         sendErrorToSlack('twitterPost', error);
//       }
//       try {
//         const response = await request
//           .post('https://podpri.djnd.si/api/send-agrument-mail/')
//           .send({
//             url,
//             title: post.title,
//             content_html: post.content,
//             image_url: `https://agrument.danesjenovdan.si${getFullImageURL(
//               post.imageURL
//             )}`,
//             image_source: post.imageCaption,
//             image_source_url: post.imageCaptionURL,
//             image_alt_text: post.imageAltText,
//             email_template_id: post.emailTemplate === 'project' ? 232 : 42,
//           })
//           .set('Authorization', process.env.MAUTIC_SECRET);
//         // eslint-disable-next-line no-console
//         console.log(
//           'Mautic send mail response:',
//           response.status,
//           response.text
//         );
//       } catch (error) {
//         sendErrorToSlack('sendMauticMail', error);
//       }
//     }
//   })
//     .then(() => {
//       res.json({
//         success: 'Published',
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err.message,
//       });
//     });
// });

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

  // fastify.get('/user', getUserHandler);
  done();
}
