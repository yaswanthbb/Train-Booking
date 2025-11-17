const Bookings = () => {
  const user = JSON.parse(localStorage.getItem("currentUser")) || {};
  const allBookings = JSON.parse(localStorage.getItem("bookings")) || {};
  const bookings = allBookings[user.email] || [];

  return (
    <div className="side-container">
      <h2>Your Bookings</h2>

      {bookings.length === 0 && <p>No bookings found.</p>}

      {bookings.map((b, i) => (
        <div key={i} className="card">
          <b>{b.train.name}</b>

          <p>
            {b.train.source} → {b.train.destination}
          </p>

          <p><b>Date:</b> {b.date}</p>

          <p><b>No. of Passengers:</b> {b.passengers.length}</p>

          <p><b>Payment Method:</b> {b.payment}</p>

          <p><b>Amount Paid:</b> ₹{b.totalBill}</p>

          <hr />

          <h4>Passenger Details</h4>
          {b.passengers.map((p, idx) => (
            <p key={idx}>
              {p.name} ({p.age}, {p.gender}) — Seat {p.seat}, {p.berth} Berth
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Bookings;
