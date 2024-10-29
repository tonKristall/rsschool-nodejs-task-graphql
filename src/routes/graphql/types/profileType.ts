import { GraphQLNonNull, GraphQLObjectType, GraphQLBoolean, GraphQLInt } from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberType } from './memberType.js';
import { TContext } from './common.js';

interface ISource {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  memberTypeId: string;
}

export const ProfileType: GraphQLObjectType = new GraphQLObjectType<ISource, TContext>({
  name: 'ProfileType',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      resolve({ memberTypeId }, _args, { prisma }) {
        return prisma.memberType.findUnique({ where: { id: memberTypeId } });
      },
    },
  }),
});
