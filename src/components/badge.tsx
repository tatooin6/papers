interface RemovableBadgeProps {
  textValue: string;
  index: number;
  removeItemCallback: (index: number) => void;
  editItemCallback: (index: number) => void;
}

const RemovableBadge = ({
  textValue,
  index,
  removeItemCallback,
  editItemCallback
}: RemovableBadgeProps) => {
  return (
    <span
      key={index}
      className="inline-flex items-center gap-x-1.5 rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
    >
      {textValue}
      <button
        type="button"
        onClick={() => editItemCallback(index)}
        className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-gray-500/20 flex items-center justify-center text-gray-400 hover:text-gray-600"
      >
        <span className="sr-only">Editar</span>
        <svg
          viewBox="0 0 14 14"
          className="h-3.5 w-3.5 stroke-current"
          fill="none"
        >
          <path
            d="M10.5 1.5l2 2-9 9-2.5.5.5-2.5 9-9z M9.5 2.5l2 2"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => removeItemCallback(index)}
        className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-gray-500/20 flex items-center justify-center text-gray-400 hover:text-gray-600"
      >
        <span className="sr-only">Remover</span>
        <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 stroke-current">
          <path
            d="M4 4l6 6m0-6l-6 6"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </span>
  );
};

export default RemovableBadge;
