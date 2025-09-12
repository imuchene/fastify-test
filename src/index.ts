import fastifyAutoload from '@fastify/autoload';
import fastify from 'fastify';
import path from 'path';
import { routes } from './routes/our-first-route';

const app = fastify();

app.register(fastifyAutoload, {
  dir: path.join(__dirname, 'plugins'),
});

app.listen({ port: 8080}, (error, address) => {
  if (error) {
    console.error(error);
    process.exit(1)
  }

  console.log(`Server listening at ${address}`)
})

app.register(fastifyAutoload, {
  dir: path.join(__dirname, 'routes'),
})


app.register(routes)


app.get('/ping', async () => {
  return 'pong \n';
});
