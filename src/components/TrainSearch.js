import { useState, useEffect } from "react";
import trains from "./DummyData";
import { useNavigate } from "react-router-dom";

export default function TrainSearch() {
  const [query, setQuery] = useState({ source: "", destination: "", name: "" });
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [paymentList, setPaymentList] = useState([]);
  const [chosenPayment, setChosenPayment] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return;

    const allPayments =
      JSON.parse(localStorage.getItem("paymentMethods")) || {};
    setPaymentList(allPayments[user.email] || []);
  }, []);

  const search = () => {
    const src = query.source.trim();
    const dest = query.destination.trim();
    const name = query.name.trim();

    // At least one field required
    if (!src && !dest && !name) {
      alert("❌ Enter source, destination, or train name to search.");
      return;
    }

    // Validate alphabetic source/destination
    if (src && !/^[A-Za-z ]+$/.test(src)) {
      alert("❌ Source must contain only letters.");
      return;
    }

    if (dest && !/^[A-Za-z ]+$/.test(dest)) {
      alert("❌ Destination must contain only letters.");
      return;
    }

    // Prevent same source/destination
    if (src && dest && src.toLowerCase() === dest.toLowerCase()) {
      alert("❌ Source and destination cannot be the same.");
      return;
    }

    // Validate train name
    if (name && !/^[A-Za-z ]+$/.test(name)) {
      alert("❌ Train name must contain only letters.");
      return;
    }

    // --- FILTERING LOGIC ---
    const res = trains.filter((t) => {
      const sMatch = !src || t.source.toLowerCase().includes(src.toLowerCase());
      const dMatch =
        !dest || t.destination.toLowerCase().includes(dest.toLowerCase());
      const nMatch = !name || t.name.toLowerCase().includes(name.toLowerCase());
      return sMatch && dMatch && nMatch;
    });

    setResults(res);
  };

  const confirmBooking = () => {
    if (!chosenPayment) {
      alert("Select a payment method");
      return;
    }

    const user = JSON.parse(localStorage.getItem("currentUser"));
    let allBookings = JSON.parse(localStorage.getItem("bookings")) || {};

    let userBookings = allBookings[user.email] || [];

    userBookings.push({
      train: selectedTrain,
      date: new Date().toLocaleDateString(),
      paymentUsed: chosenPayment,
    });

    allBookings[user.email] = userBookings;

    localStorage.setItem("bookings", JSON.stringify(allBookings));

    alert("Booking Successful!");

    setSelectedTrain(null);
    setChosenPayment("");
  };

  return (
    <div className="side-container">
      <h2>Search Trains</h2>
      <input
        placeholder="Train Name"
        onChange={(e) => setQuery({ ...query, name: e.target.value })}
      />

      <input
        placeholder="Source"
        onChange={(e) => setQuery({ ...query, source: e.target.value })}
      />
      <input
        placeholder="Destination"
        onChange={(e) => setQuery({ ...query, destination: e.target.value })}
      />

      <button onClick={search}>Search</button>

      <h3>Results:</h3>

      {results.map((t) => (
        <div className="card" key={t.id}>
          <b>{t.name}</b> – {t.source} ➜ {t.destination} at {t.time}
          <p>
            AC Seats: {t.classes.ac} | Sleeper Seats: {t.classes.sleeper}
          </p>
          <button onClick={() => navigate(`/book/${t.id}`)}>Book</button>
        </div>
      ))}
      {selectedTrain && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "300px",
            }}
          >
            <h3>Select Payment</h3>

            <select onChange={(e) => setChosenPayment(e.target.value)}>
              <option value="">Choose</option>
              {paymentList.map((p, i) => (
                <option key={i} value={p.type === "UPI" ? p.upi : p.number}>
                  {p.type === "UPI"
                    ? `UPI - ${p.upi}`
                    : `${p.type} - **** ${p.number.slice(-4)}`}
                </option>
              ))}
            </select>

            <button style={{ marginTop: "10px" }} onClick={confirmBooking}>
              Confirm Booking
            </button>

            <button
              style={{
                marginTop: "10px",
                background: "grey",
              }}
              onClick={() => setSelectedTrain(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
