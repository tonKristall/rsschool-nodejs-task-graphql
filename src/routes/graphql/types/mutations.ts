import { GraphQLObjectType } from 'graphql/index.js';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { ChangeUserInput, CreateUserInput, UserType } from './userType.js';
import { ChangePostInput, CreatePostInput, PostType } from './postType.js';
import { ChangeProfileInput, CreateProfileInput, ProfileType } from './profileType.js';
import { TArgs, TContext } from './common.js';
import { UUIDType } from './uuid.js';

export const Mutations = new GraphQLObjectType<unknown, TContext>({
  name: 'Mutations',
  fields: {
    createUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInput) },
      },
      resolve(_source, args, { prisma }) {
        return prisma.user.create({ data: args.dto });
      },
    },
    createProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInput) },
      },
      resolve(_source, args, { prisma }) {
        return prisma.profile.create({ data: args.dto });
      },
    },
    createPost: {
      type: new GraphQLNonNull(PostType),
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInput) },
      },
      resolve(_source, args, { prisma }) {
        return prisma.post.create({ data: args.dto });
      },
    },
    changePost: {
      type: new GraphQLNonNull(PostType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve(_source, { id, dto }, { prisma }) {
        return prisma.post.update({ where: { id }, data: dto });
      },
    },
    changeProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve(_source, { id, dto }, { prisma }) {
        return prisma.profile.update({ where: { id }, data: dto });
      },
    },
    changeUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve(_source, { id, dto }, { prisma }) {
        return prisma.user.update({ where: { id }, data: dto });
      },
    },
    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(_source, { id }: TArgs, { prisma }) {
        await prisma.user.delete({ where: { id } });
        return 'Resolve';
      },
    },
    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(_source, { id }: TArgs, { prisma }) {
        await prisma.post.delete({ where: { id } });
        return 'Resolve';
      },
    },
    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(_source, { id }: TArgs, { prisma }) {
        await prisma.profile.delete({ where: { id } });
        return 'Resolve';
      },
    },
    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(_source, { userId, authorId }, { prisma }) {
        await prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: userId,
            authorId,
          },
        });
        return 'Resolve';
      },
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(_source, { userId, authorId }, { prisma }) {
        await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId,
            },
          },
        });
        return 'Resolve';
      },
    },
  },
});
