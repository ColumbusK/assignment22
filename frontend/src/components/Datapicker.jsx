import React, { useState } from "react";

const DatePicker = ({ label = "选择日期", value, onChange }) => {
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateChange = (e) => {
    onChange(e.target.value);
    setShowCalendar(false);
  };

  return (
    <div className="relative w-full max-w-xs">
      {label && (
        <label className="block mb-1 text-sm text-gray-700">{label}</label>
      )}
      <input
        type="text"
        readOnly
        value={value}
        onClick={() => setShowCalendar((prev) => !prev)}
        className="w-full px-3 py-2 border rounded-md shadow-sm bg-white cursor-pointer text-gray-800"
        placeholder="点击选择日期"
      />
      {showCalendar && (
        <input
          type="date"
          className="absolute top-full mt-2 w-full px-3 py-2 border rounded-md shadow bg-white text-gray-800 z-10"
          onChange={handleDateChange}
          value={value}
        />
      )}
    </div>
  );
};

export default DatePicker;
