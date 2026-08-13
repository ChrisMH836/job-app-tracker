import { useEffect, useReducer } from 'react';
import { initialState, reducer } from './reducer';
import {
  createJobItemApi,
  fetchColumns,
  fetchMe,
  removeColumnApi,
  removeJobItemApi,
  updateColumnApi,
  updateJobItemApi,
} from './api';
import Header from './components/Header/Header';
import { useNavigate } from 'react-router';
import KanbanColumn from './components/KanbanColumn/KanbanColumn';
import { useKanban } from './hooks/useKanban';

const App = () => {
  const [appState, dispatch] = useReducer(reducer, initialState);
  const { createColumn } = useKanban(dispatch);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      dispatch({ type: 'FETCH_START' });
      try {
        const user = await fetchMe();
        const columns = await fetchColumns();
        dispatch({ type: 'FETCH_SUCCESS', payload: { user, columns } });
      } catch (err) {
        navigate('/auth/login', {
          replace: true,
          state: {
            err:
              err instanceof Error
                ? err.message
                : 'An error occured. Try again',
          },
        });
      }
    };
    loadData();
  }, [navigate]);

  return (
    <div>
      {appState.user && <Header user={appState.user} />}
      <main className="px-3">
        <div className="column-section w-full mt-5 px-5 bg-zinc-300 flex gap-2 overflow-x-auto">
          {appState.columns.map((column) => (
            <KanbanColumn column={column} key={column.id} />
          ))}
        </div>
        <button
          onClick={async () => {
            console.log('creating column...');
            await createColumn('Test TWO', 1);
          }}
          className="p-2 bg-red-400 rounded hover:bg-red-600 m-2"
        >
          Test createColumn
        </button>
        <button
          onClick={async () => {
            console.log('updating column...');
            const columns = await updateColumnApi(
              'a35f6cfc-bb27-4038-97ab-ca3878320371',
              'UPDATED',
              100,
            );
            console.log(columns);
            dispatch({ type: 'SET_COLUMNS', payload: { columns } });
          }}
          className="p-2 m-2 bg-red-400 rounded hover:bg-red-600"
        >
          Test updateColumn
        </button>
        <button
          onClick={async () => {
            console.log('removing column...');
            const columns = await removeColumnApi(
              'a35f6cfc-bb27-4038-97ab-ca3878320371',
            );
            console.log(columns);
            dispatch({ type: 'SET_COLUMNS', payload: { columns } });
          }}
          className="p-2 m-2 bg-red-400 rounded hover:bg-red-600"
        >
          Test removeColumn
        </button>
        <button
          onClick={async () => {
            console.log('creating jobItem...');
            const columns = await createJobItemApi(
              'a35f6cfc-bb27-4038-97ab-ca3878320371',
              'Test Title',
              'test company',
              new Date(),
              'Test Notes',
              'APPLIED',
              0,
              1000,
              100,
            );
            console.log(columns);
            dispatch({ type: 'SET_COLUMNS', payload: { columns } });
          }}
          className="p-2 bg-red-400 rounded hover:bg-red-600 m-2"
        >
          Test createJobItem
        </button>
        <button
          onClick={async () => {
            console.log('updating jobItem...');
            const columns = await updateJobItemApi(
              '42c3eb89-d7d1-4048-9c73-77e3ae9938ec',
              undefined,
              'updated Title',
              'updated company',
              new Date(),
              'updated Notes',
              'APPLIED',
              200,
              2000,
            );
            console.log(columns);
            dispatch({ type: 'SET_COLUMNS', payload: { columns } });
          }}
          className="p-2 bg-red-400 rounded hover:bg-red-600 m-2"
        >
          Test updateJobItem
        </button>
        <button
          onClick={async () => {
            console.log('removing jobItem...');
            const columns = await removeJobItemApi(
              '42c3eb89-d7d1-4048-9c73-77e3ae9938ec',
            );
            console.log(columns);
            dispatch({ type: 'SET_COLUMNS', payload: { columns } });
          }}
          className="p-2 bg-red-400 rounded hover:bg-red-600 m-2"
        >
          Test removeJobItem
        </button>
      </main>
    </div>
  );
};

export default App;
