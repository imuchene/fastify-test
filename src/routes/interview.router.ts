import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { GeminiPromptInterface } from '../interfaces/learning-profile.interface';
import { generateResponse } from '../modules/interview-atlas-ai';
import fastifyPassport from '@fastify/passport';

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
        const response = await generateResponse(prompt);
        reply.send({ response });
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
