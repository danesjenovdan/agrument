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
    query = query
      .andWhere('title', 'like', `%${req.query.q}%`);
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
      author_name: undefined,
    };
  } else {
    disallowed = {
      id: undefined,
      author_name: undefined,
      author: undefined,
      type: undefined,
      date: undefined,
    };
  }
  const data = _.assign({}, req.body, disallowed);

  db('posts')
    .andWhere('id', req.params.id)
    .update(data)
    .then((numRows) => {
      if (numRows) {
        res.json({
          success: 'Edited submission',
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

router.get('/pending', (req, res) => {
  db('posts')
    .where('type', 'pending')
    .andWhere('author', req.user.id)
    .orderBy('date', 'asc')
    .leftOuterJoin('users', 'posts.author', 'users.id')
    .select('posts.*', 'users.username as author_name')
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
    .orderBy('date', 'asc')
    .leftOuterJoin('users', 'posts.author', 'users.id')
    .select('posts.*', 'users.username as author_name')
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

router.get('/edit/:date', (req, res) => {
  let query;
  if (req.user.group === 'admin') {
    query = db('posts')
      .where('date', req.params.date);
  } else {
    query = db('posts')
      .where('date', req.params.date)
      .andWhere(builder => (
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
  db.transaction((trx) => {
    const { vote } = req.body;
    const { id } = req.params;
    return trx
      .from('votes')
      .where('post', id)
      .andWhere('author', req.user.id)
      .select('author', 'post', 'vote')
      .then((rows) => {
        if (rows.length === 0) {
          return trx
            .insert({
              author: req.user.id,
              post: id,
              vote,
            })
            .into('votes');
        }
        if (rows[0].vote !== 'veto') {
          if (rows[0].vote === vote) {
            return trx
              .from('votes')
              .where('post', id)
              .andWhere('author', req.user.id)
              .delete();
          }
          return trx
            .from('votes')
            .where('post', id)
            .andWhere('author', req.user.id)
            .update({
              vote,
            });
        }
        return null;
      });
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
