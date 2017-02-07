import _ from 'lodash';
import db from './database';

function getUserData(req, res) {
  res.json(req.user);
}

function getPendingSubmissions(req, res) {
  db('submissions')
    .where('author', req.user.id)
    .orderBy('deadline', 'asc')
    .select()
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
}

function editPendingSubmission(req, res) {
  // clone req.body and replace some props with undefined so they are ignored by db.update and we
  // can't f.e. change the id or author by mistake
  const data = _.assign({}, req.body, {
    id: undefined,
    author: undefined,
    deadline: undefined,
  });

  db('submissions')
    .where('id', req.params.id)
    .update(data)
    .then(() => {
      res.json({
        success: 'Edited submission!',
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
}

function getVotableSubmissions(req, res) {
  db('submissions') // TODO: from votable table
    // .where('author', req.user.id)
    .orderBy('deadline', 'asc')
    .select()
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
}

function getPinnedMessages(req, res) {
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
}

function addPinnedMessage(req, res) {
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
}

function removePinnedMessage(req, res) {
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
}

export {
  getUserData,
  getPendingSubmissions,
  editPendingSubmission,
  getVotableSubmissions,
  getPinnedMessages,
  addPinnedMessage,
  removePinnedMessage,
};
