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
      // get all items with affected orders
      const prevColumns: Column[] = await tx.column.findMany({
        where: { userId, order: { gt: targetOrder } },
        orderBy: { order: 'asc' },
      });
      // adjust orders
      for (const column of prevColumns) {
        await tx.column.update({
          where: { id: column.id },
          data: { order: column.order - 1 },
        });
      }
      break;
    }
    case 'INCREASE': {
      // get all items with affected orders
      const prevColumns: Column[] = await tx.column.findMany({
        where: { userId, order: { gt: originalOrder, lte: targetOrder } },
        orderBy: { order: 'asc' },
      });
      // adjust orders
      for (const column of prevColumns) {
        await tx.column.update({
          where: { id: column.id },
          data: { order: column.order - 1 },
        });
      }
      break;
    }
    case 'DECREASE': {
      // get all items with affected orders
      const prevColumns: Column[] = await tx.column.findMany({
        where: { userId, order: { lt: originalOrder, gte: targetOrder } },
        orderBy: { order: 'desc' },
      });
      // adjust orders
      for (const column of prevColumns) {
        await tx.column.update({
          where: { id: column.id },
          data: { order: column.order + 1 },
        });
      }
      break;
    }
  }
};

export const updateJobCount = async (
  columnId: string,
  tx: Prisma.TransactionClient,
) => {
  const jobCount = await tx.jobItem.count({
    where: { columnId },
  });
  const result = await tx.column.update({
    where: { id: columnId },
    data: { jobCount },
  });
  return result.jobCount;
};
