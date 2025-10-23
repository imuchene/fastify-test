import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  AuthQueryString,
  LoginFormVariables,
} from '../interfaces/auth-variables.interface';
import { Account } from '../models/account.model';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import fastifyPassport from '@fastify/passport';
import '@dotenvx/dotenvx/config';

const users: any = {};

export async function authRoutes(fastify: FastifyInstance) {
  await fastify.register(fastifyCookie);

  await fastify.register(fastifySession, {
    secret: String(process.env.SESSION_SECRET),
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
    saveUninitialized: false,
  });

  await fastify.register(fastifyPassport.initialize());

  await fastify.register(fastifyPassport.secureSession());

  fastifyPassport.registerUserSerializer(
    async (user: Account, request: FastifyRequest) => user.username,
  );

  fastifyPassport.registerUserDeserializer(
    async (username: string, request: FastifyRequest) => {
      const account = await Account.findByUsername(username);
      if (!account) {
        throw new Error('User not found');
      }
      return account;
    },
  );

  fastifyPassport.use('local', Account.genStrategy());

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
