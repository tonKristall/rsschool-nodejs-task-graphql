import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profileType.js';
import { PostType } from './postType.js';
import { TContext } from './common.js';
import { GraphQLInputObjectType } from 'graphql/type/index.js';

interface ISource {
  id: string;
  name: string;
  balance: number;
}

export const UserType: GraphQLObjectType = new GraphQLObjectType<ISource, TContext>({
  name: 'UserType',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve({ id }, _args, { prisma }) {
        return prisma.profile.findUnique({ where: { userId: id } });
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve({ id }, _args, { prisma }) {
        return prisma.post.findMany({ where: { authorId: id } });
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve({ id }, _args, { prisma }) {
        return prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: id,
              },
            },
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve({ id }, _args, { prisma }) {
        return prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: id,
              },
            },
          },
        });
      },
    },
  }),
});

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});
