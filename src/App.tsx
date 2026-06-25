import { useEffect, useRef, useState } from "react";
import RemovableBadge from "./components/badge";
import Modal from "./components/Modal";
import papelitosLogo from "./assets/papelitos-logo.svg";
import gearSettings from "./assets/gear-settings.svg";
import addButton from "./assets/add-button.svg";
import translations from "./translations.json";
import Toggle from "./components/Toggle";

type Language = "en" | "es";

const panelClass =
  "w-full max-w-[760px] rounded-xl border border-paper-ink/20 bg-paper-background/80 shadow-[0_22px_55px_rgba(26,26,26,0.16)]";

const primaryButtonClass =
  "inline-flex min-h-12 items-center justify-center rounded-full border border-paper-ink bg-paper-ink px-[22px] font-bold leading-none text-paper-background transition-all duration-200 ease-in-out hover:-translate-y-px hover:bg-paper-background hover:text-paper-ink hover:shadow-[0_12px_28px_rgba(26,26,26,0.18)] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-paper-ink/35 disabled:cursor-not-allowed disabled:opacity-55";

function App() {
  const [language, setLanguage] = useState<Language>("es");
  const [participantInput, setParticipantInput] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [stragglers, setStragglers] = useState<string[]>([]);
  const [editIndex, setEditIndex] = useState<number>();
  const [editing, setEditing] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffleResult, setShuffleResult] = useState<string[]>([]);
  const [pageViews, setPageViews] = useState<number>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuspenseActivated, setIsSuspenseActivated] = useState(false);
  const [useStragglers, setUseStragglers] = useState(true);
  const viewCounterRequested = useRef(false);
  const copy = translations[language];
  const appVersion =
    typeof __APP_VERSION__ === "undefined" ? "" : __APP_VERSION__;

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (viewCounterRequested.current) return;
    viewCounterRequested.current = true;

    const tabViewKey = "papers-page-view-counted";
    const readPageViewResponse = async (response: Response) => {
      if (!response.ok) {
        console.warn(
          "Page view counter unavailable: missing data/page-views.json.",
        );
        return undefined;
      }

      const data = (await response.json()) as { views?: number };
      if (typeof data.views !== "number") {
        console.warn("Page view counter unavailable: invalid response.");
        return undefined;
      }

      return data.views;
    };
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
          setPageViews(await readPageViewResponse(response));
          return;
        }

        sessionStorage.setItem(tabViewKey, "true");
        const response = await fetch("/api/page-views", { method: "POST" });
        setPageViews(await readPageViewResponse(response));
      } catch {
        setPageViews(undefined);
      }
    };

    void loadPageViews();
  }, []);

  const addParticipant = () => {
    if (participantInput === "") return;
    setParticipants([...participants, participantInput]);
    setShuffleResult([]);
    setParticipantInput("");
  };

  const removeParticipant = (index: number) => {
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

  const addStraggler = () => {
    if (participantInput === "") return;
    setStragglers([...stragglers, participantInput]);
    setParticipantInput("");
  };

  const addParticipantFromStragglers = () => {
    const [nextStraggler, ...remainingStragglers] = stragglers;
    if (!nextStraggler) return;

    setParticipants((currentParticipants) => [
      ...currentParticipants,
      nextStraggler,
    ]);
    setStragglers(remainingStragglers);
    setShuffleResult([]);
  };

  const fisherYatesShuffle = () => {
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
      <main className="flex w-full flex-1 flex-col items-center justify-center gap-5.5 py-8 max-sm:justify-start max-sm:py-4.5">
        <section
          className={`${panelClass} grid grid-cols-[minmax(0,1fr)_auto] grid-rows-[auto_1fr] items-stretch gap-x-4.5 gap-y-5 p-7 max-sm:grid-cols-1 max-sm:grid-rows-none max-sm:p-5.5`}
        >
          <div className="col-start-1 row-span-2 flex min-w-0 flex-col gap-3 max-sm:row-start-2 max-sm:row-span-1">
            <div className="flex items-center gap-3.5 max-sm:gap-3">
              <img
                src={papelitosLogo}
                alt=""
                className="h-[clamp(2.4rem,6vw,4.1rem)] w-auto shrink-0"
                aria-hidden="true"
              />
              <h1 className="m-0 text-[clamp(2.4rem,8vw,4.75rem)] leading-[0.95] font-extrabold tracking-normal text-paper-ink">
                {copy.appTitle}
              </h1>
            </div>
            <p className="m-0 text-[0.96rem] text-paper-ink/70">
              {copy.participantPrompt}
            </p>
            <input
              className="min-h-13 w-full rounded-full border border-paper-ink/25 bg-paper-background px-4.5 text-paper-ink outline-3 outline-transparent transition-[border-color,box-shadow,outline-color] duration-200 placeholder:text-paper-ink/45 focus:border-paper-ink/65 focus:shadow-[0_0_0_5px_rgba(26,26,26,0.09)] focus:outline-paper-ink/18"
              type="text"
              placeholder={copy.participantPlaceholder}
              value={participantInput}
              onChange={(e) => setParticipantInput(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="col-start-2 row-start-1 inline-flex cursor-pointer items-center justify-center justify-self-end self-start border-none bg-transparent p-0 transition-opacity duration-150 ease-in-out hover:opacity-70 focus:outline-2 focus:outline-offset-2 focus:outline-paper-focus max-sm:col-start-1 max-sm:row-start-1"
            onClick={() => setIsModalOpen(true)}
            aria-label={copy.settingsLabel}
          >
            <img
              src={gearSettings}
              alt=""
              className="h-[1.5em] w-auto shrink-0"
              aria-hidden="true"
            />
          </button>
          {!editing && (
            <div className="col-start-2 row-start-2 flex items-end justify-end gap-3 self-end max-sm:col-start-1 max-sm:row-start-3 max-sm:w-full max-sm:flex-wrap">
              <button
                type="button"
                className={`${primaryButtonClass} max-sm:flex-1`}
                onClick={() => addParticipant()}
              >
                {copy.addButton}
              </button>

              {useStragglers && (
                <button
                  type="button"
                  className={`${primaryButtonClass} max-sm:flex-1`}
                  onClick={() => addStraggler()}
                >
                  {copy.straggleButton}
                </button>
              )}
            </div>
          )}
          {editing && (
            <button
              type="button"
              className={`${primaryButtonClass} col-start-2 row-start-2 self-end max-sm:col-start-1 max-sm:row-start-3 max-sm:w-full`}
              onClick={() => editParticipantName()}
            >
              {copy.editButton}
            </button>
          )}
        </section>

        <section className={`${panelClass} overflow-hidden`}>
          <div className="grid gap-4 p-7 max-sm:p-5.5">
            <h2 className="m-0 mb-1 text-[clamp(1.35rem,3vw,2rem)] leading-tight font-bold text-paper-ink">
              {copy.participantsTitle} {participants.length > 0 ? <span>({participants.length})</span> : <></>}
            </h2>
            <div
              className={`grid gap-3 ${isShuffling ? "is-shuffling" : ""}`}
              aria-live="polite"
            >
              <p className="m-0 flex min-h-13.5 items-center gap-2.5 rounded-xl border border-paper-ink/18 bg-paper-background px-3.5 py-3.5 pl-4.5 text-paper-ink shadow-[0_14px_35px_rgba(26,26,26,0.12)] max-sm:flex-wrap">
                {participants.map((participant, index) => (
                  <RemovableBadge
                    textValue={participant}
                    key={index}
                    index={index}
                    editLabel={copy.editParticipant}
                    removeLabel={copy.removeParticipant}
                    removeItemCallback={removeParticipant}
                    editItemCallback={editParticipant}
                  />
                ))}
              </p>
            </div>
            {participants.length === 0 && (
              <p className="m-0 rounded-xl border border-dashed border-paper-ink/25 bg-paper-background/55 px-4 py-5 text-center text-paper-ink/62">
                {copy.emptyParticipants}
              </p>
            )}
            {shuffleResult.length > 0 && (
              <ol className="m-0 grid list-decimal gap-2 rounded-xl border border-paper-ink/18 bg-paper-background/70 px-6 py-4 text-sm text-paper-ink shadow-[0_14px_35px_rgba(26,26,26,0.1)]">
                {shuffleResult.map((participant, index) => (
                  <li key={`${participant}-${index}`}>{participant}</li>
                ))}
              </ol>
            )}
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                className="inline-flex min-h-14.5 w-full max-w-55 items-center justify-center rounded-full border border-paper-ink bg-paper-ink px-8.5 text-[1.08rem] leading-none font-bold text-paper-background shadow-[0_18px_38px_rgba(26,26,26,0.2)] transition-all duration-200 ease-in-out hover:scale-105 hover:bg-paper-background hover:text-paper-ink hover:shadow-[0_22px_46px_rgba(26,26,26,0.16)] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-paper-ink/35 disabled:cursor-not-allowed disabled:opacity-55"
                onClick={() => fisherYatesShuffle()}
                disabled={participants.length < 2}
              >
                {copy.shuffleButton}
              </button>
              {shuffleResult.length > 0 && (
                <button
                  type="button"
                  className="inline-flex min-h-14.5 w-full max-w-55 items-center justify-center rounded-full border border-paper-ink/30 bg-paper-background px-8.5 text-[1.08rem] leading-none font-bold text-paper-ink transition-all duration-200 ease-in-out hover:-translate-y-px hover:border-paper-ink hover:bg-paper-ink/8 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-paper-ink/35"
                  onClick={() => setShuffleResult([])}
                >
                  {copy.clearButton}
                </button>
              )}
            </div>
            {useStragglers && (
              <div>
                <div className="flex flex-row justify-between">
                  <h2 className="m-0 mb-1 text-[clamp(1.35rem,3vw,2rem)] leading-tight font-bold text-paper-ink">
                    {copy.stragglersTitle} {stragglers.length > 0 ? <span>({stragglers.length})</span> : <></>}
                  </h2>
                  <button
                    type="button"
                    className="inline-flex cursor-pointer items-center justify-center border-none bg-transparent p-0 transition-opacity duration-150 ease-in-out hover:opacity-70 focus:outline-2 focus:outline-offset-2 focus:outline-paper-focus disabled:cursor-not-allowed disabled:opacity-35"
                    onClick={() => addParticipantFromStragglers()}
                    disabled={stragglers.length === 0}
                    aria-label={copy.addStragglerToParticipants}
                  >
                    <img
                      src={addButton}
                      alt=""
                      className="h-[2em] w-auto shrink-0"
                      aria-hidden="true"
                    />
                  </button>
                </div>
                {stragglers.length > 0 && (
                  <ol className="m-0 grid list-decimal gap-2 rounded-xl border border-paper-ink/18 bg-paper-background/70 px-6 py-4 text-sm text-paper-ink shadow-[0_14px_35px_rgba(26,26,26,0.1)]">
                    {stragglers.map((straggler, index) => (
                      <li key={`${straggler}-${index}`}>{straggler}</li>
                    ))}
                  </ol>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalTitle={copy.configurationTitle}
        closeLabel={copy.closeDialog}
        doneLabel={copy.doneButton}
        children={(
          <>
            <div className="flex flex-row justify-between">
              <div>
                <p className="text-sm text-paper-ink/65">
                  {copy.selectLanguage}
                </p>
              </div>
              <div>
                <select
                  aria-label={copy.languageLabel}
                  className="col-start-2 row-start-1 min-h-10 w-42 justify-self-end self-start rounded-full border border-paper-ink/25 bg-paper-background px-3.5 text-sm text-paper-ink outline-3 outline-transparent transition-[border-color,box-shadow,outline-color] duration-200 focus:border-paper-ink/65 focus:shadow-[0_0_0_5px_rgba(26,26,26,0.09)] focus:outline-paper-ink/18 max-sm:col-start-1 max-sm:row-start-1 max-sm:w-38"
                  value={language}
                  onChange={(event) => setLanguage(event.target.value as Language)}
                >
                  <option value="en">{copy.english}</option>
                  <option value="es">{copy.spanish}</option>
                </select>
              </div>
            </div>

            <div className="flex flex-row justify-between">
              <div><p>{copy.suspenseLabel}</p></div>
              <div>
                <Toggle
                  activated={isSuspenseActivated}
                  incomingOnClick={() => setIsSuspenseActivated(!isSuspenseActivated)}
                />
              </div>
            </div>

            <div className="flex flex-row justify-between">
              <div><p>{copy.stragglersTitle}</p></div>
              <div>
                <Toggle
                  activated={useStragglers}
                  incomingOnClick={() => setUseStragglers(!useStragglers)}
                />
              </div>
            </div>
          </>
        )}
      />

      <footer className="flex w-full shrink-0 flex-wrap items-center justify-center gap-x-4 gap-y-1 pb-5 text-xs leading-none text-paper-ink/58 max-sm:pb-4">
        <a
          className="text-paper-ink/68 no-underline transition-colors duration-200 hover:text-paper-ink"
          href="https://tato-portfolio.vercel.app/"
          target="_blank"
        >
          {copy.visitLink}
        </a>
        {typeof pageViews === "number" && (
          <span>
            {pageViews.toLocaleString()} {copy.views}
          </span>
        )}
        <p>{copy.versionLabel} {appVersion}</p>
      </footer>
    </>
  );
}

export default App;
