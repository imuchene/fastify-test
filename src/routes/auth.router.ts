import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  AuthQueryString,
  LoginFormVariables,
} from '../interfaces/auth-variables.interface';
import { Account } from '../models/account.model';

const users: any = {};

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

  fastify.post(
    '/auth/signup',
    async (request: FastifyRequest<{ Body: Account }>, reply: FastifyReply) => {
      const { username, hash, confirmPassword } = request.body;
      if (hash != confirmPassword) {
        return reply.send({ message: 'Passwords do not match' });
      }

      await Account.create({ username, hash });
      return reply.send({ message: 'Account created' });
    },
  );

  fastify.post(
    '/auth/login',
    async (request: FastifyRequest<{ Body: Account }>, reply: FastifyReply) => {
      const { username, hash } = request.body;
      if (users[username] && users[username] == hash) {
        return reply.send({ message: 'Logged in' });
      }
      return reply.redirect('/auth?page=login');
    },
  );
}
