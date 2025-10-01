import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { HttpError } from '@fastify/sensible';
import { Book } from '../models/book.model';

export async function bookRoutes(fastify: FastifyInstance) {
  // Create one book
  fastify.post(
    '/',
    async (request: FastifyRequest<{ Body: Book }>, reply: FastifyReply) => {
      const { title, author } = request.body;
      try {
        let book: Book | null;
        book = await Book.findOne({ where: { title } });

        if (book) {
          book.count += 1;
          book.save();
        } else {
          book = await Book.create({ title, author, count: 1 });
        }

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
    const books = await Book.findAll();
    return reply.send(books);
  });

  // Get one book
  fastify.get(
    '/:id',
    async (request: FastifyRequest<{ Params: Book }>, reply: FastifyReply) => {
      const { id } = request.params;

      try {
        const book = await Book.findByPk(id);
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
    async (
      request: FastifyRequest<{ Params: Book; Body: Book }>,
      reply: FastifyReply,
    ) => {
      const { id } = request.params;
      const { title, author } = request.body;
      try {
        const book = await Book.update({ title, author }, { where: { id } });
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
        const book = await Book.destroy({ where: { id } });
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
