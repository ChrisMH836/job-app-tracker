import { useEffect, useReducer } from 'react';
import { initialState, reducer } from './reducer';
import { fetchColumns, fetchMe } from './api';
import Header from './components/Header/Header';
import { useNavigate } from 'react-router';
import KanbanColumn from './components/KanbanColumn/KanbanColumn';

const App = () => {
  const [appState, dispatch] = useReducer(reducer, initialState);
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
  useEffect(() => {
    console.log('Current App State:', appState);
  }, [appState]);
  return (
    <div>
      {appState.user && <Header user={appState.user} />}
      <main className="px-3">
        <div className="column-section w-full mt-5 px-5 bg-zinc-300 flex gap-2 overflow-x-auto">
          {appState.columns.map((column) => (
            <KanbanColumn column={column} key={column.id} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
