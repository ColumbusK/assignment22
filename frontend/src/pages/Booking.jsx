// src/pages/Booking.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFlightById } from "../api/flights";
import { createBooking, prepareBookingData } from "../api/booking";

const Booking = () => {
  const { id } = useParams(); // MongoDB flight _id
  const navigate = useNavigate();

  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const [passenger, setPassenger] = useState({
    name: storedUser
      ? `${storedUser.title} ${storedUser.first_name} ${storedUser.last_name}`
      : "",
    email: storedUser ? storedUser.email : "",
    phone: storedUser ? storedUser.phone : "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getFlightById(id);
        setFlight(data);
        console.log("Flight data fetched:", data);
      } catch {
        setError("Flight not found!");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handlePhoneChange = (e) => {
    setPassenger((p) => ({ ...p, phone: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 验证用户是否登录
      if (!storedUser?._id) {
        throw new Error("Please login first");
      }

      // 验证航班是否还有座位
      if (flight.availableSeats <= 0) {
        throw new Error("Sorry, no seats available for this flight");
      }

      // 验证手机号
      if (!passenger.phone) {
        throw new Error("Please enter your phone number");
      }

      // 准备预订数据
      const bookingData = {
        userId: storedUser._id,
        flightId: flight._id,
        passenger: {
          name: passenger.name,
          email: passenger.email,
          phone: passenger.phone,
        },
        paymentMethod: "credit_card",
      };

      // 创建预订
      const response = await createBooking(bookingData);

      // 预订成功
      alert("Booking successful!");
      navigate(`/invoice/${response.invoice.reference}`);
    } catch (error) {
      console.error("Booking failed:", error);
      alert(error.message || "Booking failed, please try again later");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error || !flight) return <p className="p-6 text-red-600">{error}</p>;

  // Correctly access the timestamp
  const depTime = new Date(flight.departureTime?.$date || flight.departureTime);
  const arrTime = new Date(flight.arrivalTime?.$date || flight.arrivalTime);

  const depLocal = depTime.toLocaleString("en-US", {
    timeZone: flight.departureTimezone,
  });
  const arrLocal = arrTime.toLocaleString("en-US", {
    timeZone: flight.arrivalTimezone,
  });

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border border-gray-200 rounded-2xl shadow-sm bg-white space-y-6">
      {/* 顶部用户信息 */}
      {storedUser && (
        <div className="mb-4 p-4 bg-blue-100/40 border border-blue-200 rounded-lg">
          <p className="text-gray-700">
            👤 <strong>{passenger.name}</strong>
          </p>
          <p className="text-gray-600">📧 {passenger.email}</p>
        </div>
      )}

      {/* 页面标题 */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        ✈️ Flight Booking
      </h1>

      {/* 价格展示 */}
      <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl text-center">
        <p className="text-3xl font-bold text-blue-600">
          NZD ${flight.price.toLocaleString()}
        </p>
        <p className="text-sm text-gray-500 mt-1">All taxes included</p>
      </div>

      {/* 航班基本信息 */}
      <div className="bg-gray-50 border border-gray-100 p-5 rounded-xl grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-medium text-gray-800 mb-1">Flight Details</p>
          <p>
            🛩️ {flight.flightNumber} ({flight.aircraftModel})
          </p>
          <p>
            ⏱ Duration: {Math.floor(flight.durationMinutes / 60)}h{" "}
            {flight.durationMinutes % 60}m
          </p>
        </div>
        <div>
          <p className="font-medium text-gray-800 mb-1">Seats</p>
          <p className="text-green-600">
            Available: {flight.availableSeats}/{flight.totalSeats}
          </p>
        </div>
      </div>

      {/* 起降信息 */}
      <div className="bg-gray-50 border border-gray-100 p-5 rounded-xl text-sm space-y-3">
        <div>
          <p className="font-medium text-gray-800">🛫 Departure</p>
          <p>{depLocal}</p>
          <p className="text-gray-500">
            {flight.departureAirport} ({flight.departureTimezone})
          </p>
        </div>
        <div>
          <p className="font-medium text-gray-800">🛬 Arrival</p>
          <p>{arrLocal}</p>
          <p className="text-gray-500">
            {flight.arrivalAirport} ({flight.arrivalTimezone})
          </p>
        </div>
      </div>

      {/* 表单填写 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={passenger.name}
            readOnly
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={passenger.email}
            readOnly
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone number
          </label>
          <input
            type="tel"
            value={passenger.phone}
            onChange={handlePhoneChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded-lg font-semibold text-white transition ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Processing..." : "✅ Confirm Booking"}
        </button>
      </form>
    </div>
  );
};

export default Booking;
