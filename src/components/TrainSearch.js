import { useState, useEffect } from "react";
import trains from "./DummyData";

export default function TrainSearch() {
  const [query, setQuery] = useState({ source: "", destination: "" });
  const [results, setResults] = useState([]);

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
    const res = trains.filter(
      (t) =>
        t.source.toLowerCase().includes(query.source.toLowerCase()) &&
        t.destination.toLowerCase().includes(query.destination.toLowerCase())
    );
    setResults(res);
  };

  const openPayment = (train) => {
    if (paymentList.length === 0) {
      alert("You have no payment methods saved! Add one in Profile.");
      return;
    }
    setSelectedTrain(train);
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
          <button onClick={() => openPayment(t)}>Book</button>
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
