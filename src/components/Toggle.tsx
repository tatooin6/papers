import toggleOn from "../assets/toggle-on.svg";
import toggleOff from "../assets/toggle-off.svg";

type ToggleProps = {
  activated: boolean;
  incomingOnClick: () => void;
}

const Toggle = ({ activated, incomingOnClick }: ToggleProps) => {

  return (
    <button
      type="button"
      className="inline-flex items-center justify-center p-0 border-none bg-transparent cursor-pointer transition-opacity duration-150 ease-in-out hover:opacity-70 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500"
      onClick={() => incomingOnClick()}
    >
      {
        activated
          ? <img
            src={toggleOn}
            alt=""
            className="h-[2em] w-auto shrink-0"
            aria-hidden="true"
          />
          : <img
            src={toggleOff}
            alt=""
            className="h-[2em] w-auto shrink-0"
            aria-hidden="true"
          />
      }
    </button>
  )
}

export default Toggle
