import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export async function libraryRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/libraries',
    async (request: FastifyRequest, reply: FastifyReply) => {
      return reply.send({ message: 'ok' });
    },
  );

  fastify.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => {
    reply.code(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: `Resource ${request.url} was not found`,
    });
  });
}
