import { useState } from "react";

export default function Passengers() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [p, setP] = useState({ name: "", age: "", gender: "" });
  const allPassengers = JSON.parse(localStorage.getItem("passengers")) || {};
  const [list, setList] = useState(allPassengers[user.email] || []);

  const addPassenger = () => {
    let all = JSON.parse(localStorage.getItem("passengers")) || {};
    let userPassengers = all[user.email] || [];

    const updated = [...userPassengers, p];

    all[user.email] = updated;
    localStorage.setItem("passengers", JSON.stringify(all));

    setList(updated);
    alert("Passenger Saved!");
  };

  return (
    <div className="side-container">
      <h2>Passenger Master List</h2>

      <input placeholder="Name" onChange={e => setP({ ...p, name: e.target.value })} />
      <input placeholder="Age" onChange={e => setP({ ...p, age: e.target.value })} />
      <select onChange={e => setP({ ...p, gender: e.target.value })}>
        <option>Gender</option>
        <option>Male</option>
        <option>Female</option>
      </select>

      <button onClick={addPassenger}>Save Passenger</button>

      <h3>Saved:</h3>
      {list.map((x, i) => (
        <div key={i} className="card">
          {x.name} ({x.gender}, {x.age})
        </div>
      ))}
    </div>
  );
}
