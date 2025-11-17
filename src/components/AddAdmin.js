import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddAdmin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user || user.role !== "admin") {
    return <div className="side-container">❌ Access Denied</div>;
  }

  const addAdmin = () => {
    const { email, password } = form;

    if (!email.trim() || !password.trim()) {
      alert("All fields are required");
      return;
    }

    let admins = JSON.parse(localStorage.getItem("admins")) || [];

    const exists = admins.find((a) => a.email === email);
    if (exists) {
      alert("❌ Admin already exists!");
      return;
    }

    admins.push(form);
    localStorage.setItem("admins", JSON.stringify(admins));

    alert("🎉 Admin added successfully!");
    navigate("/");
  };

  return (
    <div className="side-container">
      <h2>Add New Admin</h2>

      <input
        placeholder="Admin Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button onClick={addAdmin}>Add Admin</button>
    </div>
  );
}
