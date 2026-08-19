import { useEffect, useReducer } from 'react';
import { initialState, reducer } from './reducer';
import { fetchColumns, fetchMe } from './api';
import Header from './components/Header/Header';
import { useNavigate } from 'react-router';
import KanbanColumn from './components/KanbanColumn/KanbanColumn';
import { useKanban } from './hooks/useKanban';
import ColumnCreatorForm from './components/ColumnCreatorForm/ColumnCreatorForm';
import JobCardCreatorModal from './components/JobCardCreatorModal/JobCardCreatorModal';

const App = () => {
  const [appState, dispatch] = useReducer(reducer, initialState);
  const {
    createColumn,
    createJobItem,
    removeColumn,
    removeJobItem,
    updateColumn,
    updateJobItem,
  } = useKanban(appState, dispatch);

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
      {appState.user && <Header user={appState.user} dispatch={dispatch} />}
      <main className="px-3">
        <div className="column-section w-full mt-5 px-5 bg-zinc-300 flex gap-2 overflow-x-auto">
          {appState.isLoading && <h1>loading...</h1>}

          {appState.error && (
            <h1 className="text-red-500 font-bold">{appState.error}</h1>
          )}

          {!appState.isLoading && !appState.error && appState.columns && (
            <>
              {appState.columns.map((column) => (
                <KanbanColumn
                  removeColumn={removeColumn}
                  removeJobItem={removeJobItem}
                  column={column}
                  key={column.id}
                  dispatch={dispatch}
                />
              ))}
              <ColumnCreatorForm
                createColumn={createColumn}
                dispatch={dispatch}
              />
            </>
          )}
        </div>
      </main>
      {appState.isModalOpen && (
        <JobCardCreatorModal
          appState={appState}
          createJobItem={createJobItem}
          dispatch={dispatch}
        />
      )}
    </div>
  );
};

export default App;
