import { useEffect, useRef, useState } from "react";
import RemovableBadge from "./components/badge";

const panelClass =
  "w-full max-w-[760px] rounded-xl border border-slate-400/20 bg-slate-800/95 shadow-[0_24px_70px_rgba(2,6,23,0.38)]";

const primaryButtonClass =
  "inline-flex min-h-12 items-center justify-center rounded-full border-0 bg-violet-600 px-[22px] font-bold leading-none text-white transition-all duration-200 ease-in-out hover:-translate-y-px hover:bg-violet-300 hover:text-slate-950 hover:shadow-[0_12px_28px_rgba(124,58,237,0.35)] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-violet-300/45 disabled:cursor-not-allowed disabled:opacity-65 disabled:grayscale";

function App() {
  const [participantInput, setParticipantInput] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [editIndex, setEditIndex] = useState<number>();
  const [editing, setEditing] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffleResult, setShuffleResult] = useState<string[]>([]);
  const [pageViews, setPageViews] = useState<number>();
  const viewCounterRequested = useRef(false);

  useEffect(() => {
    if (viewCounterRequested.current) return;
    viewCounterRequested.current = true;

    const tabViewKey = "papers-page-view-counted";
    const navigationEntry =
      typeof performance.getEntriesByType === "function"
        ? (performance.getEntriesByType(
            "navigation",
          )[0] as PerformanceNavigationTiming | undefined)
        : undefined;
    const isReload = navigationEntry?.type === "reload";
    const hasCountedThisTab = sessionStorage.getItem(tabViewKey) === "true";

    const loadPageViews = async () => {
      try {
        if (isReload || hasCountedThisTab) {
          const response = await fetch("/api/page-views");
          const data = (await response.json()) as { views?: number };
          setPageViews(data.views ?? 0);
          return;
        }

        sessionStorage.setItem(tabViewKey, "true");
        const response = await fetch("/api/page-views", { method: "POST" });
        const data = (await response.json()) as { views?: number };
        setPageViews(data.views ?? 0);
      } catch {
        setPageViews(undefined);
      }
    };

    void loadPageViews();
  }, []);

  const addFunction = () => {
    if (participantInput === "") return;
    setParticipants([...participants, participantInput]);
    setShuffleResult([]);
    setParticipantInput("");
  };

  const removeItem = (index: number) => {
    const newArr = [...participants];
    newArr.splice(index, 1);
    setParticipants(newArr);
    setShuffleResult([]);
  };

  const editParticipant = (index: number) => {
    setEditing(true);
    setEditIndex(index);
    const toEdit = participants[index];
    setParticipantInput(toEdit);
  };

  const editParticipantName = () => {
    const tempParticipants = [...participants];
    if (typeof editIndex === "undefined") return;
    tempParticipants[editIndex] = participantInput;
    setParticipants(tempParticipants);
    setShuffleResult([]);
    setParticipantInput("");
    setEditing(false);
  };

  const sortParticipants = () => {
    if (participants.length < 2) return;

    setIsShuffling(true);
    const array = [...participants];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    setShuffleResult(array);
    window.setTimeout(() => setIsShuffling(false), 520);
  };

  return (
    <>
      <main className="flex w-full flex-1 flex-col items-center justify-center gap-[22px] py-8 max-sm:justify-start max-sm:py-[18px]">
        <section
          className={`${panelClass} grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4.5 p-7 max-sm:grid-cols-1 max-sm:p-5.5`}
        >
          <div className="flex min-w-0 flex-col gap-3">
            <h1 className="m-0 text-[clamp(2.4rem,8vw,4.75rem)] leading-[0.95] font-extrabold tracking-normal text-slate-50">
              Papers
            </h1>
            <p className="m-0 text-[0.96rem] text-slate-400">
              Insert a participant name:
            </p>
            <input
              className="min-h-13 w-full rounded-full border border-slate-400/20 bg-slate-950/70 px-4.5 text-slate-50 outline-3 outline-transparent transition-[border-color,box-shadow,outline-color] duration-200 placeholder:text-slate-500 focus:border-violet-300 focus:shadow-[0_0_0_5px_rgba(124,58,237,0.12)] focus:outline-violet-600/20"
              type="text"
              placeholder="insert a name"
              value={participantInput}
              onChange={(e) => setParticipantInput(e.target.value)}
            />
          </div>
          {!editing && (
            <button
              type="button"
              className={`${primaryButtonClass} max-sm:w-full`}
              onClick={() => addFunction()}
            >
              Add
            </button>
          )}
          {editing && (
            <button
              type="button"
              className={`${primaryButtonClass} max-sm:w-full`}
              onClick={() => editParticipantName()}
            >
              Edit
            </button>
          )}
        </section>

        <section className={`${panelClass} overflow-hidden`}>
          <div className="grid gap-4 p-7 max-sm:p-5.5">
            <h2 className="m-0 mb-1 text-[clamp(1.35rem,3vw,2rem)] leading-tight font-bold text-slate-50">
              Participants
            </h2>
            <div
              className={`grid gap-3 ${isShuffling ? "is-shuffling" : ""}`}
              aria-live="polite"
            >
              <p className="m-0 flex min-h-13.5 items-center gap-2.5 rounded-xl border border-slate-400/15 bg-slate-900 px-3.5 py-3.5 pl-4.5 text-slate-50 shadow-[0_14px_35px_rgba(2,6,23,0.25)] max-sm:flex-wrap">
                {participants.map((participant, index) => (
                  <RemovableBadge
                    textValue={participant}
                    key={index}
                    index={index}
                    removeItemCallback={removeItem}
                    editItemCallback={editParticipant}
                  />
                ))}
              </p>
            </div>
            {participants.length === 0 && (
              <p className="m-0 rounded-xl border border-dashed border-slate-400/20 bg-slate-900/55 px-4 py-5 text-center text-slate-400">
                Add participants to start the raffle.
              </p>
            )}
            {shuffleResult.length > 0 && (
              <ol className="m-0 grid list-decimal gap-2 rounded-xl border border-slate-400/15 bg-slate-950/45 px-6 py-4 text-sm text-slate-200 shadow-[0_14px_35px_rgba(2,6,23,0.18)]">
                {shuffleResult.map((participant, index) => (
                  <li key={`${participant}-${index}`}>{participant}</li>
                ))}
              </ol>
            )}
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                className="inline-flex min-h-14.5 w-full max-w-55 items-center justify-center rounded-full border-0 bg-linear-to-br from-violet-600 to-fuchsia-700 px-8.5 text-[1.08rem] leading-none font-bold text-white shadow-[0_18px_38px_rgba(124,58,237,0.38)] transition-all duration-200 ease-in-out hover:scale-105 hover:from-violet-500 hover:to-pink-600 hover:shadow-[0_22px_46px_rgba(192,38,211,0.34)] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-violet-300/45 disabled:cursor-not-allowed disabled:opacity-65 disabled:grayscale"
                onClick={() => sortParticipants()}
                disabled={participants.length < 2}
              >
                Shuffle
              </button>
              {shuffleResult.length > 0 && (
                <button
                  type="button"
                  className="inline-flex min-h-14.5 w-full max-w-55 items-center justify-center rounded-full border border-slate-400/20 bg-slate-900 px-8.5 text-[1.08rem] leading-none font-bold text-slate-200 transition-all duration-200 ease-in-out hover:-translate-y-px hover:border-violet-300/45 hover:text-violet-200 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-violet-300/45"
                  onClick={() => setShuffleResult([])}
                >
                  Clear list
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="flex w-full shrink-0 flex-wrap items-center justify-center gap-x-4 gap-y-1 pb-5 text-xs leading-none text-slate-500/80 max-sm:pb-4">
        <a
          className="text-slate-500/90 no-underline transition-colors duration-200 hover:text-violet-300"
          href="https://tato-portfolio.vercel.app/"
          target="_blank"
        >
          Visit Tato
        </a>
        {typeof pageViews === "number" && (
          <span>{pageViews.toLocaleString()} views</span>
        )}
      </footer>
    </>
  );
}

export default App;
