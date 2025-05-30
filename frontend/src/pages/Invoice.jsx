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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-red-50 rounded-lg">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-yellow-50 rounded-lg">
        <p className="text-yellow-600 text-center">Booking not found</p>
      </div>
    );
  }

  const depTime = new Date(order.departureTime);
  const arrTime = new Date(order.arrivalTime);

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-8">
        <div className="inline-block p-3 rounded-full bg-green-100 mb-4">
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
        <h2 className="text-2xl font-bold text-gray-800">Booking Confirmed!</h2>
        <p className="text-gray-600">Reference: {order.reference}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-bold text-lg border-b pb-2">Flight Details</h3>
          <p>Flight Number: {order.flightNumber}</p>
          <p>
            {order.departureCity} → {order.arrivalCity}
          </p>
          <p>
            Departure:{" "}
            {depTime.toLocaleString("en-US", {
              timeZone: order.departureTimezone,
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
          <p>
            Arrival:{" "}
            {arrTime.toLocaleString("en-US", {
              timeZone: order.arrivalTimezone,
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-lg border-b pb-2">Passenger Details</h3>
          <p>Name: {order.passenger.name}</p>
          <p>Email: {order.passenger.email}</p>
          <p>Phone: {order.passenger.phone}</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-bold text-lg mb-3">Price Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Base Fare:</span>
            <span>NZD ${order.price.basePrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>NZD ${order.price.tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span>NZD ${order.price.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-600">
        <p>Booking confirmation has been sent to your email</p>
        <p>Please keep your reference number for future inquiries</p>
      </div>
    </div>
  );
};

export default Invoice;
