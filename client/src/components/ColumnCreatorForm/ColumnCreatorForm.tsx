import { useRef } from 'react';

interface ColumnCreatorFormProps {
  createColumn: (name: string, order?: number) => Promise<void>;
}
const ColumnCreatorForm = ({ createColumn }: ColumnCreatorFormProps) => {
  const onCreateColumn = async (e: React.SubmitEvent<HTMLFormElement>) => {
    //prevent apge refresh
    e.preventDefault();
    //collect form data
    const name = columnNameRef.current?.value;
    //check for empty fields
    if (!name) return;
    await createColumn(name, undefined);
  };
  const columnNameRef = useRef<HTMLInputElement>(null);
  return (
    <form
      onSubmit={onCreateColumn}
      className="create-column-form w-90 shrink-0 h-full p-2 bg-zinc-400 border-2 rounded flex items-center gap-2  "
    >
      <input
        ref={columnNameRef}
        placeholder="create new column"
        className="w-full h-10 p-1 bg-white"
        type="text"
        id="name"
      />
      <button
        type="submit"
        className="w-10 shrink-0 h-10 border-2 text-4xl rounded flex text-center justify-center items-center"
      >
        +
      </button>
    </form>
  );
};

export default ColumnCreatorForm;
