import express from 'express';
import _ from 'lodash';
import randomstring from 'randomstring';
import { requireLoggedIn, requireAdmin } from '../middleware/auth';
import db from '../database';

const router = express.Router();

// Require that the user is logged in for all requests on this router.
router.use(requireLoggedIn);

router.get('/user', (req, res) => {
  res.json({
    user: req.user,
  });
});

router.get('/users', requireAdmin, (req, res) => {
  db('users')
    .where('token', null)
    .select('id', 'name', 'username', 'group')
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

router.get('/users/tokens', requireAdmin, (req, res) => {
  db('users')
    .whereNot('token', null)
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

router.get('/published', requireAdmin, (req, res) => {
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
    query = query
      .andWhere('title', 'like', `%${req.query.q}%`);
  }

  query = query
    .orderBy('date', 'desc')
    .leftOuterJoin('users', 'posts.author', 'users.id')
    .select('posts.id', 'posts.date', 'posts.author', 'posts.title', 'posts.deadline', 'posts.type', 'users.name as author_name')
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
    .orderBy('deadline', 'asc')
    .leftOuterJoin('users', 'posts.author', 'users.id')
    .select('posts.id', 'posts.date', 'posts.author', 'posts.title', 'posts.deadline', 'posts.type', 'users.name as author_name')
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
        deadline: entry.date,
        rights: entry.rights,
        type: entry.type,
        hasEmbed: entry.hasEmbed,
        author: entry.author,
        imageURL: entry.imageURL,
        imageCaption: entry.imageCaption,
        imageCaptionURL: entry.imageCaptionURL,
      };

      const { date, deadline } = obj;
      return trx
        .select('id')
        .from('posts')
        .where('date', date)
        .orWhere('deadline', deadline)
        .then((rows) => {
          if (rows && rows.length !== 0) {
            throw new Error('Invalid date or deadline');
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
    const { date, deadline } = req.body;
    return trx
      .select('id')
      .from('posts')
      .where('date', date)
      .orWhere('deadline', deadline)
      .then((rows) => {
        if (rows && rows.length !== 0) {
          throw new Error('Invalid date or deadline');
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
            deadline: req.body.deadline,
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
  db('posts')
    .whereIn('type', ['votable', 'pending'])
    .andWhere('id', req.params.id)
    .del()
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
  // clone req.body and replace some props with undefined so they are ignored by db.update and we
  // can't for example change the id or author by mistake
  let disallowed;
  if (req.user.group === 'admin') {
    disallowed = {
      id: undefined,
      author: undefined,
      author_name: undefined,
      type: undefined,
    };
  } else {
    disallowed = {
      id: undefined,
      author: undefined,
      author_name: undefined,
      type: undefined,
      deadline: undefined,
      date: undefined,
    };
  }
  const data = _.assign({}, req.body, disallowed);

  db('posts')
    .whereIn('type', ['votable', 'pending'])
    .andWhere('id', req.params.id)
    .update(data)
    .then(() => {
      res.json({
        success: 'Edited submission',
      });
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
    .orderBy('deadline', 'asc')
    .leftOuterJoin('users', 'posts.author', 'users.id')
    .select('posts.*', 'users.name as author_name')
    .then((data) => {
      res.json({
        pending: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

router.post('/pending/submit/:id', (req, res) => {
  db('posts')
    .where('type', 'pending')
    .andWhere('author', req.user.id)
    .andWhere('id', req.params.id)
    .update({
      type: 'votable',
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
    .orderBy('deadline', 'asc')
    .leftOuterJoin('users', 'posts.author', 'users.id')
    .select('posts.*', 'users.name as author_name')
    .then((data) => {
      res.json({
        votable: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

router.post('/votable/publish/:id', requireAdmin, (req, res) => {
  db('posts')
    .where('type', 'votable')
    .andWhere('id', req.params.id)
    .update({
      type: 'published',
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

router.get('/pinned', (req, res) => {
  db('pinned')
    .orderBy('timestamp', 'desc')
    .leftOuterJoin('users', 'pinned.author', 'users.id')
    .select('pinned.*', 'users.name as author_name')
    .then((data) => {
      res.json({
        pinned: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

router.post('/pinned/add', (req, res) => {
  if (req.body && req.body.message) {
    db('pinned')
      .insert({
        author: req.user.id,
        timestamp: Date.now(),
        message: req.body.message,
      })
      .then(() => {
        res.json({
          success: 'Added pinned message',
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err.message,
        });
      });
  } else {
    res.status(400).json({
      error: 'Bad Request',
    });
  }
});

router.delete('/pinned/remove/:id', (req, res) => {
  let query;
  if (req.user.group === 'admin') {
    query = db('pinned')
      .where('id', req.params.id)
      .del();
  } else {
    query = db('pinned')
      .where('id', req.params.id)
      .andWhere('author', req.user.id)
      .del();
  }

  query
    .then(() => {
      res.json({
        success: 'Removed pinned message',
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
      .andWhere('author', req.user.id);
  }

  query
    .leftOuterJoin('users', 'posts.author', 'users.id')
    .select('posts.*', 'users.name as author_name')
    .first()
    .then((data) => {
      if (data) {
        res.json({
          data,
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

router.get('/votes', (req, res) => {
  db('votes')
    .select('id', 'author', 'post', 'vote')
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

router.post('/vote/:option', (req, res) => {
  if (req.body) {
    db('votes')
      .select('id', 'author', 'post', 'vote')
      .where('post', req.body.data.post)
      .andWhere('author', req.user.id)
      .then((data) => {
        if (data.length === 0) {
          // NO VOTE, pls insert
          db('votes')
            .insert({
              author: req.user.id,
              post: req.body.data.post,
              vote: req.params.option,
            })
            .then(() => {
              res.json({
                success: `Successfully voted ${req.params.option}`,
              });
            })
            .catch((err) => {
              res.status(500).json({
                error: err.message,
              });
            });
        } else {
          // user already voted, pls update
          db('votes')
            .where('post', req.body.data.post)
            .andWhere('author', req.user.id)
            .update({
              vote: req.params.option,
            })
            .then(() => {
              res.json({
                success: `Successfully updated vote with ${req.params.option}`,
              });
            })
            .catch((err) => {
              res.status(500).json({
                error: err.message,
              });
            });
        }
      });
  } else {
    res.status(400).json({
      error: 'Bad Request',
    });
  }
});

export default router;
