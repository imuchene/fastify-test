import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { InterviewData } from '../interfaces/interview.interface';
import { generateResponse } from '../modules/interview-atlas-ai';

export async function interviewRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/query',
    async (
      request: FastifyRequest<{ Body: InterviewData }>,
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
          reply
            .status(500)
            .send({
              error: 'Error communicating with the Gemini API',
              details: error.message,
            });
        }
      }
    },
  );
}
