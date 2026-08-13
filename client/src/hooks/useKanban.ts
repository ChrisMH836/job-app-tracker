import type { Dispatch } from 'react';

import type { Action } from '../reducer';
import {
  createColumnApi,
  createJobItemApi,
  removeColumnApi,
  removeJobItemApi,
  updateColumnApi,
  updateJobItemApi,
} from '../api';
import type { Column, Status } from '../types/stateTypes';

export const useKanban = (dispatch: Dispatch<Action>) => {
  const mutate = async (apiCall: () => Promise<Column[]>) => {
    dispatch({ type: 'SET_MUTATING', payload: true });
    try {
      const columns = await apiCall();
      dispatch({ type: 'SET_COLUMNS', payload: { columns } });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          error: error instanceof Error ? error.message : 'unknown error',
        },
      });
    } finally {
      dispatch({ type: 'SET_MUTATING', payload: false });
    }
  };
  const createColumn = async (name: string, order?: number) => {
    await mutate(() => createColumnApi(name, order));
  };
  const updateColumn = async (
    columnId: string,
    name?: string,
    order?: number,
  ) => {
    await mutate(() => updateColumnApi(columnId, name, order));
  };
  const removeColumn = async (id: string) => {
    await mutate(() => removeColumnApi(id));
  };
  const createJobItem = async (
    columnId: string,
    title: string,
    company: string,
    deadline?: Date,
    notes?: string,
    status?: Status,
    minSalary?: number,
    maxSalary?: number,
    order?: number,
  ) => {
    await mutate(() =>
      createJobItemApi(
        columnId,
        title,
        company,
        deadline,
        notes,
        status,
        minSalary,
        maxSalary,
        order,
      ),
    );
  };
  const updateJobItem = async (
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
  ) => {
    await mutate(() =>
      updateJobItemApi(
        id,
        columnId,
        title,
        company,
        deadline,
        notes,
        status,
        minSalary,
        maxSalary,
        order,
      ),
    );
  };
  const removeJobItem = async (id: string) => {
    await mutate(() => removeJobItemApi(id));
  };
  return {
    createColumn,
    updateColumn,
    removeColumn,
    createJobItem,
    updateJobItem,
    removeJobItem,
  };
};
