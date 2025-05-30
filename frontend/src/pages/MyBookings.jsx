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
      await loadBookings(); // 重新加载订单列表
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
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded mb-4">{error}</div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No bookings found</p>
          <button
            onClick={() => navigate("/search")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Book a Flight
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.reference}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {booking.departureCity} → {booking.arrivalCity}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(booking.departureTime).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium">Flight</p>
                  <p>{booking.flightNumber}</p>
                </div>

                <div>
                  <p className="text-sm font-medium">Status</p>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      booking.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {booking.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/invoice/${booking.reference}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    View Details
                  </button>

                  {booking.status !== "cancelled" && (
                    <button
                      onClick={() => handleCancel(booking.reference)}
                      className="px-4 py-2 bg-white text-red-600 border border-red-600 rounded hover:bg-red-50"
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
