import { useState } from "react";
import "./App.css";

function App() {
  const [participantInput, setParticipantInput] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [editIndex, setEditIndex] = useState<number>();
  const [editing, setEditing] = useState(false);

  const addFunction = () => {
    if (participantInput === "") return;
    setParticipants([...participants, participantInput]);
    setParticipantInput("");
  };

  const removeItem = (index: number) => {
    const newArr = [...participants];
    newArr.splice(index, 1);
    setParticipants(newArr);
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
    setParticipantInput("");
    setEditing(false);
  };

  const sortParticipants = () => {
    if (participants.length === 0) {
      console.log("more elements are needed");
      return;
    }
    const array = [...participants];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    setParticipants(array);
  };

  return (
    <>
      <section id="center">
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
        {!editing && (
          <button
            type="button"
            className="counter"
            onClick={() => addFunction()}
          >
            Add
          </button>
        )}
        {editing && (
          <button
            type="button"
            className="counter"
            onClick={() => editParticipantName()}
          >
            Edit
          </button>
        )}
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <h2>Participants</h2>
          {participants.map((participant, index) => (
            <p key={`${participant}-${index}`}>
              {index + 1}. {participant} -
              <span
                className="clickable"
                onClick={() => editParticipant(index)}
              >
                [e]
              </span>
              <span className="clickable" onClick={() => removeItem(index)}>
                [x]
              </span>
            </p>
          ))}
          <button
            type="button"
            className="counter"
            onClick={() => sortParticipants()}
            disabled={participants.length<2}
          >
            Sort
          </button>
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
