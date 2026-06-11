interface RemovableBadgeProps {
  textValue: string;
  index: number;
  editLabel: string;
  removeLabel: string;
  removeItemCallback: (index: number) => void;
  editItemCallback: (index: number) => void;
}

const RemovableBadge = ({
  textValue,
  index,
  editLabel,
  removeLabel,
  removeItemCallback,
  editItemCallback
}: RemovableBadgeProps) => {
  return (
    <span
      key={index}
      className="inline-flex items-center gap-x-1.5 rounded-md bg-[#1A1A1A] px-2 py-1 text-xs font-medium text-[#F4F1EA] ring-1 ring-inset ring-[#1A1A1A]/20"
    >
      {textValue}
      <button
        type="button"
        onClick={() => editItemCallback(index)}
        className="group relative -mr-1 flex h-3.5 w-3.5 items-center justify-center rounded-sm text-[#F4F1EA]/70 hover:bg-[#F4F1EA]/15 hover:text-[#F4F1EA]"
      >
        <span className="sr-only">{editLabel}</span>
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
        className="group relative -mr-1 flex h-3.5 w-3.5 items-center justify-center rounded-sm text-[#F4F1EA]/70 hover:bg-[#F4F1EA]/15 hover:text-[#F4F1EA]"
      >
        <span className="sr-only">{removeLabel}</span>
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
