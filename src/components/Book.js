import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import trains from "./DummyData";

export default function Book() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [train, setTrain] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [selectedPassengers, setSelectedPassengers] = useState([]);
  const [berths, setBerths] = useState({});
  const [seatNumbers, setSeatNumbers] = useState({});
  const [paymentList, setPaymentList] = useState([]);
  const [chosenPayment, setChosenPayment] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    const t = trains.find((tr) => tr.id === Number(id));
    setTrain(t);

    const allPassengers = JSON.parse(localStorage.getItem("passengers")) || {};
    const userPassengers = allPassengers[user.email] || [];
    setPassengers(userPassengers);

    if (userPassengers.length === 0) {
      alert("❌ No passengers saved. Please add passengers first.");
      navigate("/passengers");
      return;
    }

    const allPayments = JSON.parse(localStorage.getItem("paymentMethods")) || {};
    const userPayments = allPayments[user.email] || [];
    setPaymentList(userPayments);

    if (userPayments.length === 0) {
      alert("❌ No payment methods found. Please add one.");
      navigate("/profile");
      return;
    }

  }, [id]);

  const handlePassengerSelect = (p) => {
    if (selectedPassengers.includes(p)) {
      setBerths(prev => { delete prev[p.name]; delete prev[`class_${p.name}`]; return {...prev}; });
      setSeatNumbers(prev => { delete prev[p.name]; return {...prev}; });
      setSelectedPassengers(selectedPassengers.filter((x) => x !== p));
      return;
    }

    setSelectedPassengers([...selectedPassengers, p]);
  };

  const totalBill = selectedPassengers.reduce((sum, p) => {
    const cls = berths[`class_${p.name}`];
    if (cls === "AC") return sum + 900;
    return sum + 500;
  }, 0);

  const handleBooking = () => {

    if (paymentList.length === 0) {
      alert("❌ Add payment method first");
      navigate("/profile");
      return;
    }

    if (selectedPassengers.length === 0) {
      alert("❌ Select at least one passenger.");
      return;
    }

    for (let p of selectedPassengers) {
      if (!berths[p.name]) {
        alert(`❌ Select berth preference for ${p.name}`);
        return;
      }

      if (!berths[`class_${p.name}`]) {
        alert(`❌ Select class (AC/Sleeper) for ${p.name}`);
        return;
      }

      if (!seatNumbers[p.name]) {
        alert(`❌ Select seat number for ${p.name}`);
        return;
      }
    }

    const seatList = Object.values(seatNumbers);
    const unique = new Set(seatList);

    if (seatList.length !== unique.size) {
      alert("❌ Duplicate seat numbers selected!");
      return;
    }

    if (!chosenPayment) {
      alert("❌ Choose a payment method.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("currentUser"));
    let allBookings = JSON.parse(localStorage.getItem("bookings")) || {};
    let userBookings = allBookings[user.email] || [];

    userBookings.push({
      train,
      passengers: selectedPassengers.map((p) => ({
        ...p,
        berth: berths[p.name],
        class: berths[`class_${p.name}`],
        seat: seatNumbers[p.name]
      })),
      totalBill,
      payment: chosenPayment,
      date: new Date().toLocaleDateString()
    });

    allBookings[user.email] = userBookings;
    localStorage.setItem("bookings", JSON.stringify(allBookings));

    alert("🎉 Booking Successful!");
    navigate("/bookings");
  };

  if (!train) return <div className="side-container">Loading train...</div>;

  return (
    <div className="side-container">
      <h2>Book Ticket</h2>
      <h3>{train.name}</h3>
      <p>{train.source} → {train.destination} at {train.time}</p>

      <hr />

      <h3>Select Passengers</h3>

      {passengers.map((p, i) => (
        <div key={i} className="card">
          <input type="checkbox" onChange={() => handlePassengerSelect(p)} />{" "}
          {p.name} ({p.age}, {p.gender})

          {selectedPassengers.includes(p) && (
            <>
              <br />

              {/* Class selection */}
              <select
                onChange={(e) =>
                  setBerths({ ...berths, [`class_${p.name}`]: e.target.value })
                }
              >
                <option value="">Select Class</option>
                <option value="AC">AC (₹900)</option>
                <option value="Sleeper">Sleeper (₹500)</option>
              </select>

              {/* Berth selection */}
              <select
                onChange={(e) =>
                  setBerths({ ...berths, [p.name]: e.target.value })
                }
              >
                <option value="">Berth Preference</option>
                <option value="Lower">Lower</option>
                <option value="Middle">Middle</option>
                <option value="Upper">Upper</option>
                <option value="Side Lower">Side Lower</option>
              </select>

              {/* Seat selection */}
              <select
                onChange={(e) =>
                  setSeatNumbers({ ...seatNumbers, [p.name]: e.target.value })
                }
              >
                <option value="">Select Seat Number</option>
                {[...Array(60)].map((_, j) => (
                  <option
                    key={j}
                    value={j + 1}
                    disabled={Object.values(seatNumbers).includes(String(j + 1))}
                  >
                    Seat {j + 1}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      ))}

      <hr />

      <h3>Payment</h3>

      <select onChange={(e) => setChosenPayment(e.target.value)}>
        <option value="">Select Payment Method</option>
        {paymentList.map((p, i) => (
          <option key={i} value={p.type === "UPI" ? p.upi : p.number}>
            {p.type === "UPI"
              ? `UPI - ${p.upi}`
              : `${p.type} - ****${p.number.slice(-4)}`}
          </option>
        ))}
      </select>

      <hr />

      <h3>Total Bill: ₹{totalBill}</h3>

      <button className="payment-button" onClick={handleBooking}>
        Confirm Booking
      </button>
    </div>
  );
}
