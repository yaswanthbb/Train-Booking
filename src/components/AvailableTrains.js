import trains from "./DummyData";

export default function AvailableTrains() {
  return (
    <div className="side-container">
      <h2>All Available Trains</h2>

      {trains.map((t) => (
        <div className="card" key={t.id}>
          <h3>{t.name}</h3>
          <p>
            <b>Route:</b> {t.source} ➜ {t.destination}
          </p>
          <p>
            <b>Departure Time:</b> {t.time}
          </p>
          <p>
            <b>AC Seats:</b> {t.classes.ac} | <b>Sleeper Seats:</b>{" "}
            {t.classes.sleeper}
          </p>
        </div>
      ))}
    </div>
  );
}
