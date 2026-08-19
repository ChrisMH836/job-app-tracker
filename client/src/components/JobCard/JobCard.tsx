import { useState } from 'react';
import type { Action } from '../../reducer';
import type { JobItem } from '../../types/stateTypes';

interface JobCardProps {
  jobItem: JobItem;
  removeJobItem: (id: string) => Promise<void>;
  dispatch: React.ActionDispatch<[action: Action]>;
}

const JobCard = ({ jobItem, removeJobItem, dispatch }: JobCardProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleRemoveJobItem = async (id: string) => {
    setIsLoading(true);
    try {
      await removeJobItem(id);
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          error: ` unable to remove Application: ${err instanceof Error ? err.message : 'unknown error'}`,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="jobItem p-3 bg-zinc-100 rounded shadow-[0_0_2px_2px_rgba(0,0,0,0.1)] flex gap-2 relative">
      {isLoading && <h1 className="flex justify-center">loading...</h1>}
      <button
        className="delete-button w-4 h-4 hover:w-5 hover:h-5  absolute top-1 right-1 flex justify-center items-center text-lg "
        onClick={async () => await handleRemoveJobItem(jobItem.id)}
      >
        x
      </button>
      <div className="job-item-image-wrapper w-14 h-14 rounded border-2"></div>
      <div className="job-info">
        <div className="job-title text-lg font-bold">{jobItem.title}</div>
        <div className="company">{jobItem.company}</div>
      </div>
    </div>
  );
};

export default JobCard;
