import { useState } from "react";

export default function Passengers() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const [p, setP] = useState({ name: "", age: "", gender: "" });
  const allPassengers = JSON.parse(localStorage.getItem("passengers")) || {};
  const [list, setList] = useState(allPassengers[user.email] || []);

  const [editingIndex, setEditingIndex] = useState(null);

  const validatePassenger = () => {
    if (!p.name.trim()) {
      alert("❌ Name cannot be empty");
      return false;
    }

    if (!/^[A-Za-z ]+$/.test(p.name)) {
      alert("❌ Name must contain only letters");
      return false;
    }

    if (!p.age.trim()) {
      alert("❌ Age cannot be empty");
      return false;
    }

    if (!/^[0-9]+$/.test(p.age) || Number(p.age) < 1 || Number(p.age) > 120) {
      alert("❌ Age must be between 1 and 120");
      return false;
    }

    if (p.gender === "" || p.gender === "Gender") {
      alert("❌ Select a gender");
      return false;
    }

    return true;
  };

  const addPassenger = () => {
    if (!validatePassenger()) return;

    let all = JSON.parse(localStorage.getItem("passengers")) || {};
    let userPassengers = all[user.email] || [];

    // Prevent duplicate names on new add
    if (
      editingIndex === null &&
      userPassengers.some((x) => x.name.toLowerCase() === p.name.toLowerCase())
    ) {
      alert("❌ Passenger with this name already exists");
      return;
    }

    let updated = [...userPassengers];

    if (editingIndex !== null) {
      updated[editingIndex] = p;
      alert("Passenger updated!");
      setEditingIndex(null);
    } else {
      updated.push(p);
      alert("Passenger Saved!");
    }

    all[user.email] = updated;
    localStorage.setItem("passengers", JSON.stringify(all));
    setList(updated);

    setP({ name: "", age: "", gender: "" });
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setP(list[index]);
  };

  const handleDelete = (index) => {
    if (!window.confirm("Are you sure you want to delete this passenger?"))
      return;

    let all = JSON.parse(localStorage.getItem("passengers")) || {};
    let userPassengers = all[user.email] || [];

    userPassengers.splice(index, 1);

    all[user.email] = userPassengers;
    localStorage.setItem("passengers", JSON.stringify(all));
    setList([...userPassengers]);

    // reset editor if deleted while editing
    if (editingIndex === index) {
      setEditingIndex(null);
      setP({ name: "", age: "", gender: "" });
    }

    alert("Passenger deleted successfully!");
  };

  return (
    <div className="side-container">
      <h2>Passenger Master List</h2>

      <input
        placeholder="Name"
        value={p.name}
        onChange={(e) => setP({ ...p, name: e.target.value })}
      />
      <input
        placeholder="Age"
        value={p.age}
        onChange={(e) => setP({ ...p, age: e.target.value })}
      />

      <select
        value={p.gender}
        onChange={(e) => setP({ ...p, gender: e.target.value })}
      >
        <option value="Gender">Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      <button onClick={addPassenger}>
        {editingIndex !== null ? "Update Passenger" : "Save Passenger"}
      </button>

      <h3>Saved:</h3>

      {list.map((x, i) => (
        <div key={i} className="card">
          <div className="flex-payment-cont">
            <p>
              {x.name} ({x.gender}, {x.age})
            </p>
            <br />
            <div className="flex-container">
              <button
                className="payment-button"
                onClick={() => handleEdit(i)}
              >
                Edit
              </button>
              <button
                className="payment-button red"
                onClick={() => handleDelete(i)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
