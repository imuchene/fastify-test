import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Order } from '../interfaces/order.interface';
import Queue from 'queue';

export async function orderRoutes(fastify: FastifyInstance) {
  const coffeeQueue = new Queue({ results: [] });

  fastify.post(
    '/slow_orders',
    async (request: FastifyRequest<{ Body: Order }>, reply: FastifyReply) => {
      const { drinkOrder } = request.body;
      for (let i = 0; i < 10000000000; i++) {}
      console.log('Order placed');
      return reply.send(`Drink order added to queue: ${drinkOrder}`);
    },
  );

  fastify.post(
    '/orders',
    async (request: FastifyRequest<{ Body: Order }>, reply: FastifyReply) => {
      const { drinkOrder } = request.body;
      coffeeQueue.push(() => {
        return new Promise((resolve, reject) => {
          resolve(drinkOrder);
        });
      });
      console.log('coffee queue length', coffeeQueue.length);
      return reply.send('Drink order added to the queue');
    },
  );

  fastify.post(
    '/process_orders',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const nextOrder = coffeeQueue.shift();
      if (nextOrder) {
        return reply.send({ order: nextOrder });
      } else {
        return reply.send('No drink orders in the queue');
      }
    },
  );

  fastify.get(
    '/order_count',
    async (request: FastifyRequest, reply: FastifyReply) => {
      return reply.send(`${coffeeQueue.length} drink orders in the queue`);
    },
  );
}
