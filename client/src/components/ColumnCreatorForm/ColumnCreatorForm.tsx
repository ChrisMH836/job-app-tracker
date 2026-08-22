import { useRef, useState } from 'react';

import { useAppContext } from '../../context/AppContext';
import { useKanban } from '../../hooks/useKanban';


const ColumnCreatorForm = () => {

  //local states and context
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const {appState, dispatch} = useAppContext();

  const {createColumn} = useKanban(appState, dispatch);


  const handleCreateColumn = async (e: React.SubmitEvent<HTMLFormElement>) => {
    //prevent apge refresh
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    //collect form data
    const name = columnNameRef.current?.value;
    //check for empty fields
    if (!name) {
      setError('Please enter a column name');
      setIsLoading(false);
      return;
    }
    try {
      await createColumn(name, undefined);
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          error: `Unable to createColumn: ${err instanceof Error ? err.message : 'Unknow error'}`,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };
  const columnNameRef = useRef<HTMLInputElement>(null);
  return (
    <form
      onSubmit={handleCreateColumn}
      className="create-column-form w-90 shrink-0 h-full p-2 bg-zinc-400 border-2 rounded flex flex-col    "
    >
      {isLoading ? (
        <h1 className="self-center">Loading...</h1>
      ) : error ? (
        <h1 className="text-red-400 font-bold self-center">{error}</h1>
      ) : (
        ''
      )}

      <div className="flex items-center gap-2">
        <input
          ref={columnNameRef}
          placeholder="create new column"
          className="w-full h-10 p-1 bg-white"
          type="text"
          id="name"
        />
        <button
          type="submit"
          className="w-10 shrink-0 h-10 border-2 text-4xl rounded flex text-center justify-center items-center"
        >
          +
        </button>
      </div>
    </form>
  );
};

export default ColumnCreatorForm;
