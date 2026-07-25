import { JobItem, Prisma } from '../../generated/prisma';

import type { Action, reorderPayload } from './types';
export const reorderJobItems = async (
  payload: reorderPayload,
  action: Action,
) => {
  //destructure payload
  const { originalOrder, targetOrder, columnId, tx } = payload;
  switch (action) {
    case 'CREATE': {
      // get all items with affected orders
      const prevJobItems: JobItem[] = await tx.jobItem.findMany({
        where: { columnId, order: { gte: targetOrder } },
        orderBy: { order: 'desc' },
      });

      // adjust orders
      for (const item of prevJobItems) {
        await tx.jobItem.update({
          where: { id: item.id },
          data: { order: item.order + 1 },
        });
      }
      break;
    }
    case 'REMOVE': {
      // get all items with affected orders
      const prevJobItems: JobItem[] = await tx.jobItem.findMany({
        where: { columnId, order: { gt: targetOrder } },
        orderBy: { order: 'asc' },
      });
      // adjust orders
      for (const item of prevJobItems) {
        await tx.jobItem.update({
          where: { id: item.id },
          data: { order: item.order - 1 },
        });
      }
      break;
    }
    case 'INCREASE': {
      // get all items with affected orders
      const prevJobItems: JobItem[] = await tx.jobItem.findMany({
        where: { columnId, order: { gt: originalOrder, lte: targetOrder } },
        orderBy: { order: 'asc' },
      });
      // adjust orders
      for (const item of prevJobItems) {
        await tx.jobItem.update({
          where: { id: item.id },
          data: { order: item.order - 1 },
        });
        const updatedItems: JobItem[] = await tx.jobItem.findMany({
          where: { columnId },
          orderBy: { order: 'asc' },
        });
      }
      break;
    }
    case 'DECREASE': {
      // get all items with affected orders
      const prevJobItems: JobItem[] = await tx.jobItem.findMany({
        where: { columnId, order: { lt: originalOrder, gte: targetOrder } },
        orderBy: { order: 'desc' },
      });
      // adjust orders
      for (const item of prevJobItems) {
        await tx.jobItem.update({
          where: { id: item.id },
          data: { order: item.order + 1 },
        });
      }
      break;
    }
  }
};
