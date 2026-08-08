const Header = () => {
  return (
    <header className="px-5 h-20  border-b-2 border-zinc-400 flex items-center">
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
      <div className="right-section">
        <div className="profile bg-emerald-500 text-2xl text-white font-bold w-15 h-15  rounded-lg flex justify-center items-center">
          C
        </div>
      </div>
    </header>
  );
};

export default Header;
