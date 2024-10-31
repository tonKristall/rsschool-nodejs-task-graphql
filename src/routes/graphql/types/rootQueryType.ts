import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { MemberTypeId, MemberType } from './memberType.js';
import { UserType } from './userType.js';
import { PostType } from './postType.js';
import { ProfileType } from './profileType.js';
import { UUIDType } from './uuid.js';
import { IArgs, IContext } from './common.js';
import { parseResolveInfo } from 'graphql-parse-resolve-info';

export const RootQueryType = new GraphQLObjectType<unknown, IContext>({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      resolve(_source, _args, { prisma }) {
        return prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeId) },
      },
      resolve(_source, { id }: IArgs, { prisma }) {
        return prisma.memberType.findUnique({ where: { id } });
      },
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      async resolve(_source, _args, { prisma, dataLoaders }, info) {
        const parseInfo = parseResolveInfo(info);
        const args = {
          include: {
            subscribedToUser: !!parseInfo?.fieldsByTypeName.UserType['subscribedToUser'],
            userSubscribedTo: !!parseInfo?.fieldsByTypeName.UserType['userSubscribedTo'],
          },
        };

        const users = await prisma.user.findMany(args);

        if (args.include.subscribedToUser || args.include.userSubscribedTo) {
          users.forEach(({ id, subscribedToUser, userSubscribedTo }) => {
            if (args.include.subscribedToUser) {
              const subscribers = users.filter(({ id }) =>
                subscribedToUser.some(({ subscriberId }) => subscriberId === id),
              );
              dataLoaders.subscribedToUserLoader.clear(id).prime(id, subscribers);
            }

            if (args.include.userSubscribedTo) {
              const authors = users.filter((user) =>
                userSubscribedTo.some(({ authorId }) => authorId === user.id),
              );
              dataLoaders.userSubscribedToLoader.clear(id).prime(id, authors);
            }
          });
        }

        return users;
      },
    },
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve(_source, { id }: IArgs, { prisma }) {
        return prisma.user.findUnique({ where: { id } });
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve(_source, _args, { prisma }) {
        return prisma.post.findMany();
      },
    },
    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve(_source, { id }: IArgs, { prisma }) {
        return prisma.post.findUnique({ where: { id } });
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
      resolve(_source, _args, { prisma }) {
        return prisma.profile.findMany();
      },
    },
    profile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve(_source, { id }: IArgs, { prisma }) {
        return prisma.profile.findUnique({ where: { id } });
      },
    },
  },
});
