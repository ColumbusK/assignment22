// App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Booking from "./pages/Booking";
import Invoice from "./pages/Invoice";
import Cancel from "./pages/Cancel";
import MyBookings from "./pages/MyBookings";

import "./App.css"; // 引入全局样式

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/search" element={<Search />} />
      <Route path="/booking/:id" element={<Booking />} />
      <Route path="/invoice/:reference" element={<Invoice />} />
      <Route path="/cancel" element={<Cancel />} />
      <Route path="/my-bookings" element={<MyBookings />} />
    </Routes>
  );
};

export default App;
