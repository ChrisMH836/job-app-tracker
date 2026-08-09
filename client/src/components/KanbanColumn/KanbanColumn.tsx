import type { Column } from '../../types/stateTypes';
import JobCard from '../JobCard/JobCard';
interface KanbanColumnProps {
  column: Column;
}

const KanbanColumn = ({ column }: KanbanColumnProps) => {
  return (
    <div className="column w-90 bg-zinc-400 border aspect-2/3 shrink-0">
      <div className="column-name border-b text-center font-bold ">
        {column.name.toUpperCase()}{' '}
        <span className="jobCount">({column.jobCount})</span>
      </div>
      <div className="job-section p-2 flex flex-col gap-2 shrink-0 overflow-y-auto">
        {column.jobItems.map((item) => (
          <JobCard jobItem={item} key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
