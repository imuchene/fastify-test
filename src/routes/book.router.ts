import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Book } from '../models/book.model';
import { HttpError } from '@fastify/sensible';

export async function bookRoutes(fastify: FastifyInstance) {
  // Create one book
  fastify.post(
    '/',
    async (request: FastifyRequest<{ Body: Book }>, reply: FastifyReply) => {
      const { title, author } = request.body;
      try {
        const book = { title, author };
        reply.send(book);
      } catch (error: unknown) {
        if (error instanceof HttpError) {
          console.error('Error occurred', error.message);
          reply.send(error);
        }
      }
    },
  );

  // Get all books
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({ message: 'ok' });
  });

  // Get one book
  fastify.get(
    '/:id',
    async (request: FastifyRequest<{ Params: Book }>, reply: FastifyReply) => {
      const { id } = request.params;
      try {
        const book = { id };
        reply.send(book);
      } catch (error: unknown) {
        if (error instanceof HttpError) {
          console.error('Error occurred', error.message);
          reply.send(error);
        }
      }
    },
  );

  // Update one book
  fastify.put(
    '/:id',
    async (request: FastifyRequest<{ Params: Book }>, reply: FastifyReply) => {
      const { id } = request.params;
      try {
        const book = { id };
        reply.send(book);
      } catch (error: unknown) {
        if (error instanceof HttpError) {
          console.error('Error occurred', error.message);
          reply.send(error);
        }
      }
    },
  );

  // delete one book
  fastify.delete(
    '/:id',
    async (request: FastifyRequest<{ Params: Book }>, reply: FastifyReply) => {
      const { id } = request.params;
      try {
        const book = { id };
        reply.send(book);
      } catch (error: unknown) {
        if (error instanceof HttpError) {
          console.error('Error occurred', error.message);
          reply.send(error);
        }
      }
    },
  );

  // Custom error handler
  fastify.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => {
    reply.code(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: `Resource ${request.url} was not found`,
    });
  });
}
