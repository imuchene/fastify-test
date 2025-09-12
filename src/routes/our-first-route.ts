import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import operatingHours from "../modules/data/operating-hours";
import menuItems from "../modules/data/menu-items";

export async function routes (fastify: FastifyInstance, options: Object) {
  fastify.get('/test', async (request: FastifyRequest, reply: FastifyReply) => {
    return { hello: 'world' }
  });

  fastify.get('/fare', async (request: FastifyRequest, reply: FastifyReply) => {
    return `Welcome to What's Fare is Fair!`;
  })

  fastify.get('/menu', async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send(menuItems)
  })

  fastify.get('/hours', async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send(operatingHours)
  })
}