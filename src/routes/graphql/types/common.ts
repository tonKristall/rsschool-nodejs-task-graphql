import { dataLoaders } from '../dataLoader.js';
import { PrismaClient } from '@prisma/client';

export interface IContext {
  prisma: PrismaClient;
  dataLoaders: ReturnType<typeof dataLoaders>;
}

export interface IArgs {
  id: string;
}
