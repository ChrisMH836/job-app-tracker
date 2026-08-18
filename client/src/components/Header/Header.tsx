import type { Action } from '../../reducer';
import type { User } from '../../types/stateTypes';

interface HeaderProps {
  user: User;
  dispatch: React.ActionDispatch<[action: Action]>;
}
const Header = ({ user, dispatch }: HeaderProps) => {
  return (
    <header className="px-5 py-2 border-b-2 border-zinc-400 flex flex-col items-center">
      <div className=" upper-header w-full h-20 p-4 flex">
        <div className="left-section">
          <span className="text-4xl font-bold">Jobly</span>
        </div>
        <div className=" middle-section flex-1 flex justify-center">
          <div className="tabs text-white flex gap-4">
            <button className=" tab kanban-tab px-5 py-2 bg-zinc-500  rounded">
              Kanban
            </button>
            <button className=" tab grid-tab px-5 py-2 bg-zinc-500  rounded">
              grid
            </button>
            <button className=" tab documents-tab px-5 py-2 bg-zinc-500  rounded">
              documents
            </button>
          </div>
        </div>
        <div className="right-section flex items-center">
          <div className="profile bg-emerald-500 text-2xl text-white font-bold w-15 h-15  rounded-lg flex justify-center items-center">
            {user?.name[0].toUpperCase()}
          </div>
        </div>
      </div>
      <div className="lower-header flex">
        <button
          className=" h-10 bg-emerald-400 p-2 rounded hover:bg-emerald-600 "
          onClick={() => dispatch({ type: 'OPEN_MODAL' })}
        >
          Add application
        </button>
      </div>
    </header>
  );
};

export default Header;
