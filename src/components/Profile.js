import { useState, useEffect } from "react";

export default function Profile() {
  const [user, setUser] = useState({});
  const [payment, setPayment] = useState({
    type: "",
    number: "",
    name: "",
    upi: "",
  });

  const [saved, setSaved] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("currentUser"));
    setUser(u);

    const all = JSON.parse(localStorage.getItem("paymentMethods")) || {};
    setSaved(all[u.email] || []);
  }, []);

  const savePayment = () => {
    let all = JSON.parse(localStorage.getItem("paymentMethods")) || {};
    let userPayments = all[user.email] || [];

    // VALIDATION
    if (!payment.type) {
      alert("❌ Please select a payment type.");
      return;
    }

    // CARD VALIDATION
    if (payment.type === "Debit Card" || payment.type === "Credit Card") {
      if (!payment.name.trim()) {
        alert("❌ Card holder name cannot be empty.");
        return;
      }

      if (!/^[A-Za-z ]+$/.test(payment.name)) {
        alert("❌ Name must contain only letters.");
        return;
      }

      if (!payment.number.trim()) {
        alert("❌ Card number cannot be empty.");
        return;
      }

      if (!/^[0-9]{16}$/.test(payment.number)) {
        alert("❌ Card number must be exactly 16 digits.");
        return;
      }

      if (
        userPayments.some(
          (p) => p.number === payment.number && editingIndex === null
        )
      ) {
        alert("❌ This card number already exists.");
        return;
      }
    }

    // UPI VALIDATION
    if (payment.type === "UPI") {
      if (!payment.upi.trim()) {
        alert("❌ UPI ID cannot be empty.");
        return;
      }

      if (!payment.upi.includes("@upi.com")) {
        alert("❌ Invalid UPI format. Must contain '@upi.com'.");
        return;
      }

      if (payment.upi.length < 6) {
        alert("❌ UPI ID is too short.");
        return;
      }

      if (
        userPayments.some((p) => p.upi === payment.upi && editingIndex === null)
      ) {
        alert("❌ This UPI ID already exists.");
        return;
      }
    }

    // Create entry for saving
    const entry =
      payment.type === "UPI"
        ? { type: "UPI", upi: payment.upi }
        : { type: payment.type, name: payment.name, number: payment.number };

    // Update or Add
    if (editingIndex !== null) {
      userPayments[editingIndex] = entry;
      alert("Payment method updated!");
      setEditingIndex(null);
    } else {
      userPayments.push(entry);
      alert("Payment method saved!");
    }

    all[user.email] = userPayments;
    localStorage.setItem("paymentMethods", JSON.stringify(all));
    setSaved([...userPayments]);

    // Reset form
    setPayment({ type: "", number: "", name: "", upi: "" });
  };

  const handleEdit = (index) => {
    const p = saved[index];
    setEditingIndex(index);

    if (p.type === "UPI") {
      setPayment({
        type: "UPI",
        upi: p.upi,
        name: "",
        number: "",
      });
    } else {
      setPayment({
        type: p.type,
        name: p.name,
        number: p.number,
        upi: "",
      });
    }
  };

  return (
    <div>
      <div className="side-container">
      <h2>Your Profile</h2>
      <p>
        <b>Email:</b> {user.email}
      </p>

      <hr />

      <h3>
        {editingIndex !== null ? "Edit Payment Method" : "Add Payment Method"}
      </h3>

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

      {(payment.type === "Debit Card" || payment.type === "Credit Card") && (
        <div className="payment-input-container">
          <input
            placeholder="Card Holder Name"
            value={payment.name}
            onChange={(e) => setPayment({ ...payment, name: e.target.value })}
          />

          <input
            placeholder="Card Number"
            maxLength={16}
            value={payment.number}
            onChange={(e) => setPayment({ ...payment, number: e.target.value })}
          />
        </div>
      )}

      {payment.type === "UPI" && (
        <input
          placeholder="UPI ID (example: username@upi)"
          value={payment.upi}
          onChange={(e) => setPayment({ ...payment, upi: e.target.value })}
        />
      )}

      <button className="payment-button" onClick={savePayment}>
        {editingIndex !== null ? "Update Method" : "Save Method"}
      </button>

      <hr />

      <h3>Saved Payment Methods</h3>

      {saved.length === 0 && <p>No payment methods yet.</p>}

      {saved.map((p, i) => (
        <div className="card" key={i}>
          <b>{p.type}</b>

          {p.type === "UPI" ? (
            <div className="flex-payment-cont">
              <p>UPI ID: {p.upi}</p>
              <button className="payment-button" onClick={() => handleEdit(i)}>
                Edit
              </button>
            </div>
          ) : (
            <div className="flex-payment-cont">
              <div>
                <p>Name: {p.name}</p>
                <p>Card No: **** **** **** {p.number.slice(-4)}</p>
              </div>

              <button className="payment-button" onClick={() => handleEdit(i)}>
                Edit
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
    </div>
    
  );
}
