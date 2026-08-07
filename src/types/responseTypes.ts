import { Prisma } from '../../generated/prisma';

//type for column/ request
const getColumnsArgs = {
  orderBy: { order: 'asc' as const },
  include: {
    _count: { select: { jobItems: true } },
    jobItems: {
      orderBy: { order: 'asc' as const },
      include: { offer: true },
    },
  },
} satisfies Prisma.ColumnFindManyArgs;

export type ColumnDataWithJobs = Prisma.ColumnGetPayload<typeof getColumnsArgs>;

export type getColumnsData = {
  status: string;
  data: ColumnDataWithJobs[];
};

//tyoe for user/me request
export type userData = Prisma.UserGetPayload<Prisma.UserFindUniqueArgs>;

export type getUserData = {
  status: string;
  data: userData;
};
