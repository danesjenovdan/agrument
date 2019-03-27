import React from 'react';
import fs from 'fs-extra';
import path from 'path';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import Helmet from 'react-helmet';
import App from '../../containers/App';
import { getPost } from '../routes/agrument';

const filePath = path.resolve(__dirname, '../../../dist/template.html');
const markup = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
if (!markup) {
  throw new Error('template.html not found; client is probably not built');
}

function isValidRoute(req) {
  // TODO: use react-router-config
  if (req.url === '/') {
    return true;
  }
  if (/^\/\d{1,2}\.\d{1,2}\.\d{4}\/?$/.test(req.url)) {
    return true;
  }
  if (/^\/dash(?:\/|$)/.test(req.url)) {
    return true;
  }
  return false;
}

async function loadData(query) {
  const post = await getPost(query);
  return {
    post,
  };
}

function render(req, res, next) {
  if (!isValidRoute(req)) {
    next();
    return;
  }

  let promise = Promise.resolve(null);
  if (req.url === '/' || /^\/\d{1,2}\.\d{1,2}\.\d{4}\/?$/.test(req.url)) {
    promise = loadData({ date: req.url.replace(/^\/+|\/+$/g, '') });
  }
  promise
    .then((data) => {
      if (data && !data.post) {
        res.redirect('/');
        return;
      }

      const context = { data };
      const reactString = renderToString((
        <StaticRouter location={req.url} context={context}>
          <App />
        </StaticRouter>
      ));
      const helmet = Helmet.renderStatic();

      if (context.url) {
        res.redirect(context.url);
        return;
      }

      const htmlAttrString = helmet.htmlAttributes.toString();
      const bodyAttrString = helmet.bodyAttributes.toString();
      const headString = `${helmet.title} ${helmet.meta} ${helmet.link}`;
      const html = markup
        .replace('<html>', `<html ${htmlAttrString}>`)
        .replace('<body>', `<body ${bodyAttrString}>`)
        .replace('<!-- helmet -->', headString)
        .replace('<!-- markup -->', reactString);
      res.send(html);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      next(error);
    });
}

export default render;
