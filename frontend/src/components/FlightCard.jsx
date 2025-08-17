import React from "react";

const formatDuration = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
};

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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition hover:shadow-xl p-4 flex flex-col md:flex-row md:items-start">
      {/* 左侧：图片 */}
      <img
        src={flight.routeImage}
        alt={flight.aircraftModel}
        className="w-full md:w-52 h-40 object-cover rounded-lg"
      />

      {/* 中间：航班信息 */}
      <div className="flex-1 px-4 mt-4 md:mt-0">
        <h3 className="text-xl font-bold text-indigo-700">
          {flight.departureCity} → {flight.arrivalCity}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Flight <span className="font-medium">{flight.flightNumber}</span>
          &nbsp;|&nbsp; {flight.aircraftModel}
        </p>
        <p className="text-gray-600 mt-2">
          🛫 <strong>{departureTime}</strong> ({flight.departureAirport})
        </p>
        <p className="text-gray-600">
          🛬 <strong>{arrivalTime}</strong> ({flight.arrivalAirport})
        </p>
        <p className="text-gray-600 mt-2">
          ⏱ Duration: <strong>{formatDuration(flight.durationMinutes)}</strong>
          &nbsp;|&nbsp; 💺 Seats:{" "}
          <strong>
            {flight.availableSeats}/{flight.totalSeats}
          </strong>
        </p>
      </div>

      {/* 右侧：图标按钮 */}
      <div className="md:self-start mt-4 md:mt-0">
        <button
          onClick={onBook}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full shadow hover:scale-105 transition-transform"
        >
          ✈️ Book
        </button>
      </div>
    </div>
  );
};

export default FlightCard;
