import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { GeminiPromptInterface } from '../interfaces/learning-profile.interface';
import { generateResponseWithSummary } from '../modules/interview-atlas-ai';
import fastifyPassport from '@fastify/passport';
import { Account } from '../models/account.model';
import { LearningProfile } from '../models/learning-profile.model';

export async function interviewRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/query',
    { preValidation: fastifyPassport.authenticate('jwt', { session: false }) },
    async (
      request: FastifyRequest<{ Body: GeminiPromptInterface }>,
      reply: FastifyReply,
    ) => {
      try {
        const { prompt } = request.body;

        if (!prompt) {
          return reply.status(400).send({ error: 'Prompt is required' });
        }

        const user: any = request.user;
        const account: Account = user.dataValues;

        const accountLearningProfile = await LearningProfile.findOne({
          where: { userId: account.id },
        });

        if (accountLearningProfile) {
          const learningProfile =
            accountLearningProfile.learning_profile ||
            'This user has no recorded learning profile yet';

          const answer = await generateResponseWithSummary(
            prompt,
            learningProfile,
          );

          reply.send({ answer });
        }
      } catch (error) {
        console.error('Gemini API error', error);
        if (error instanceof Error) {
          reply.status(500).send({
            error: 'Error communicating with the Gemini API',
            details: error.message,
          });
        }
      }
    },
  );
}
