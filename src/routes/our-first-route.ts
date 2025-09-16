import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import operatingHours from '../modules/data/operating-hours';
import menuItems from '../modules/data/menu-items';

export async function routes(fastify: FastifyInstance, options: object) {
  fastify.get('/menu', async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.view('views/menu.ejs', { menuItems });
  });

  fastify.get(
    '/hours',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const days = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ];

      return reply.view('views/hours.ejs', { operatingHours, days });
    },
  );
}
