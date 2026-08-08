import type { JobItem } from '../../types/stateTypes';

interface JobCardProps {
  jobItem: JobItem;
}

const JobCard = ({ jobItem }: JobCardProps) => {
  return (
    <div className="jobItem p-3 bg-zinc-100 rounded shadow-[0_0_2px_2px_rgba(0,0,0,0.1)] flex gap-2 ">
      <div className="job-item-image-wrapper w-14 h-14 rounded border-2"></div>
      <div className="job-info">
        <div className="job-title text-lg font-bold">{jobItem.title}</div>
        <div className="company">{jobItem.company}</div>
      </div>
    </div>
  );
};

export default JobCard;
