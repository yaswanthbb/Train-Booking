import { useState, useEffect } from "react";

export default function Profile() {
  const [user, setUser] = useState({});
  const [payment, setPayment] = useState({
    type: "",
    number: "",
    name: "",
    upi: ""
  });

  const [saved, setSaved] = useState([]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("currentUser"));
    setUser(u);

    const all = JSON.parse(localStorage.getItem("paymentMethods")) || {};
    setSaved(all[u.email] || []);
  }, []);

  const savePayment = () => {
    let all = JSON.parse(localStorage.getItem("paymentMethods")) || {};

    const userPayments = all[user.email] || [];

    const entry =
      payment.type === "UPI"
        ? { type: "UPI", upi: payment.upi }
        : { type: payment.type, name: payment.name, number: payment.number };

    const updated = [...userPayments, entry];

    all[user.email] = updated;
    localStorage.setItem("paymentMethods", JSON.stringify(all));

    setSaved(updated);
    alert("Payment method saved!");
    setPayment({ type: "", number: "", name: "", upi: "" });
  };

  return (
    <div className="side-container">
      <h2>Your Profile</h2>

      <p><b>Email:</b> {user.email}</p>

      <hr />

      <h3>Add Payment Method</h3>

      <select
      className="payment-input"
        onChange={(e) => setPayment({ ...payment, type: e.target.value })}
        value={payment.type}
      >
        <option value="">Select Type</option>
        <option value="Debit Card">Debit Card</option>
        <option value="Credit Card">Credit Card</option>
        <option value="UPI">UPI</option>
      </select>
      {payment.type === "Debit Card" || payment.type === "Credit Card" ? (
        <div className="payment-input-container">
          <input
            placeholder="Card Holder Name"
            onChange={(e) => setPayment({ ...payment, name: e.target.value })}
          />

          <input
            placeholder="Card Number"
            maxLength={16}
            onChange={(e) => setPayment({ ...payment, number: e.target.value })}
          />
        </div>
      ) : null}
      {payment.type === "UPI" ? (
        <input
          placeholder="UPI ID (example: username@upi)"
          onChange={(e) => setPayment({ ...payment, upi: e.target.value })}
        />
      ) : null}

      <button className="payment-button" onClick={savePayment}>Save Method</button>

      <hr />

      <h3>Saved Payment Methods</h3>

      {saved.length === 0 && <p>No payment methods yet.</p>}

      {saved.map((p, i) => (
        <div className="card" key={i}>
          <b>{p.type}</b>
          {p.type === "UPI" ? (
            <p>UPI ID: {p.upi}</p>
          ) : (
            <>
              <p>Name: {p.name}</p>
              <p>Card No: **** **** **** {p.number.slice(-4)}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
