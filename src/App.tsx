import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

function App() {
  const [participantInput, setParticipantInput] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);

  const addFunction = () => {
    setParticipants([...participants, participantInput]);
    setParticipantInput("");
  }

  const removeItem = (index) => { 
    const newArr = [ ...participants ];
    newArr.splice(index, 1);
    setParticipants(newArr);
  }

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Papers</h1>
          <p>Insert a participant name:</p>
          <input
            type="text"
            placeholder="insert a name"
            value={participantInput}
            onChange={(e) => setParticipantInput(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => addFunction()}
        >
          Add
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Participants</h2>
          {participants.map((participant, index) => (
            <p>{(index+1)}. {participant} - 
              <span className="clickable" onClick={() => removeItem(index)}>
                [e]
              </span>
              <span className="clickable" onClick={() => removeItem(index)}>
                [x]
              </span>
            </p>
          ))}
          <ul>
            <li>
              <a href="https://tato-portfolio.vercel.app/" target="_blank">
                Visit Tato
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  );
}

export default App;
