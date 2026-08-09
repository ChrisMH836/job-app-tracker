import type {
  GetDeepColumnsResponse,
  GetFlatColumnResponse,
  GetUserResponse,
} from './types/responseTypes';
import type { Column, Offer, User } from './types/stateTypes';

const serverURL = 'http://localhost:5001';
export const fetchColumns = async (): Promise<Column[]> => {
  const response = await fetch(`${serverURL}/column`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('An error occured. Please try again');

  const { data: columnsData }: GetDeepColumnsResponse = await response.json();

  const columns: Column[] = columnsData.map((column) => ({
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
        ? ({
            id: item.offer.id,
            title: item.offer.title,
            startDate: item.offer.startDate,
            endDate: item.offer.endDate,
            salary: item.offer.salary,
          } as Offer)
        : null,
    })),
  }));
  return columns;
};

export const fetchMe = async (): Promise<User> => {
  const response = await fetch(`${serverURL}/user/me`, {
    credentials: 'include',
  });
  console.log(response);
  if (!response.ok) throw new Error(`API error: ${response.status}`);

  const { data: userData }: GetUserResponse = await response.json();

  const user = {
    id: userData.id,
    name: userData.name,
    email: userData.email,
  } as User;
  return user;
};

export const createColumn = async (name: string): Promise<Column> => {
  const response = await fetch(`${serverURL}/column`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error('An error occured. Please try again');

  const { data: columnData }: GetFlatColumnResponse = await response.json();

  const column = {
    id: columnData.id,
    name: columnData.name,
    order: columnData.order,
    jobItems: [],
    jobCount: 0,
  } as Column;
  return column;
};
