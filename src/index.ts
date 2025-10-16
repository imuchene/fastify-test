import fastifyAutoload from '@fastify/autoload';
import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import path from 'path';
import fastifyView from '@fastify/view';
import ejs from 'ejs';
import '@dotenvx/dotenvx/config';
import fastifyStatic from '@fastify/static';
import fastifyFormbody from '@fastify/formbody';
import { routes } from './routes/router';
import { restaurantRoutes } from './routes/restaurant.router';
import { emailRoutes } from './routes/email.router';
import { schedule } from './services/scheduler';
import handlebars from 'handlebars';

const app = fastify();

app.register(fastifyAutoload, {
  dir: path.join(__dirname, 'plugins'),
});

// Schedule the email campaign to run every Monday at 1pm
schedule({ dayOfWeek: 1, hour: 13 });

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

app.register(fastifyView, {
  engine: {
    ejs,
    handlebars,
  },
  root: __dirname,
});

app.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
});

app.register(fastifyFormbody);

app.register(fastifyStatic, {
  root: path.join(process.cwd(), 'node_modules/simpledotcss'),
  prefix: '/simpledotcss/',
  decorateReply: false,
});

// Root route
app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
  return reply.viewAsync('views/restaurant/index.ejs', {
    name: `What's Fare is Fair!`,
  });
});

app.get('/ping', async () => {
  return 'pong \n';
});

// Routes
app.register(restaurantRoutes);
app.register(emailRoutes);

app.register(routes, { prefix: 'api' });
