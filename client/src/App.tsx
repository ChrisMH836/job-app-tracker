import { useEffect, useReducer } from 'react';
import { initialState, reducer } from './reducer';
import { fetchColumns, fetchMe } from './api';

const App = () => {
  const [appState, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const loadData = async () => {
      dispatch({ type: 'FETCH_START' });
      try {
        const user = await fetchMe();
        const columns = await fetchColumns();
        dispatch({ type: 'FETCH_SUCCESS', payload: { user, columns } });
      } catch (error) {
        dispatch({
          type: 'FETCH_ERROR',
          payload: {
            error:
              error instanceof Error
                ? error.message
                : 'API error: unable to fetch user',
          },
        });
      }
    };
    loadData();
  }, []);
  useEffect(() => {
    console.log('Current App State:', appState);
  }, [appState]);
  return <div></div>;
};

export default App;
