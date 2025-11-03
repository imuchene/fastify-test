import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Order } from '../interfaces/order.interface';
import Queue from 'queue';
import { createClient, RedisClientOptions } from 'redis';
import '@dotenvx/dotenvx/config';
import amqplib from 'amqplib';
import { FulfilmentService } from '../services/fulfilment.service';
import { AnalyticsService } from '../services/analytics.service';

let channel: amqplib.Channel;
let connection: amqplib.ChannelModel;

async function connect() {
  try {
    connection = await amqplib.connect(String(process.env.RABBITMQ_URL));
    channel = await connection.createChannel();
    await channel.assertQueue('drink-order');
  } catch (error) {
    console.error(error);
  }
}

async function sendOrderData(data: any) {
  await connect();
  channel.sendToQueue('drink-order', Buffer.from(JSON.stringify(data)));
}

export async function orderRoutes(fastify: FastifyInstance) {
  const coffeeQueue = new Queue({ results: [] });

  const redisOptions: RedisClientOptions = {
    username: String(process.env.REDIS_USERNAME),
    password: String(process.env.REDIS_PASSWORD),
    database: Number(process.env.REDIS_DATABASE),
    socket: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    },
  };

  const subscriber = createClient(redisOptions);
  await subscriber.connect();

  const publisher = createClient(redisOptions);
  await publisher.connect();

  await subscriber.subscribe('drink-order', (drinkOrder) => {
    console.log(`Received a new ${drinkOrder} order`);
  });

  fastify.post(
    '/orders',
    async (request: FastifyRequest<{ Body: Order }>, reply: FastifyReply) => {
      const { drinkOrder: order, cost, customer } = request.body;
      const data = {
        order,
        customer,
      };

      await sendOrderData(data);
      new FulfilmentService();
      new AnalyticsService();

      console.log(`Drink: ${order} is being processed for ${customer}`);

      return reply.send('Order Processing');
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
