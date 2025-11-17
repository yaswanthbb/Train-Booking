import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = () => {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (!isLogin) {
      users.push({ email: form.email, password: form.password, role: "user" });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Signup successful!");
      setIsLogin(true);
      return;
    }

    const found = users.find(
      (u) => u.email === form.email && u.password === form.password
    );

    if (form.email === "admin@irctc.com" && form.password === "admin123") {
      const adminUser = { email: "admin@irctc.com", role: "admin" };
      localStorage.setItem("currentUser", JSON.stringify(adminUser));
      navigate("/");
      return;
    }

    if (found) {
      localStorage.setItem("currentUser", JSON.stringify(found));
      navigate("/");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="side-container">
      <h2>{isLogin ? "Login" : "Signup"}</h2>

      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button onClick={handleSubmit}>{isLogin ? "Login" : "Signup"}</button>

      <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: "pointer" }}>
        {isLogin ? "Create account" : "Already have an account?"}
      </p>
    </div>
  );
}
