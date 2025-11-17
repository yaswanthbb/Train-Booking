import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });

  const validateInputs = (isSignup) => {
    const { email, password } = form;

    if (!email.trim()) {
      alert("❌ Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("❌ Enter a valid email address");
      return false;
    }

    if (!password.trim()) {
      alert("❌ Password is required");
      return false;
    }

    if (isSignup && password.length < 6) {
      alert("❌ Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateInputs(!isLogin && true)) return;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let admins = JSON.parse(localStorage.getItem("admins")) || [];

    // SIGNUP MODE
    if (!isLogin) {
      const existingUser = users.find((u) => u.email === form.email);
      const existingAdmin = admins.find((a) => a.email === form.email);

      if (existingUser || existingAdmin) {
        alert("❌ Email already exists. Please login instead.");
        return;
      }

      users.push({ email: form.email, password: form.password, role: "user" });
      localStorage.setItem("users", JSON.stringify(users));

      alert("🎉 Signup successful! Please login.");

      setForm({ email: "", password: "" });
      setIsLogin(true);
      return;
    }

    // LOGIN MODE
    const adminFound = admins.find(
      (a) => a.email === form.email && a.password === form.password
    );

    if (adminFound) {
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ ...adminFound, role: "admin" })
      );
      navigate("/");
      return;
    }

    const userFound = users.find(
      (u) => u.email === form.email && u.password === form.password
    );

    if (userFound) {
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ ...userFound, role: "user" })
      );
      navigate("/");
    } else {
      alert("❌ Invalid email or password");
    }
  };

  return (
    <div className="side-container">
      <h2>{isLogin ? "Login" : "Signup"}</h2>

      <input
        placeholder="Email"
        autoComplete="off"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button onClick={handleSubmit}>
        {isLogin ? "Login" : "Signup"}
      </button>

      <p
        onClick={() => setIsLogin(!isLogin)}
        style={{ cursor: "pointer", marginTop: "10px" }}
      >
        {isLogin ? "Create account" : "Already have an account?"}
      </p>
    </div>
  );
}
