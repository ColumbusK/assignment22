import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

import { searchFlights, getAllFlights } from "../api/flights";
import FlightCard from "../components/FlightCard";

const AIRPORTS = [
  { code: "NZNE", name: "Dairy Flat" },
  { code: "YMML", name: "Melbourne" },
  { code: "NZRO", name: "Rotorua" },
  { code: "NZGB", name: "Great Barrier Island (Claris)" },
  { code: "NZCI", name: "Chatham Islands (Tuuta)" },
  { code: "NZTL", name: "Lake Tekapo" },
];

const Search = () => {
  const [from, setFrom] = useState("NZNE");
  const [to, setTo] = useState("YMML");
  const [date, setDate] = useState(new Date());
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 页面加载时获取全部航班
  useEffect(() => {
    const fetchAllFlights = async () => {
      setLoading(true);
      const result = await getAllFlights();
      console.log("All flights fetched:", result);

      setFlights(result);
      setLoading(false);
    };
    fetchAllFlights();
  }, []);

  const handleSearch = async () => {
    if (!date) return;
    setLoading(true);
    const d = moment(date).format("YYYY-MM-DD");
    const result = await searchFlights(from, to, d);
    setFlights(result);
    setLoading(false);
  };

  // 动态目的地选项：如果出发地为NZNE，可以选择所有其他；否则只能去NZNE
  const availableDestinations =
    from === "NZNE"
      ? AIRPORTS.filter((d) => d.code !== "NZNE")
      : AIRPORTS.filter((d) => d.code === "NZNE");

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-4xl font-bold text-indigo-700 mb-8 text-center">
          ✈️ Search Your Flight
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div>
            <label className="block text-gray-700 font-medium mb-1">From</label>
            <select
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                if (e.target.value !== "NZNE" && to !== "NZNE") {
                  setTo("NZNE");
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            >
              {AIRPORTS.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">To</label>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            >
              {availableDestinations.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Departure Date
            </label>
            <DatePicker
              selected={date}
              onChange={(d) => setDate(d)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
              dateFormat="yyyy-MM-dd"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-2 rounded-lg shadow hover:opacity-90 transition"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            {loading
              ? "Fetching flights..."
              : flights.length > 0
              ? "Available Flights"
              : "No Flights Found"}
          </h3>

          {flights.length > 0 ? (
            <div className="space-y-4">
              {flights.map((flight) => (
                <FlightCard
                  key={flight.flightNumber}
                  flight={flight}
                  onBook={() => navigate(`/booking/${flight._id}`)}
                />
              ))}
            </div>
          ) : (
            !loading && (
              <p className="text-gray-500 text-center mt-4">
                Please adjust search criteria and try again.
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
