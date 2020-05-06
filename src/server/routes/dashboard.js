import fs from 'fs-extra';
import express from 'express';
import _ from 'lodash';
import randomstring from 'randomstring';
import request from 'superagent';
import config from '../../../config';
import { requireLoggedIn, requireAdmin } from '../middleware/auth';
import db from '../database';
import {
  saveDataUrlImageToFile,
  getFullImagePath,
  getFullImageURL,
} from '../utils/image';
import { fetchShortUrl } from '../../utils/shortener';
import { toSloDateString } from '../../utils/date';
import { sendErrorToSlack } from '../slack';

const router = express.Router();

// Require that the user is logged in for all requests on this router.
router.use(requireLoggedIn);

router.get('/user', (req, res) => {
  res.json({
    user: _.pick(req.user, ['id', 'username', 'name', 'group']),
  });
});

router.get('/users', requireAdmin, (req, res) => {
  db('users')
    .whereNot('name', '')
    .andWhereNot('password', '')
    .select('id', 'name', 'username', 'group', 'token', 'disabled')
    .then((data) => {
      res.json({
        users: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

router.post('/users/disable/:id', requireAdmin, (req, res) => {
  db('users')
    .andWhere('id', req.params.id)
    .update({
      disabled: req.body.disabled,
      token: null,
    })
    .then(() => {
      res.json({
        success: 'Updated user',
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

router.post('/users/createtoken/:id', requireAdmin, (req, res) => {
  db('users')
    .where('token', null)
    .andWhere('id', req.params.id)
    .update({
      token: randomstring.generate(8),
    })
    .then(() => {
      res.json({
        success: 'Created token',
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

router.get('/users/tokens', requireAdmin, (req, res) => {
  db('users')
    .where('name', '')
    .andWhere('password', '')
    .andWhereNot('token', null)
    .select('id', 'token')
    .then((data) => {
      res.json({
        users: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

router.post('/users/create', requireAdmin, (req, res) => {
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
        return trx
          .first('id', 'token')
          .from('users')
          .where('id', id);
      });
  })
    .then((data) => {
      res.json({
        user: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

router.get('/published', (req, res) => {
  let afterDate = null;
  let afterOffset = null;
  if (req.query.after && req.query.after.indexOf('+') !== -1) {
    const parts = req.query.after.split('+');
    afterDate = parts[0];
    afterOffset = Number(parts[1]) || 0;
  }

  let query = db('posts')
    .where('type', 'published');

  if (afterDate) {
    query = query
      .andWhere('date', '<=', afterDate);
  }

  if (req.query.q) {
    if (req.query.q === 'X:no-image') {
      query = query
        .orderBy('date', 'desc')
        .leftOuterJoin('users', 'posts.author', 'users.id')
        .select('posts.imageURL', 'posts.id', 'posts.date', 'posts.author', 'posts.title', 'users.username as author_name')
        .then((data) => {
          const noImage = data.filter((e) => {
            const img = getFullImagePath(e.imageURL);
            return !fs.existsSync(img);
          });
          res.json({
            ignorePagination: true,
            published: noImage,
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err.message,
          });
        });
      return;
    }

    query = query
      .andWhere((qb) => {
        const q = `%${req.query.q}%`;
        qb.where('title', 'like', q).orWhere('content', 'like', q);
      });
  }

  query = query
    .orderBy('date', 'desc')
    .leftOuterJoin('users', 'posts.author', 'users.id')
    .select('posts.id', 'posts.date', 'posts.author', 'posts.title', 'users.username as author_name')
    .limit(21); // one more than is needed to see if there are any more pages after this

  if (afterOffset != null) {
    query = query
      .offset(afterOffset);
  }

  query
    .then((data) => {
      res.json({
        published: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

router.get('/submissions', requireAdmin, (req, res) => {
  db('posts')
    .whereIn('type', ['votable', 'pending'])
    .orderBy('date', 'asc')
    .leftOuterJoin('users', 'posts.author', 'users.id')
    .select('posts.id', 'posts.date', 'posts.author', 'posts.title', 'posts.type', 'users.username as author_name')
    .then((data) => {
      res.json({
        submissions: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

router.post('/submissions/addbulk', requireAdmin, (req, res) => {
  db.transaction((trx) => {
    const all = req.body.map((entry) => {
      const obj = {
        title: entry.title,
        description: entry.description,
        content: entry.content,
        date: entry.date,
        rights: entry.rights,
        type: entry.type,
        hasEmbed: entry.hasEmbed,
        author: entry.author,
        imageURL: entry.imageURL,
        imageCaption: entry.imageCaption,
        imageCaptionURL: entry.imageCaptionURL,
      };

      const { date } = obj;
      return trx
        .select('id')
        .from('posts')
        .where('date', date)
        .then((rows) => {
          if (rows && rows.length !== 0) {
            throw new Error('Submission with this date already exists');
          }
          return trx
            .insert(obj)
            .into('posts');
        });
    });

    return Promise.all(all);
  })
    .then(() => {
      res.json({
        success: 'Bulk added submissions',
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

router.post('/submissions/add', requireAdmin, (req, res) => {
  db.transaction((trx) => {
    const { date } = req.body;
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
            date: req.body.date,
            author: req.body.author,
            title: '',
            content: '',
            description: '',
            imageURL: '',
            imageCaption: '',
            imageCaptionURL: '',
            hasEmbed: 0,
            rights: '',
            type: 'pending',
          })
          .into('posts');
      });
  })
    .then(() => {
      res.json({
        success: 'Added submission',
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

router.delete('/submissions/remove/:id', requireAdmin, (req, res) => {
  db.transaction(async (trx) => {
    await trx
      .from('posts')
      .whereIn('type', ['votable', 'pending'])
      .andWhere('id', req.params.id)
      .delete();

    await trx
      .from('votes')
      .where('post', req.params.id)
      .delete();
  })
    .then(() => {
      res.json({
        success: 'Removed submission',
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

router.post('/submissions/edit/:id', (req, res) => {
  db.transaction(async (trx) => {
    // omit some keys so you can't for example change the id or author by mistake
    let disallowed;
    if (req.user.group === 'admin') {
      disallowed = ['id', 'author_name'];
    } else {
      disallowed = ['id', 'author_name', 'author', 'type', 'date'];
    }
    const { imageURL, imageName, ...data } = _.omit(req.body, disallowed);

    const hasNewImage = imageURL && imageURL.startsWith('data:') && imageName;

    if (hasNewImage) {
      const newImageName = await saveDataUrlImageToFile(imageURL, imageName);
      data.imageURL = newImageName;
    }

    const numRows = await trx
      .from('posts')
      .andWhere('id', req.params.id)
      .update(data);

    if (numRows && req.body.type === 'pending') {
      await trx
        .from('votes')
        .where('post', req.params.id)
        .delete();
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
      res.json(returnData);
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

router.get('/pending', (req, res) => {
  db('posts')
    .where('type', 'pending')
    .andWhere('author', req.user.id)
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
      res.json({
        pending: mapped,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

router.post('/pending/submit/:id', (req, res) => {
  db.transaction(async (trx) => {
    const { title, fbtext } = await trx
      .from('posts')
      .where('type', 'pending')
      .andWhere('id', req.params.id)
      .first('title', 'fbtext');

    const text = fbtext
      .slice(fbtext.indexOf('\n\n') + 2, fbtext.lastIndexOf('\n\nSlika: '))
      .replace(/\s?\[https?:\/\/.+?\]/g, '')
      .replace(/\s\s+/g, ' ')
      .replace(/(^[\s\u200b]*|[\s\u200b]*$)/g, ''); // \u200b is zero-width space

    await trx
      .from('posts')
      .where('type', 'pending')
      .andWhere('author', req.user.id)
      .andWhere('id', req.params.id)
      .update({
        type: 'votable',
      });

    if (process.env.NODE_ENV === 'production' && config.SLACK_WEBHOOK_NOTIFY_URL) {
      await request
        .post(config.SLACK_WEBHOOK_NOTIFY_URL)
        .send({
          text: 'Yo, <!channel>! Imamo <https://agrument.danesjenovdan.si/dash|nov agrument>!',
          attachments: [
            {
              fallback: 'Your client is stupid, go vote.',
              color: '#36a64f',
              fields: [
                {
                  title,
                  value: text,
                  short: false,
                },
              ],
              actions: [
                {
                  type: 'button',
                  text: 'Glasuj! 🗳️',
                  url: 'https://agrument.danesjenovdan.si/dash',
                },
              ],
            },
          ],
        });
    }
  })
    .then(() => {
      res.json({
        success: 'Submitted for vote',
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

router.get('/votable', (req, res) => {
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
      res.json({
        votable: mapped,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

router.post('/votable/publish/:id', requireAdmin, (req, res) => {
  db.transaction(async (trx) => {
    const { tweet, date } = await trx
      .from('posts')
      .where('type', 'votable')
      .andWhere('id', req.params.id)
      .first('tweet', 'date');

    await trx
      .from('posts')
      .where('type', 'votable')
      .andWhere('id', req.params.id)
      .update({
        type: 'published',
      });

    if (process.env.NODE_ENV === 'production') {
      try {
        const url = await fetchShortUrl(`https://agrument.danesjenovdan.si/${toSloDateString(date)}`);
        const text = `${tweet}\n${url}`;
        const tweetRes = await request
          .post('https://api.djnd.si/sendTweet/')
          .field('tweet_text', text)
          .field('secret', config.TWITTER_SECRET);
        // eslint-disable-next-line no-console
        console.log('Twitter post response:', tweetRes);
      } catch (error) {
        sendErrorToSlack('twitterPost', error, (error2) => {
          if (error2) {
            // eslint-disable-next-line no-console
            console.error(error2);
          }
        });
      }
      try {
        const sendMailRes = await request
          .post('http://podpri.djnd.si/api/send-agrument-mail/')
          .set('Authorization', config.MAUTIC_SECRET);
        // eslint-disable-next-line no-console
        console.log('Mautic send mail response:', sendMailRes);
      } catch (error) {
        sendErrorToSlack('sendMauticMail', error, (error2) => {
          if (error2) {
            // eslint-disable-next-line no-console
            console.error(error2);
          }
        });
      }
    }
  })
    .then(() => {
      res.json({
        success: 'Published',
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

router.get('/edit/:date', (req, res) => {
  let query;
  if (req.user.group === 'admin') {
    query = db('posts')
      .where('date', req.params.date);
  } else {
    query = db('posts')
      .where('date', req.params.date)
      .andWhere((builder) => (
        builder
          .where('author', req.user.id)
          .orWhere('type', 'votable')
      ));
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
        res.json({
          data: post,
        });
      } else {
        res.status(404).json({
          error: 'Not Found',
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

router.get('/votes/:id', (req, res) => {
  db('votes')
    .where('post', req.params.id)
    .leftOuterJoin('users', 'votes.author', 'users.id')
    .select('votes.*', 'users.username as author_name')
    .then((data) => {
      res.json({
        votes: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

router.post('/vote/:id', (req, res) => {
  db.transaction(async (trx) => {
    const { vote } = req.body;
    const { id } = req.params;

    if (vote === 'veto') {
      const { lastVetoVote } = await trx
        .from('users')
        .where('id', req.user.id)
        .first('lastVetoVote');

      if (lastVetoVote && (new Date(lastVetoVote).getUTCMonth()) === (new Date().getUTCMonth())) {
        throw new Error('Veto limit reached!');
      }
    }

    const rows = await trx
      .from('votes')
      .where('post', id)
      .andWhere('author', req.user.id)
      .select('author', 'post', 'vote');

    // if user not voted yet just insert the vote
    if (rows.length === 0) {
      if (vote === 'veto') {
        await trx
          .from('users')
          .where('id', req.user.id)
          .update({
            lastVetoVote: Date.now(),
          });
      }
      return trx
        .insert({
          author: req.user.id,
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
          .andWhere('author', req.user.id)
          .delete();
      }
      // voting differently changes the vote
      return trx
        .from('votes')
        .where('post', id)
        .andWhere('author', req.user.id)
        .update({
          vote,
        });
    }
    return null;
  })
    .then(() => {
      res.json({
        success: 'Vote updated',
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

export default router;
