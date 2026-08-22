import { useEffect, useReducer } from 'react';
import { initialState, reducer } from './reducer';
import { fetchColumns, fetchMe } from './api';
import Header from './components/Header/Header';
import { useNavigate } from 'react-router';
import KanbanColumn from './components/KanbanColumn/KanbanColumn';

import ColumnCreatorForm from './components/ColumnCreatorForm/ColumnCreatorForm';
import JobItemCreatorModal from './components/JobModalLayout/JobItemCreatorModal/JobItemCreatorModal';
import { AppContext } from './context/AppContext';

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

  return (
    <AppContext.Provider value = {{appState, dispatch}}>

    
    <div className="flex flex-col ">
      {appState.user && <Header user={appState.user} dispatch={dispatch} />}
      <main className="px-3">
        <div className="column-section w-full mt-5 px-5 bg-zinc-300 flex gap-2 overflow-x-auto">

          

          {appState.columns && (
            <>
              {appState.columns.map((column) => (
                <KanbanColumn
               
                  column={column}
                  key={column.id}
                />
              ))}
              <ColumnCreatorForm
            
              />
            </>
          )}
        </div>
      </main>
      {appState.isModalOpen && (
        <JobItemCreatorModal
          appState={appState}
          dispatch={dispatch}
        />
      )}
      {appState.isLoading && <h1 className="font-bold self-center">loading...</h1>}
      {appState.error && (
            <h1 className="text-red-500 font-bold">{appState.error}</h1>
          )}
    </div>
    </AppContext.Provider>
  );
};

export default App;
