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
    <div className="max-w-lg mx-auto mt-8 p-6 border rounded-lg shadow-md bg-white">
      {/* User Info */}
      {storedUser && (
        <div className="mb-4 p-4 bg-blue-50 rounded">
          <p>
            Logged in as: <strong>{passenger.name}</strong>
          </p>
          <p>
            Email: <strong>{passenger.email}</strong>
          </p>
        </div>
      )}

      {/* Flight Details */}
      <h2 className="text-2xl font-bold mb-4">Flight Booking</h2>

      {/* ...existing image sections... */}

      {/* Price Display */}
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <p className="text-2xl font-bold text-blue-600">
          NZD ${flight.price.toLocaleString()}
        </p>
        <p className="text-sm text-gray-600">All taxes included</p>
      </div>

      {/* Flight Information */}
      <div className="mb-6 space-y-2">
        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <p className="font-medium">Flight Details</p>
            <p>Flight number: {flight.flightNumber}</p>
            <p>Aircraft: {flight.aircraftModel}</p>
            <p>Duration: {flight.durationMinutes} minutes</p>
          </div>
          <div>
            <p className="font-medium">Capacity</p>
            <p className="text-green-600">
              Available: {flight.availableSeats}/{flight.totalSeats} seats
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mt-4">
          <div className="mb-3">
            <p className="font-medium">Departure</p>
            <p>{depLocal}</p>
            <p className="text-sm text-gray-600">
              {flight.departureAirport} ({flight.departureTimezone})
            </p>
          </div>
          <div>
            <p className="font-medium">Arrival</p>
            <p>{arrLocal}</p>
            <p className="text-sm text-gray-600">
              {flight.arrivalAirport} ({flight.arrivalTimezone})
            </p>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={passenger.name}
            readOnly
            className="w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={passenger.email}
            readOnly
            className="w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block font-medium">Phone number</label>
          <input
            type="tel"
            name="phone"
            value={passenger.phone}
            onChange={handlePhoneChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 rounded transition ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isSubmitting ? "Processing..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
};

export default Booking;
