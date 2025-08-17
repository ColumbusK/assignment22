// pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { fetchRandomUser } from "../api/user";

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const cached = localStorage.getItem("user");
        const data = cached ? JSON.parse(cached) : await fetchRandomUser();
        setUser(data);
        if (!cached) localStorage.setItem("user", JSON.stringify(data));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden font-sans bg-gray-700">
      {/* Hero Background */}
      <div
        className="absolute inset-0 bg-cover bg-center filter brightness-75"
        style={{
          backgroundImage: "url(/assets/hero-bg.jpg)",
        }}
      />

      {/* Top Nav */}
      <header className="relative z-10 flex items-center justify-between px-8 py-4">
        <div className="flex items-center">
          <img src={logo} alt="DairyJet" className="h-10 w-auto" />
          {user && (
            <span className="ml-4 text-white text-lg">
              Hello,{" "}
              <strong>
                {user.title} {user.last_name}
              </strong>
            </span>
          )}
        </div>

        <nav className="flex items-center space-x-6 text-white">
          <button
            onClick={() => navigate("/search")}
            className="hover:underline"
          >
            Flights
          </button>
          <button
            onClick={() => navigate("/my-bookings")}
            className="hover:underline"
          >
            My Bookings
          </button>
        </nav>
      </header>

      {/* Hero Content Card */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-3xl max-w-md p-8 text-center">
          <h1 className="text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
            Fly Your Way
          </h1>
          <p className="text-lg text-white/90 mb-6">
            Discover fast, local air routes with DairyJet’s custom booking
            experience.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/search")}
              className="px-6 py-3 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-full font-medium transform hover:scale-105 transition"
            >
              Book Now
            </button>
            <button
              onClick={() => navigate("/my-bookings")}
              className="px-6 py-3 bg-blue-400 text-white rounded-full font-medium transform hover:scale-105 transition"
            >
              View Bookings
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 w-full text-center text-white/70 text-xs z-10">
        © {new Date().getFullYear()} DairyJet. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
