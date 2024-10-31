import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, graphQLSchema } from './schemas.js';
import { graphql, validate, parse } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { dataLoaders } from './dataLoader.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;
  const contextValue = { prisma, dataLoaders: dataLoaders(prisma) };

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },

    async handler(req) {
      const { query: source, variables: variableValues } = req.body;
      const errors = validate(graphQLSchema, parse(source), [depthLimit(5)]);

      return errors.length
        ? { errors }
        : await graphql({
            source,
            schema: graphQLSchema,
            variableValues,
            contextValue,
          });
    },
  });
};

export default plugin;
