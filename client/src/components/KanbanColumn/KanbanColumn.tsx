import { useState } from 'react';

import type { Column } from '../../types/stateTypes';
import JobCard from '../JobCard/JobCard';
import { useAppContext } from '../../context/AppContext';
import { useKanban } from '../../hooks/useKanban';

interface KanbanColumnProps {
  column: Column;
}

const KanbanColumn = ({
  column,
}: KanbanColumnProps) => {
  //local states and context
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(column.name);
  const {appState, dispatch} = useAppContext();

  const {removeColumn, updateColumn} = useKanban(appState, dispatch);

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
  const handleUpdateName = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const name = nameInput;
    if (!name) {
      setError('Please enter a column name');
      setIsLoading(false);
      return;
    }
    if (name === column.name) {
      setIsLoading(false);
      setIsEditing(false);
      return;
    }
    try {
      await updateColumn(column.id, name);
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          error: `unable to update column: ${err instanceof Error ? err.message : 'Unknown error'}`,
        },
      });
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
    return;
  };
  return (
    <div className="column w-90 bg-zinc-400 border aspect-2/3 shrink-0  ">
      <div className="column-name border-b text-center font-bold relative flex justify-center items-center ">
        {isEditing ? (
          <form
            className="flex flex-col justify-center"
            onSubmit={handleUpdateName}
          >
            {isLoading ? (
              <h1 className="flex justify-center">loading...</h1>
            ) : error ? (
              <h1 className="flex justify-center text-red-400">{error}</h1>
            ) : (
              ''
            )}
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="text-center"
            />
          </form>
        ) : (
          <>
            <button className="mr-2" onClick={() => setIsEditing(true)}>
              &#9998;
            </button>
            {column.name.toUpperCase()}{' '}
            <span className="jobCount">({column.jobCount})</span>
            <button
              className="delete-button w-4 h-4 hover:w-5 hover:h-5  absolute top-1 right-1 flex justify-center items-center "
              onClick={async () => await handleRemoveColumn(column.id)}
            >
              x
            </button>
          </>
        )}
      </div>
      <div className="job-section p-2 flex flex-col gap-2 shrink-0 overflow-y-auto">
        {column.jobItems.map((item) => (
          <JobCard
            jobItem={item}
            key={item.id}
            dispatch={dispatch}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
