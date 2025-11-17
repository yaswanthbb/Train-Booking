import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import Auth from "./components/Auth";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Passengers from "./components/Passengers";
import TrainSearch from "./components/TrainSearch";
import AvailableTrains from "./components/AvailableTrains";
import Bookings from "./components/Bookings";
import AdminTrain from "./components/AdminTrain";

export default function App() {
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
      </Routes>
    </BrowserRouter>
  );
}
