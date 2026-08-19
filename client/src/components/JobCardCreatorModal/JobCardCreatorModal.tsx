import { useRef, useState } from 'react';
import type { AppState } from '../../types/stateTypes';
import type { Priority } from '../../types/stateTypes';
import type { Action } from '../../reducer';

interface JobCardCreatorModalProps {
  appState: AppState;
  createJobItem: (
    columnId: string,
    title: string,
    company: string,
    deadline?: Date,
    notes?: string,
    priority?: Priority,
    minSalary?: number,
    maxSalary?: number,

    order?: number,
  ) => Promise<void>;
  dispatch: React.ActionDispatch<[action: Action]>;
}
const JobCardCreatorModal = ({
  appState,
  createJobItem,
  dispatch,
}: JobCardCreatorModalProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [salaryHasRange, setSalaryHasRange] = useState<boolean>(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const deadlineRef = useRef<HTMLInputElement>(null);
  const priorityRef = useRef<HTMLSelectElement>(null);
  const minSalaryRef = useRef<HTMLInputElement>(null);
  const maxSalaryRef = useRef<HTMLInputElement>(null);
  const columnRef = useRef<HTMLSelectElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  const setSalaryRefs = (node: HTMLInputElement | null) => {
    minSalaryRef.current = node;
    maxSalaryRef.current = node;
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const title = titleRef.current?.value;
    const company = companyRef.current?.value;
    const deadline = deadlineRef.current?.valueAsDate;
    const priority = priorityRef.current?.value as Priority | undefined;
    const minSalary = Number(minSalaryRef.current?.value);
    const maxSalary = Number(minSalaryRef.current?.value);
    const columnId = columnRef.current?.value;
    const notes = notesRef.current?.value;

    if (!title || !company || !columnId || deadline === null) {
      setError('Please fill in required fields');
      setIsLoading(false);
      return;
    }
    try {
      await createJobItem(
        columnId,
        title,
        company,
        deadline,
        notes,
        priority,
        minSalary,
        maxSalary,
      );
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          error: `Unable to create Application: ${err instanceof Error ? err.message : 'unknown error'}`,
        },
      });
    } finally {
      dispatch({ type: 'CLOSE_MODAL' });
      setIsLoading(false);
    }
  };
  return (
    <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
      <form
        className="modal max-w-230 p-5 bg-slate-200 rounded-2xl fixed inset-25 overflow-y-auto flex flex-col gap-3 justify-center overflow-hidden "
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-center mb-5">
          Create Application
        </h1>
        <button
          className="delete-button w-8 h-8 bg-rose-400 hover:bg-rose-500 rounded absolute right-5 top-5 flex justify-center items-center "
          onClick={() => dispatch({ type: 'CLOSE_MODAL' })}
        >
          x
        </button>
        {isLoading ? (
          <h1 className="flex justify-center">loading...</h1>
        ) : error ? (
          <h1 className="font-bold text-red-400 flex justify-center">
            {error}
          </h1>
        ) : (
          ''
        )}
        <div className="form-row flex gap-5 justify-between">
          <div className="form-input flex-3 flex flex-col">
            <label htmlFor="title">
              Job Title<span className="text-red-600">*</span>
            </label>
            <input
              className="h-12 px-2 border-2 rounded-lg"
              id="title"
              ref={titleRef}
            />
          </div>
          <div className="form-input flex-2 flex flex-col">
            <label htmlFor="company">
              Company<span className="text-red-600">*</span>
            </label>
            <input
              className="h-12 px-2 border-2 rounded-lg"
              id="company"
              ref={companyRef}
            />
          </div>
        </div>
        <div className="form-row flex gap-5 justify-between">
          <div className="form-input flex-3 flex flex-col">
            <label htmlFor="deadline">Deadline</label>
            <input
              type="date"
              className="h-12 px-2 border-2 rounded-lg"
              id="deadline"
              ref={deadlineRef}
            />
          </div>
          <div className="form-input flex-2 flex flex-col">
            <label htmlFor="priority">Priority</label>
            <select id="priority" className="border-2 h-12" ref={priorityRef}>
              <option value={'NONE'}>---</option>
              <option value={'LOW'}>Low</option>
              <option value={'MEDIUM'}>Medium</option>
              <option value={'HIGH'}>High</option>
            </select>
          </div>
        </div>

        <div className="form-row flex justify-between">
          {!salaryHasRange ? (
            <div className="form-input flex-3 flex flex-col">
              <div className="header-row flex gap-2">
                <label htmlFor="salary"> Salary</label>
                <p
                  className="text-sm pt-0.5 text-blue-700 underline hover:font-bold hover:text-blue-800"
                  onClick={() => setSalaryHasRange(true)}
                >
                  Salary Range
                </p>
              </div>
              <input
                className="max-w-40 h-12 px-2 border-2 rounded-lg"
                id="salary"
                ref={setSalaryRefs}
              />
            </div>
          ) : (
            <div className="form-salary flex flex-col ">
              <div className="header-row flex gap-2 justify-center">
                <div className="">Salary Range</div>
                <p
                  className="text-sm pt-0.5 text-blue-700 underline hover:font-bold hover:text-blue-800"
                  onClick={() => setSalaryHasRange(false)}
                >
                  Salary
                </p>
              </div>

              <div className="input-row flex gap-2 items-center">
                <div className="form-input flex flex-col gap-0">
                  <label htmlFor="salary"> min </label>
                  <input
                    className="max-w-20 h-8 px-2 border-2 rounded-lg"
                    id="salary"
                    ref={minSalaryRef}
                  />
                </div>
                <span className="font-bold text-2xl"> - </span>
                <div className="form-input flex flex-col gap-0">
                  <label htmlFor="salary"> max </label>
                  <input
                    className="max-w-20 h-8 px-2 border-2 rounded-lg"
                    id="salary"
                    ref={maxSalaryRef}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="form-input w-62 flex flex-col">
            <label htmlFor="column">column</label>
            <select id="column" className="border-2 h-12" ref={columnRef}>
              <option value={'NONE'}>---</option>
              {appState.columns.map((column) => (
                <option value={column.id}>{column.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row ">
          <div className="form-input flex-1 flex flex-col">
            <label htmlFor="notes">notes</label>
            <textarea
              className="h-50 p-2 border-2 rounded-lg"
              id="notes"
              ref={notesRef}
            />
          </div>
        </div>
        <button
          type="submit"
          className=" h-10 p-5 text-center self-center bg-emerald-400 rounded hover:bg-emerald-600 "
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default JobCardCreatorModal;
