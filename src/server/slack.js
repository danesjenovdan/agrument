import Slack from 'slack-node';
import expressErrorSlack from 'express-error-slack';
import config from '../../config';

const webhook = config.SLACK_WEBHOOK_URL;
const sendErrorToSlackMiddleware = webhook
  ? expressErrorSlack({ webhookUri: webhook })
  : (req, res, next) => { next(); };

function stringify(obj) {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return String(obj);
  }
}

function sendErrorToSlack(type, err, cb) {
  if (!webhook) {
    if (cb) {
      cb(null, null);
    }
    return;
  }

  const slack = new Slack();
  slack.setWebhook(webhook);

  const reason = (err.name && err.message) ? `${err.name}: ${err.message}` : stringify(err);
  const stack = err.stack ? `_Stack_ \`\`\`${err.stack}\`\`\`` : stringify(err);

  const attachment = {
    fallback: reason,
    color: 'danger',
    author_name: type,
    title: reason,
    text: stack,
    mrkdwn_in: ['text'],
    footer: 'agrument error report',
    ts: Math.floor(Date.now() / 1000),
  };

  slack.webhook(
    { attachments: [attachment] },
    // eslint-disable-next-line no-console, no-unused-vars
    (error, response) => {
      if (cb) {
        cb(error, response);
      }
    },
  );
}

export {
  sendErrorToSlackMiddleware,
  sendErrorToSlack,
};
