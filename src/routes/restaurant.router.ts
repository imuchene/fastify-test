import { FastifyInstance, FastifyRequest } from 'fastify';
import operatingHours from '../modules/data/operating-hours';
import menuItems from '../modules/data/menu-items';

export async function restaurantRoutes(fastify: FastifyInstance) {
  fastify.get('/menu', async (request: FastifyRequest, reply: any) => {
    return reply.ejsView('views/restaurant/menu.ejs', { menuItems });
  });

  fastify.get('/hours', async (request: FastifyRequest, reply: any) => {
    const days = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];

    const today = days[new Date().getDay() - 1];

    return reply.ejsView('views/restaurant/hours.ejs', {
      operatingHours,
      days,
      today,
    });
  });

  fastify.get('/about', async (request: FastifyRequest, reply: any) => {
    return reply.ejsView('views/restaurant/about.ejs');
  });
}
