import { prisma } from '../config/db';

export const lastJobItemOrder = async (columnId: string) => {
  const lastJobItem = await prisma.jobItem.findFirst({
    where: { columnId },
    orderBy: {
      order: 'desc',
    },
  });
  return lastJobItem ? lastJobItem.order + 1 : 0;
};

export const lastColumnOrder = async (userId: string) => {
  const lastColumn = await prisma.column.findFirst({
    where: { userId },
    orderBy: {
      order: 'desc',
    },
  });
  return lastColumn ? lastColumn.order + 1 : 0;
};
