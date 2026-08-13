import type { AppState, Column, User } from './types/stateTypes';

export type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { columns: Column[]; user: User } }
  | { type: 'SET_ERROR'; payload: { error: string } }
  | { type: 'SET_COLUMNS'; payload: { columns: Column[] } }
  | { type: 'SET_MUTATING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: { error: string } };
// | { type: 'CREATE_COLUMN'; payload: { column: Column } }
// | { type: 'UPDATE_COLUMN'; payload: { updateData: FlatColumn } }
// | { type: 'REMOVE_COLUMN'; payload: { id: string } }
// | { type: 'CREATE_JOBITEM'; payload: { jobItem: JobItem } }
// | { type: 'UPDATE_JOBITEM'; payload: { updateData: FlatJobItem } }
// | { type: 'REMOVE_JOBITEM'; payload: { id: string } };

export const initialState: AppState = {
  user: null,
  columns: [],
  isLoading: true,
  error: null,
  isMutating: false,
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
    case 'SET_ERROR':
      return { ...prevState, error: action.payload.error, isLoading: false };
    case 'SET_COLUMNS':
      console.log('updating...');
      return { ...prevState, columns: action.payload.columns };
    case 'SET_MUTATING':
      return { ...prevState, isMutating: action.payload };
    default:
      return prevState;
    // case 'CREATE_COLUMN': {
    //   const newColumn = action.payload.column;
    //   const newColumns = [
    //     ...prevState.columns.filter(
    //       (column) => column.order <= newColumn.order,
    //     ),
    //     newColumn,
    //     ...prevState.columns.filter((column) => column.order > newColumn.order),
    //   ];
    //   return {
    //     ...prevState,
    //     columns: newColumns,
    //   };
    // }
    // case 'UPDATE_COLUMN':
    //   return {
    //     ...prevState,
    //     columns: prevState.columns.map((column) =>
    //       column.id === action.payload.updateData.id
    //         ? { ...column, ...action.payload.updateData }
    //         : column,
    //     ),
    //   };
    // case 'REMOVE_COLUMN':
    //   return {
    //     ...prevState,
    //     columns: prevState.columns.filter(
    //       (column) => column.id !== action.payload.id,
    //     ),
    //   };
    // case 'CREATE_JOBITEM': {
    //   const jobItem = action.payload.jobItem;
    //   return {
    //     ...prevState,
    //     columns: prevState.columns.map((column) =>
    //       column.id === jobItem.columnId
    //         ? {
    //             ...column,
    //             jobItems: [...column.jobItems, action.payload.jobItem],
    //           }
    //         : column,
    //     ),
    //   };
    // }
    // case 'UPDATE_JOBITEM': {
    //   const updateData = action.payload.updateData;
    //   return {
    //     ...prevState,
    //     columns: prevState.columns.map((column) => {
    //       return {
    //         ...column,
    //         jobItems: column.jobItems.map((jobItem) =>
    //           jobItem.id === updateData.id
    //             ? { ...jobItem, ...updateData }
    //             : jobItem,
    //         ),
    //       };
    //     }),
    //   };
    // }
    // case 'REMOVE_JOBITEM':
    //   return {
    //     ...prevState,
    //     columns: prevState.columns.map((column) => {
    //       return {
    //         ...column,
    //         jobItems: column.jobItems.filter(
    //           (jobItem) => jobItem.id !== action.payload.id,
    //         ),
    //       };
    //     }),
    //   };
  }
};
