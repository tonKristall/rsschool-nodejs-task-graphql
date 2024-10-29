import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { MemberTypeId, MemberType } from './memberType.js';
import { UserType } from './userType.js';
import { PostType } from './postType.js';
import { ProfileType } from './profileType.js';
import { UUIDType } from './uuid.js';
import { TArgs, TContext } from './common.js';

export const RootQueryType = new GraphQLObjectType<unknown, TContext>({
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
      resolve(_source, { id }: TArgs, { prisma }) {
        return prisma.memberType.findUnique({ where: { id } });
      },
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve(_source, _args, { prisma }) {
        return prisma.user.findMany();
      },
    },
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve(_source, { id }: TArgs, { prisma }) {
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
      resolve(_source, { id }: TArgs, { prisma }) {
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
      resolve(_source, { id }: TArgs, { prisma }) {
        return prisma.profile.findUnique({ where: { id } });
      },
    },
  },
});
