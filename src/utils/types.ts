import { Prisma } from '../../generated/prisma';

export type reorderPayload = {
  originalOrder?: number;
  targetOrder: number;
  columnId?: string;
  userId?: string;
  tx: Prisma.TransactionClient;
};

export type Action = 'CREATE' | 'REMOVE' | 'INCREASE' | 'DECREASE';
