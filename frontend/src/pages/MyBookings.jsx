import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserBookings, cancelBooking } from "../api/booking";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!storedUser?._id) {
      navigate("/");
      return;
    }

    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await getUserBookings(storedUser._id);
      setBookings(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (reference) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      await cancelBooking(reference);
      await loadBookings(); // Reload bookings after cancellation
      alert("Booking cancelled successfully");
    } catch (error) {
      alert(error.message || "Failed to cancel booking");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 px-6">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-900">
        My Bookings
      </h1>

      {error && (
        <div className="bg-red-100 text-red-800 p-5 rounded-lg mb-8 text-center font-semibold">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600 text-lg mb-8">No bookings found</p>
          <button
            onClick={() => navigate("/search")}
            className="inline-block px-10 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Book a Flight
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {bookings.map((booking) => (
            <div
              key={booking.reference}
              className="bg-white p-7 rounded-xl shadow-lg hover:shadow-xl transition"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-8">
                {/* Left: Route and time */}
                <div className="flex-1 min-w-[200px]">
                  <h3 className="text-xl font-semibold text-gray-900 truncate">
                    {booking.departureCity} → {booking.arrivalCity}
                  </h3>
                  <p className="mt-2 text-gray-600 text-sm">
                    {new Date(booking.departureTime).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>

                {/* Flight number */}
                <div className="w-32 text-center mt-5 md:mt-0">
                  <p className="text-sm font-semibold text-gray-700 uppercase mb-1">
                    Flight
                  </p>
                  <p className="text-gray-800 truncate">
                    {booking.flightNumber}
                  </p>
                </div>

                {/* Status */}
                <div className="w-32 text-center mt-5 md:mt-0">
                  <p className="text-sm font-semibold text-gray-700 uppercase mb-1">
                    Status
                  </p>
                  <span
                    className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${
                      booking.status === "cancelled"
                        ? "bg-red-200 text-red-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {booking.status.toUpperCase()}
                  </span>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-6 md:mt-0 justify-center md:justify-end min-w-[230px]">
                  <button
                    onClick={() => navigate(`/invoice/${booking.reference}`)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium shadow hover:bg-blue-700 transition flex-1 md:flex-initial"
                    style={{ minWidth: "110px" }}
                  >
                    View Details
                  </button>

                  {booking.status !== "cancelled" && (
                    <button
                      onClick={() => handleCancel(booking.reference)}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium shadow hover:bg-red-700 transition flex-1 md:flex-initial"
                      style={{ minWidth: "110px" }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
