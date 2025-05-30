// pages/Home.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // Optional: your logo image

import { fetchRandomUser } from "../api/user";

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cached = localStorage.getItem("user");
    if (cached) {
      setUser(JSON.parse(cached));
    } else {
      fetchRandomUser()
        .then((data) => {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        })
        .catch((err) => {
          console.error("Error loading user", err);
        });
    }
  }, []);

  console.log("User data:", user);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="w-full max-w-2xl flex flex-col items-center">
        <img
          src={logo}
          alt="DairyJet Logo"
          className="w-28 h-28 mb-6 drop-shadow-lg"
        />
        <h1 className="text-5xl font-extrabold text-blue-900 mb-4 text-center leading-tight tracking-wide">
          {user
            ? `Hello, ${user.title} ${user.last_name}!`
            : "Welcome to DairyJet"}
        </h1>

        <h1 className="text-5xl font-extrabold text-blue-900 mb-4 text-center leading-tight tracking-wide">
          Welcome to DairyJet Online Ticketing System
        </h1>
        <p className="text-xl text-gray-700 mb-10 text-center">
          ✈️ Comfortable · Fast · Tailored Regional Air Service
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/search")}
            className="px-10 py-3 bg-blue-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300"
          >
            Book Now
          </button>

          <button
            onClick={() => navigate("/my-bookings")}
            className="px-10 py-3 bg-white text-blue-600 border-2 border-blue-600 text-lg font-semibold rounded-full shadow-lg hover:bg-blue-50 hover:scale-105 transition-all duration-300"
          >
            My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
