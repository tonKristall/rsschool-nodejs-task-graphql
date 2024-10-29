import { FastifyBaseLogger, FastifyInstance, RawServerDefault } from 'fastify';
import { IncomingMessage, ServerResponse } from 'node:http';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

export type TContext = FastifyInstance<
  RawServerDefault,
  IncomingMessage,
  ServerResponse,
  FastifyBaseLogger,
  TypeBoxTypeProvider
>;
