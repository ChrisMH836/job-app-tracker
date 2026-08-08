import { useEffect, useReducer } from 'react';
import { initialState, reducer } from './reducer';
import { fetchColumns, fetchMe } from './api';
import Header from './components/Header/Header';
import type { Column } from './types/stateTypes';
import KanbanColumn from './components/KanbanColumn/KanbanColumn';

const App = () => {
  const testColumns: Column[] = [
    {
      id: 'col-1',
      name: 'SAVED',
      order: 1,
      jobCount: 2,
      jobItems: [
        {
          id: 'job-1',
          company: 'Google',
          title: 'Frontend Engineer',
          deadline: new Date('2026-09-01'),
          minSalary: 120000,
          maxSalary: 150000,
          notes: 'Found via LinkedIn',
          order: 1,
          columnId: 'col-1',
          offer: null,
        },
        {
          id: 'job-2',
          company: 'Meta',
          title: 'Software Engineer',
          deadline: new Date('2026-09-15'),
          minSalary: 130000,
          maxSalary: 160000,
          notes: 'Employee referral possible',
          order: 2,
          columnId: 'col-1',
          offer: null,
        },
      ],
    },
    {
      id: 'col-2',
      name: 'APPLIED',
      order: 2,
      jobCount: 2,
      jobItems: [
        {
          id: 'job-3',
          company: 'Apple',
          title: 'iOS Developer',
          deadline: new Date('2026-08-20'),
          minSalary: 140000,
          maxSalary: 170000,
          notes: 'Applied via company portal',
          order: 1,
          columnId: 'col-2',
          offer: null,
        },
        {
          id: 'job-4',
          company: 'Amazon',
          title: 'SDE II',
          deadline: new Date('2026-08-25'),
          minSalary: 135000,
          maxSalary: 165000,
          notes: 'Recruiter reached out on email',
          order: 2,
          columnId: 'col-2',
          offer: null,
        },
      ],
    },
    {
      id: 'col-3',
      name: 'OFFERED',
      order: 3,
      jobCount: 2,
      jobItems: [
        {
          id: 'job-5',
          company: 'Stripe',
          title: 'Full Stack Engineer',
          deadline: new Date('2026-08-10'),
          minSalary: 150000,
          maxSalary: 180000,
          notes: 'Great interview experience',
          order: 1,
          columnId: 'col-3',
          offer: {
            id: 'off-1',
            title: 'Full Stack Engineer Offer',
            startDate: new Date('2026-10-01'),
            endDate: new Date('2026-10-15'),
            salary: 165000,
          },
        },
        {
          id: 'job-6',
          company: 'Netflix',
          title: 'UI Engineer',
          deadline: new Date('2026-08-05'),
          minSalary: 180000,
          maxSalary: 210000,
          notes: 'Top choice',
          order: 2,
          columnId: 'col-3',
          offer: {
            id: 'off-2',
            title: 'UI Engineer Offer',
            startDate: new Date('2026-10-15'),
            endDate: new Date('2026-10-30'),
            salary: 195000,
          },
        },
      ],
    },
  ];
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
  return (
    <div>
      <Header />
      <main className="px-3">
        <div className="column-section w-full mt-5 px-5 bg-zinc-300 flex gap-2 overflow-x-auto">
          {appState.columns.map((testColumn) => (
            <KanbanColumn column={testColumn} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
