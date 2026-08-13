export type User = {
  id: string;
  name: string;
  email: string;
};

export type Column = {
  id: string;
  name: string;
  order: number;
  jobItems: JobItem[];
  jobCount: number;
};

export type JobItem = {
  id: string;
  company: string;
  title: string;
  deadline: Date | null;
  minSalary: number | null;
  maxSalary: number | null;
  notes: string | null;
  order: number;
  columnId: string;
  offer?: Offer | null;
};

export type Offer = {
  id: string;
  title: string;
  startDate?: Date | null;
  endDate?: Date | null;
  salary: number;
};

export type AppState = {
  user: User | null;
  columns: Column[];
  isLoading: boolean;
  error: string | null;
  isMutating: boolean;
};
export type Status =
  | 'SAVED'
  | 'APPLIED'
  | 'INTERVIEW'
  | 'OFFER'
  | 'REJECTED'
  | 'WITHDRAWN';
export type FlatColumn = Pick<Column, 'id' | 'name' | 'order'>;
export type FlatJobItem = Exclude<JobItem, 'offer'>;
