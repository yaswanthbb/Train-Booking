import "../App.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const handleStart = () => {
    if (!user) {
      // Not logged in
      navigate("/auth");
      return;
    }

    if (user.role === "admin") {
      navigate("/admin");
      return;
    }

    // Normal user
    navigate("/available");
  };

  return (
    <div className="home-container">
      <div className="container">
        <h2>Welcome to IRCTC Simulation</h2>
        <p>Select an option from the navigation bar.</p>
        <div>
          <button onClick={handleStart}>Start Booking</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
