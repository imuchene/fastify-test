import { FastifyInstance } from 'fastify';
import { bookRoutes } from './book.router';

export async function routes(app: FastifyInstance) {
  app.register(bookRoutes, { prefix: '/books' });
}
