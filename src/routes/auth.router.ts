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
import { CookieNames } from '../enums/cookie-names.enum';

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

  fastifyPassport.use('local', Account.genLocalStrategy());

  fastifyPassport.use('jwt', Account.genJWTStrategy());

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

  fastify.get(
    '/dashboard',
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
      const { username, password, confirmPassword } = request.body;
      try {
        if (password !== confirmPassword) {
          return reply.send({ message: 'Passwords do not match' });
        }

        await Account.register(username, password);
        return reply.send({ message: 'Account created' });
      } catch (error) {
        if (error && error instanceof Error) {
          return reply
            .code(400)
            .send({ message: 'Account creation failed', error: error.message });
        }
      }
    },
  );

  fastify.post(
    '/auth/login',
    {
      preValidation: fastifyPassport.authenticate('local', { session: false }),
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      if (request.user) {
        const user: any = request.user;
        const account: Account = user.dataValues;

        const token = Account.signJWT(account.username);

        return reply
          .setCookie(CookieNames.AuthCookie, token, {
            httpOnly: true,
            sameSite: 'lax',
          })
          .send({ message: 'Logged in successfully ' });
      }
    },
  );

  // The route below when visited tests that authentication works
  fastify.get(
    '/auth/test',
    { preValidation: fastifyPassport.authenticate('jwt', { session: false }) },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return reply.send({ status: 'Authenticated ' });
    },
  );

  fastify.get(
    '/auth/logout',
    { preValidation: fastifyPassport.authenticate('jwt', { session: false }) },
    async (request: FastifyRequest, reply: FastifyReply) => {
      // To logout, set the max age of the cookie to 0, meaning expire it immediately, and set its contents
      // to an empty string
      return reply
        .setCookie(CookieNames.AuthCookie, '', { maxAge: 0 })
        .send({ message: 'Logged out successfully' });
    },
  );
}
