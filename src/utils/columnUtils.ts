import { Column, Prisma } from '../../generated/prisma';
import type { Action, reorderPayload } from './types';

export const reorderColumns = async (
  payload: reorderPayload,
  action: Action,
) => {
  //destructure payload
  const { originalOrder, targetOrder, userId, tx } = payload;
  //shift all following Column orders up by one
  switch (action) {
    case 'CREATE': {
      // get all columns with an affected order
      const prevColumns: Column[] = await tx.column.findMany({
        where: { userId, order: { gte: targetOrder } },
        orderBy: { order: 'desc' },
      });
      //adjust order
      for (const item of prevColumns) {
        await tx.column.update({
          where: { id: item.id },
          data: { order: item.order + 1 },
        });
      }
      break;
    }
    case 'REMOVE': {
      // get all columns with an affected order
      const prevColumns: Column[] = await tx.column.findMany({
        where: { userId, order: { gte: targetOrder } },
        orderBy: { order: 'desc' },
      });
      //adjust order
      for (const item of prevColumns) {
        await tx.column.update({
          where: { id: item.id },
          data: { order: item.order + 1 },
        });
      }
      break;
    }
    case 'INCREASE':
    case 'DECREASE':
  }
};
