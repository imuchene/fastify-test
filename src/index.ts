import fastifyAutoload from '@fastify/autoload';
import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import path from 'path';
import { routes } from './routes/our-first-route';
import fastifyView from '@fastify/view';
import ejs from 'ejs';
import '@dotenvx/dotenvx/config';
import fastifyStatic from '@fastify/static';

const app = fastify();

app.register(fastifyAutoload, {
  dir: path.join(__dirname, 'plugins'),
});

app.listen(
  { port: Number(process.env.PORT) },
  (error: Error | null, address: string) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }

    console.log(`Server listening at ${address}`);
  },
);

app.register(fastifyAutoload, {
  dir: path.join(__dirname, 'routes'),
});

app.register(routes);

app.register(fastifyView, {
  engine: {
    ejs: ejs,
  },
  root: __dirname,
});

app.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
});

app.register(fastifyStatic, {
  root: path.join(process.cwd(), 'node_modules/simpledotcss'),
  prefix: '/simpledotcss/',
  decorateReply: false,
});

app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
  return reply.viewAsync('views/index.ejs', { name: `What's Fare is Fair!` });
});

app.get('/ping', async () => {
  return 'pong \n';
});
