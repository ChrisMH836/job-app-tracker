import { useState } from 'react';
import type { Action } from '../../reducer';
import type { Column } from '../../types/stateTypes';
import JobCard from '../JobCard/JobCard';

interface KanbanColumnProps {
  column: Column;
  dispatch: React.ActionDispatch<[action: Action]>;
  removeColumn: (id: string) => Promise<void>;

  removeJobItem: (id: string) => Promise<void>;
}

const KanbanColumn = ({
  column,
  removeColumn,
  removeJobItem,
  dispatch,
}: KanbanColumnProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleRemoveColumn = async (id: string) => {
    setIsLoading(true);
    try {
      await removeColumn(id);
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          error: `Unable to Remove Column: ${err instanceof Error ? err.message : 'unknown error'}`,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="column w-90 bg-zinc-400 border aspect-2/3 shrink-0  ">
      {isLoading && <h1 className="flex justify-center">loading...</h1>}
      <div className="column-name border-b text-center font-bold relative flex justify-center items-center ">
        <button className="mr-2">&#9998;</button>
        {column.name.toUpperCase()}{' '}
        <span className="jobCount">({column.jobCount})</span>
        <button
          className="delete-button w-4 h-4 hover:w-5 hover:h-5  absolute top-1 right-1 flex justify-center items-center "
          onClick={async () => await handleRemoveColumn(column.id)}
        >
          x
        </button>
      </div>
      <div className="job-section p-2 flex flex-col gap-2 shrink-0 overflow-y-auto">
        {column.jobItems.map((item) => (
          <JobCard
            jobItem={item}
            key={item.id}
            removeJobItem={removeJobItem}
            dispatch={dispatch}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
