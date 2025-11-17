import { useState } from "react";
import trains from "./DummyData";

export default function AdminTrain() {
  const [t, setT] = useState({ name: "", source: "", destination: "", time: "" });

  const saveTrain = () => {
    trains.push({ id: trains.length + 1, ...t, classes: { sleeper: 50, ac: 20 } });
    alert("Train Added!");
  };

  return (
    <div className="side-container">
      <h2>Admin: Add Train</h2>

      <input placeholder="Train Name" onChange={e => setT({ ...t, name: e.target.value })} />
      <input placeholder="Source" onChange={e => setT({ ...t, source: e.target.value })} />
      <input placeholder="Destination" onChange={e => setT({ ...t, destination: e.target.value })} />
      <input placeholder="Time" onChange={e => setT({ ...t, time: e.target.value })} />

      <button onClick={saveTrain}>Add Train</button>
    </div>
  );
}
