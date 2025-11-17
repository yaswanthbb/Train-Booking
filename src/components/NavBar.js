import { Link, useNavigate } from "react-router-dom";
import { IoMdTrain } from "react-icons/io";

const NavBar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/auth");
  };

  return (
    <div className="navbar">
      <Link to="/">
        <IoMdTrain className="icon" />
      </Link>

      <div style={{ display: "flex", gap: "10px" }}>
        <Link to="/">
          <button className="nav-button">Home</button>
        </Link>

        {user && user.role === "user" && (
          <>
            <Link to="/profile">
              <button className="nav-button">Profile</button>
            </Link>
            <Link to="/passengers">
              <button className="nav-button">Passengers</button>
            </Link>
            <Link to="/search">
              <button className="nav-button">Search</button>
            </Link>
            <Link to="/available">
              <button className="nav-button">Available Trains</button>
            </Link>
            <Link to="/bookings">
              <button className="nav-button">Bookings</button>
            </Link>

            <button className="nav-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
        {user && user.role === "admin" && (
          <>
            <Link to="/admin">
              <button className="nav-button">Admin</button>
            </Link>
            <Link to="/add-admin">
              <button className="nav-button">Add Admin</button>
            </Link>

            <button className="nav-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}

        {!user && (
          <Link to="/auth">
            <button className="nav-button">Login</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default NavBar;
