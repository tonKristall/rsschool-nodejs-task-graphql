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
