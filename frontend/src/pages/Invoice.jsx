import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookingByReference } from "../api/booking";

const Invoice = () => {
  const { reference } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getBookingByReference(reference)
      .then((data) => {
        setOrder(data);
      })
      .catch((error) => {
        console.error("Failed to fetch booking:", error);
        setError(error.message || "Failed to fetch booking details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [reference]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-12 p-6 bg-red-100 rounded-md text-center text-red-700">
        {error}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto mt-12 p-6 bg-yellow-100 rounded-md text-center text-yellow-700">
        Booking not found
      </div>
    );
  }

  const depTime = new Date(order.departureTime);
  const arrTime = new Date(order.arrivalTime);

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-lg">
      {/* Top confirmation */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-semibold text-gray-800">
          Booking Confirmed
        </h1>
        <p className="text-sm text-gray-500">Reference No: {order.reference}</p>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Flight Info */}
        <div>
          <h2 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">
            ✈️ Flight Details
          </h2>
          <p className="text-gray-700">
            Flight Number:{" "}
            <span className="font-medium">{order.flightNumber}</span>
          </p>
          <p className="text-gray-700">
            Route:{" "}
            <span className="font-medium">
              {order.departureCity} → {order.arrivalCity}
            </span>
          </p>
          <p className="text-gray-700">
            Departure:{" "}
            {depTime.toLocaleString("en-US", {
              timeZone: order.departureTimezone,
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
          <p className="text-gray-700">
            Arrival:{" "}
            {arrTime.toLocaleString("en-US", {
              timeZone: order.arrivalTimezone,
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>

        {/* Passenger Info */}
        <div>
          <h2 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">
            👤 Passenger
          </h2>
          <p className="text-gray-700">
            Name: <span className="font-medium">{order.passenger?.name}</span>
          </p>
          <p className="text-gray-700">
            Email: <span className="font-medium">{order.passenger?.email}</span>
          </p>
          <p className="text-gray-700">
            Phone: <span className="font-medium">{order.passenger?.phone}</span>
          </p>
        </div>
      </div>

      {/* Price Info */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
        <h2 className="text-lg font-bold text-gray-700 mb-4">
          💰 Price Summary
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between text-gray-700">
            <span>Base Fare</span>
            <span>NZD ${order.price.basePrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Tax</span>
            <span>NZD ${order.price.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg text-gray-800 border-t pt-3">
            <span>Total</span>
            <span>NZD ${order.price.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer Notice */}
      <div className="mt-10 text-center text-sm text-gray-500">
        <p>A confirmation email has been sent to you.</p>
        <p>Please keep your booking reference for any inquiries.</p>
      </div>
    </div>
  );
};

export default Invoice;
