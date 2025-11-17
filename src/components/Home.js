import "../App.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <div className="container">
        <h2>Welcome to IRCTC Simulation</h2>
        <p>Select an option from the navigation bar.</p>
        <div>
          <Link to="/search">
            <button>Start Booking</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
