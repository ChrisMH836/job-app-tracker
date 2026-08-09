/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prisma } from '../../../generated/prisma';

// request arguments

const getDeepColumnArgs = {
  orderBy: { order: 'asc' as const },
  include: {
    _count: { select: { jobItems: true } },
    jobItems: {
      orderBy: { order: 'asc' as const },
      include: { offer: true },
    },
  },
} satisfies Prisma.ColumnFindManyArgs;

const getDeepJobItemArgs = {
  orderBy: { order: 'asc' as const },
  include: { offer: true },
} satisfies Prisma.JobItemFindManyArgs;

// prisma return types

export type FlatColumnData = Prisma.ColumnGetPayload<object>;
export type DeepColumnData = Prisma.ColumnGetPayload<typeof getDeepColumnArgs>;

export type FlatUserData = Prisma.UserGetPayload<object>;

export type FlatJobItemData = Prisma.JobItemGetPayload<object>;
export type DeepJobItemData = Prisma.JobItemGetPayload<
  typeof getDeepJobItemArgs
>;

//server response types
export type GetUserResponse = {
  status: string;
  data: FlatUserData;
};

export type GetDeepColumnsResponse = {
  status: string;
  data: DeepColumnData[];
};
export type GetFlatColumnResponse = {
  status: string;
  data: FlatColumnData;
};
export type GetDeepColumnResponse = {
  status: string;
  data: DeepColumnData;
};

export type GetDeepJobItemsResponse = {
  status: string;
  data: DeepJobItemData[];
};
export type GetFlatJobItemResponse = {
  status: string;
  data: FlatJobItemData;
};
export type GetDeepJobItemResponse = {
  status: string;
  data: DeepJobItemData;
};
