import 'make-promises-safe';
import './load-env.js';
import { resolve } from 'path';
import { fastify as createFastify } from 'fastify';
import fastifyStatic from 'fastify-static';
import fastifyCors from 'fastify-cors';
import { registerPublicApi } from './routes/index.js';

const fastify = createFastify({ logger: true, ignoreTrailingSlash: true });

fastify.register(fastifyCors, {
  origin: '*',
});

fastify.register(fastifyStatic, {
  root: resolve('./dist'),
  prefix: '/',
});

registerPublicApi(fastify);

fastify.listen(process.env.PORT || 3000, '0.0.0.0', (error) => {
  if (error) {
    fastify.log.error(error);
    process.exit(1);
  }
});
