import Slack from 'slack-node';
import expressErrorSlack from 'express-error-slack';

const webhook = 'https://hooks.slack.com/services/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';
const sendErrorToSlackMiddleware = expressErrorSlack({ webhookUri: webhook });

function stringify(obj) {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return String(obj);
  }
}

function sendErrorToSlack(type, err, cb) {
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
