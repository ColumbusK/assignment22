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
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-white to-blue-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
          Search Flights
        </h2>

        <div className="flex flex-col gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">From</label>
            <select
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                // 如果当前的目的地不合法，自动修正
                if (e.target.value !== "NZNE" && to !== "NZNE") {
                  setTo("NZNE");
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              dateFormat="yyyy-MM-dd"
            />
          </div>

          <button
            onClick={handleSearch}
            className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Searching..." : "Search Flights"}
          </button>
        </div>

        <div>
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
              <p className="text-gray-500 text-center">No flights found.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
