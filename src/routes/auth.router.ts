import { FastifyInstance, FastifyRequest } from 'fastify';
import {
  AuthQueryString,
  LoginFormVariables,
} from '../interfaces/auth-variables.interface';

export async function authRoutes(fastify: FastifyInstance) {
  const loginFormVars: LoginFormVariables = {
    signup: {
      title: 'Sign up',
      message: 'Already have an account?',
      route: '/auth/signup',
      switchPage: 'login',
      showExtraFields: true,
    },
    login: {
      title: 'Log in',
      message: 'Need to create an account?',
      route: '/auth/login',
      switchPage: 'signup',
      showExtraFields: false,
    },
  };

  fastify.get(
    '/auth',
    async (
      request: FastifyRequest<{ Querystring: AuthQueryString }>,
      reply: any,
    ) => {
      const { page } = request.query;
      const formVars = loginFormVars[page] || loginFormVars.signup;
      return reply.hbsView('/views/authentication/index.hbs', formVars);
    },
  );
}
