import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "./components/NavBar";
import Auth from "./components/Auth";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Passengers from "./components/Passengers";
import TrainSearch from "./components/TrainSearch";
import AvailableTrains from "./components/AvailableTrains";
import Bookings from "./components/Bookings";
import AdminTrain from "./components/AdminTrain";
import AddAdmin from "./components/AddAdmin";
import Book from "./components/Book";

export default function App() {
  useEffect(() => {
    // Check if admins list exists in localStorage
    const admins = JSON.parse(localStorage.getItem("admins"));

    // If NO admin exists, create a default admin
    if (!admins) {
      localStorage.setItem(
        "admins",
        JSON.stringify([{ email: "admin@irctc.com", password: "admin123" }])
      );
    }
  }, []);

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/passengers" element={<Passengers />} />
        <Route path="/search" element={<TrainSearch />} />
        <Route path="/available" element={<AvailableTrains />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/admin" element={<AdminTrain />} />
        <Route path="/book/:id" element={<Book />} />
        <Route path="/add-admin" element={<AddAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}
