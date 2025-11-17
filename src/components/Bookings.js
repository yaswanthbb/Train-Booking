const  Bookings = ()=> {
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
          <p>Date: {b.date}</p>
          <p>Payment: {b.paymentUsed}</p>
        </div>
      ))}
    </div>
  );
}

export default Bookings;