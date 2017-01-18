import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import Helmet from 'react-helmet';
import routes from './routes';

const markup = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8');

module.exports = (req, res) => {
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      const reactString = renderToString(<RouterContext {...renderProps} />);
      const helmetData = Helmet.rewind();
      const htmlAttrString = helmetData.htmlAttributes.toString();
      const headString = helmetData.title.toString() + helmetData.meta.toString() + helmetData.link.toString();
      const html = markup
        .replace('<html>', `<html ${htmlAttrString}>`)
        .replace('<!-- helmet -->', headString)
        .replace('<!-- markup -->', reactString);
      res.status(200).send(html);
    } else {
      res.status(404).send('Not found');
    }
  });
};
