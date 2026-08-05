export type User = {
  id: string;
  name: string;
  email: string;
};

export type Column = {
  id: string;
  name: string;
  order: number;
};

export type JobItem = {
  id: string;
  company: string;
  title: string;
  deadline?: Date;
  minsalary?: number;
  maxSalary?: number;
  notes?: string;
  order: number;
  columnId: string;
  offer?: Offer;
};

export type Offer = {
  id: string;
  title: string;
  startDate?: Date;
  endDate?: Date;
  salary: number;
};

export type AppState = {
  user: User | null;
  columns: Column[];
  isLoading: boolean;
  error: string | null;
};
