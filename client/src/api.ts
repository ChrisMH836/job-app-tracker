import type {
  DeepColumnData,
  GetDeepColumnsResponse,
  GetUserResponse,
} from './types/responseTypes';
import type { Column, Status, User } from './types/stateTypes';

const serverURL = 'http://localhost:5001';

const mapColumns = (columnsData: DeepColumnData[]): Column[] => {
  return columnsData.map((column) => ({
    id: column.id,
    name: column.name,
    order: column.order,
    jobCount: column._count.jobItems,
    jobItems: column.jobItems.map((item) => ({
      id: item.id,
      company: item.company,
      title: item.title,
      deadline: item.deadline,
      minSalary: item.minSalary,
      maxSalary: item.maxSalary,
      notes: item.notes,
      order: item.order,
      columnId: item.columnId,
      offer: item.offer
        ? {
            id: item.offer.id,
            title: item.offer.title,
            startDate: item.offer.startDate,
            endDate: item.offer.endDate,
            salary: item.offer.salary,
          }
        : null,
    })),
  }));
};

export const fetchColumns = async (): Promise<Column[]> => {
  const response = await fetch(`${serverURL}/column`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('An error occured. Please try again');

  const { data: columnsData }: GetDeepColumnsResponse = await response.json();

  const columns: Column[] = mapColumns(columnsData);
  return columns;
};

export const fetchMe = async (): Promise<User> => {
  const response = await fetch(`${serverURL}/user/me`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);

  const { data: userData }: GetUserResponse = await response.json();

  const user = {
    id: userData.id,
    name: userData.name,
    email: userData.email,
  } as User;
  return user;
};

export const createColumnApi = async (
  name: string,
  order?: number,
): Promise<Column[]> => {
  const response = await fetch(`${serverURL}/column`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, ...(order !== undefined && { order }) }),
  });
  if (!response.ok) throw new Error('Unable to create column');

  const { data: columnsData }: GetDeepColumnsResponse = await response.json();

  const columns: Column[] = mapColumns(columnsData);
  return columns;
};

export const updateColumnApi = async (
  columnId: string,
  name?: string,
  order?: number,
): Promise<Column[]> => {
  const response = await fetch(`${serverURL}/column/${columnId}`, {
    credentials: 'include',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...(name !== undefined && { name }),
      ...(order !== undefined && { order }),
    }),
  });
  if (!response.ok) throw new Error('Unable to create column');

  const { data: columnsData }: GetDeepColumnsResponse = await response.json();

  const columns: Column[] = mapColumns(columnsData);
  return columns;
};

export const removeColumnApi = async (id: string): Promise<Column[]> => {
  const response = await fetch(`${serverURL}/column/${id}`, {
    credentials: 'include',
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Unable to remove column');
  const { data: columnsData }: GetDeepColumnsResponse = await response.json();

  const columns: Column[] = mapColumns(columnsData);
  return columns;
};

export const createJobItemApi = async (
  columnId: string,
  title: string,
  company: string,
  deadline?: Date,
  notes?: string,
  status?: Status,
  minSalary?: number,
  maxSalary?: number,
  order?: number,
): Promise<Column[]> => {
  const response = await fetch(`${serverURL}/job`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      columnId,
      title,
      company,
      ...(deadline !== undefined && { deadline }),
      ...(notes !== undefined && { notes }),
      ...(status !== undefined && { status }),
      ...(minSalary !== undefined && { minSalary }),
      ...(maxSalary !== undefined && { maxSalary }),
      ...(order !== undefined && { order }),
    }),
  });
  if (!response.ok) throw new Error('Unable to create job item');
  const { data: columnsData }: GetDeepColumnsResponse = await response.json();

  const columns: Column[] = mapColumns(columnsData);
  return columns;
};

export const updateJobItemApi = async (
  id: string,
  columnId?: string,
  title?: string,
  company?: string,
  deadline?: Date,
  notes?: string,
  status?: Status,
  minSalary?: number,
  maxSalary?: number,
  order?: number,
): Promise<Column[]> => {
  const response = await fetch(`${serverURL}/job/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      ...(columnId !== undefined && { columnId }),
      ...(title !== undefined && { title }),
      ...(company !== undefined && { company }),
      ...(deadline !== undefined && { deadline }),
      ...(notes !== undefined && { notes }),
      ...(status !== undefined && { status }),
      ...(minSalary !== undefined && { minSalary }),
      ...(maxSalary !== undefined && { maxSalary }),
      ...(order !== undefined && { order }),
    }),
  });
  if (!response.ok) throw new Error('Unable to update job item');

  const { data: columnsData }: GetDeepColumnsResponse = await response.json();

  const columns: Column[] = mapColumns(columnsData);
  return columns;
};

export const removeJobItemApi = async (id: string): Promise<Column[]> => {
  const response = await fetch(`${serverURL}/job/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Unable to remove job item');
  const { data: columnsData }: GetDeepColumnsResponse = await response.json();

  const columns: Column[] = mapColumns(columnsData);
  return columns;
};
