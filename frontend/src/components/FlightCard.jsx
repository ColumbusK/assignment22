import React from "react";

const FlightCard = ({ flight, onBook }) => {
  const departureTime = new Date(flight.departureTime).toLocaleString("en-NZ", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: flight.departureTimezone,
  });

  const arrivalTime = new Date(flight.arrivalTime).toLocaleString("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: flight.arrivalTimezone,
  });

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-md flex flex-col md:flex-row gap-4">
      <img
        src={flight.routeImage}
        alt={flight.aircraftModel}
        className="w-full md:w-48 h-32 object-cover rounded-md"
      />
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-blue-700 mb-1">
          {flight.departureCity} → {flight.arrivalCity}
        </h3>
        <p className="text-gray-600 mb-1">
          Flight: <strong>{flight.flightNumber}</strong>
        </p>
        <p className="text-gray-600 mb-1">Aircraft: {flight.aircraftModel}</p>
        <p className="text-gray-600 mb-1">
          Departure: {departureTime} ({flight.departureAirport})
        </p>
        <p className="text-gray-600 mb-1">
          Arrival: {arrivalTime} ({flight.arrivalAirport})
        </p>
        <p className="text-gray-600 mb-2">
          Duration: {flight.durationMinutes} min | Seats Available:{" "}
          {flight.availableSeats}/{flight.totalSeats}
        </p>
        <button
          onClick={onBook}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default FlightCard;
