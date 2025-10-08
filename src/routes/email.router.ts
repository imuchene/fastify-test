import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Lead } from '../models/lead.model';
import { sendMail } from '../services/mailer';
import { confirmationMail } from '../templates/mail-template';

export async function emailRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/subscribe',
    async (request: FastifyRequest<{ Body: Lead }>, reply: FastifyReply) => {
      try {
        const { email } = request.body;
        await Lead.create({ email });

        const host = request.headers.host;
        const protocol = request.protocol;
        sendMail(
          email,
          confirmationMail(`${protocol}://${host}/verify/${email}`),
        );
        return reply.send({ message: 'ok' });
      } catch (error) {
        reply.status(400).send(error);
      }
    },
  );

  fastify.get(
    '/verify/:email',
    async (request: FastifyRequest<{ Params: Lead }>, reply: FastifyReply) => {
      const { email } = request.params;
      try {
        const lead = await Lead.findOne({ where: { email } });
        if (lead) {
          lead.verified = true;
          await lead.save();
          console.log(`${email} is verified`);
          reply.send({ message: 'Verified!' });
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Could not verify the lead', error.message);
          reply.status(400).send({ message: 'Unable to verify' });
        }
      }
    },
  );

  fastify.get(
    '/campaign/:campaignKey/user/:email/image.png',
    async (request: FastifyRequest<{ Params: Lead }>, reply: FastifyReply) => {
      const { email, campaignKey } = request.params;
      try {
        const lead = await Lead.findOne({ where: { email } });
        if (lead) {
          lead.last_campaign = campaignKey;
          await lead.save();
          console.log(`${email} opened ${campaignKey}`);
          reply.send({ message: 'ok' });
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('An error occurred', error.message);
          reply.status(422).send({ message: 'Unable to process the request' });
        }
      }
    },
  );
}
