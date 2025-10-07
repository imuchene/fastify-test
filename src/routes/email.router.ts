import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Lead } from '../models/lead.model';
import { sendMail } from '../services/mailer';
import { welcomeMail } from '../templates/mail-template';

export async function emailRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/subscribe',
    async (request: FastifyRequest<{ Body: Lead }>, reply: FastifyReply) => {
      try {
        const { email } = request.body;
        await Lead.create({ email });
        sendMail(email, welcomeMail());
        return reply.send({ message: 'ok' });
      } catch (error) {
        reply.status(400).send(error);
      }
    },
  );
}
