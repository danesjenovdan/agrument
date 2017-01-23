import db from './database';

function getPendingSubmissions(req, res) {
  db('submissions')
    // TODO: .where('author', 0)
    .orderBy('deadline', 'asc')
    .select().then((data) => {
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

function getVotableSubmissions(req, res) {
  getPendingSubmissions(req, res); // TODO: impl votable api
}

function getPinnedMessages(req, res) {
  db('pinned')
    .orderBy('timestamp', 'desc')
    .select()
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
  // TODO: check incoming data (for message and also get author from auth token)
  db('pinned')
    .insert({
      author: 0,
      timestamp: Date.now(),
      message: 'testeroni',
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
}

function removePinnedMessage(req, res) {
  // TODO: check incoming data (also check same author before delete)
  db('pinned')
    .where('id', req.params.id)
    .del()
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
  getPendingSubmissions,
  getVotableSubmissions,
  getPinnedMessages,
  addPinnedMessage,
  removePinnedMessage,
};
