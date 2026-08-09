import type { AppState, Column, User } from './types/stateTypes';

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { columns: Column[]; user: User } }
  | { type: 'FETCH_ERROR'; payload: { error: string } };

export const initialState: AppState = {
  user: null,
  columns: [],
  isLoading: true,
  error: null,
};

export const reducer = (prevState: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...prevState, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return {
        ...prevState,
        user: action.payload.user,
        columns: action.payload.columns,
        isLoading: false,
      };
    case 'FETCH_ERROR':
      return { ...prevState, error: action.payload.error, isLoading: false };
    default:
      return prevState;
  }
};
