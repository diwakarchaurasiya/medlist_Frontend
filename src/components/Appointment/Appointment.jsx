import React, { useState } from "react";
import { set } from "react-hook-form";
import { toast } from "react-toastify";
const Appointment = ({
  setShowAppointment,
  workingHours,
  doctorId,
  patientId,
}) => {
  // Define state for selected day and time
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");

  const generateDays = () => {
    const daysArray = [];
    const today = new Date();
    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    // Start from tomorrow
    for (let i = 1; i <= 7; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);

      daysArray.push({
        day: dayNames[futureDate.getDay()],
        date: futureDate.toISOString().split("T")[0], // Save full date in ISO format
      });
    }
    return daysArray;
  };

  const genrateTimeSlots = (start, end) => {
    const timeSlots = [];
    const startTime = start;
    const endTime = end - 1; // Adjust for end-time slot exclusion

    for (let i = startTime; i <= endTime; i++) {
      timeSlots.push(`${i}:00`);
    }
    return timeSlots;
  };

  const days = generateDays();
  const startTime = Number(workingHours.start.split(":")[0]);
  const endTime = Number(workingHours.end.split(":")[0]);
  const timeSlots = genrateTimeSlots(startTime || 10, endTime || 17);

  const handleDaySelect = (index) => {
    setSelectedIndex(index);
    setSelectedDate(days[index].date);
    setSelectedTime(""); // Reset time when day changes
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const bookingHandle = async () => {
    try {
      let url = "http://localhost:5000/api/appointment/create";
      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctorId: doctorId,
          patientId: patientId,
          appointmentDate: selectedDate,
          appointmentDay: days[selectedIndex].day,
          appointmentTime: selectedTime,
        }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      toast.success(responseData.message || "Appointment booked successfully!");
      setShowAppointment(false);
    } catch (error) {
      toast.error(error.message || "Failed to book appointment");
    }
  };

  return (
    <div className="py-4 text-[gray] max-w-full sm:max-w-2xl text-sm ">
      {/* Days Selection */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-4">
        {days.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col items-center cursor-pointer p-2 rounded-md transition-colors duration-100 w-full text-center ${
              selectedIndex === index
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700 border border-[gray]"
            }`}
            onClick={() => handleDaySelect(index)}
          >
            <span className="font-semibold">{item.day}</span>
            <span className="text-xs">{item.date}</span>
          </div>
        ))}
      </div>

      {/* Time Slots */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        {timeSlots.map((slot, index) => (
          <div
            key={index}
            className={`px-6 py-2 border rounded-md cursor-pointer transition-colors duration-100   w-full text-center ${
              selectedTime === slot
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-700 border-[gray]"
            }`}
            onClick={() => handleTimeSelect(slot)}
          >
            {slot}
          </div>
        ))}
      </div>

      {/* Book Appointment Button */}
      <button
        className="md:w-1/2 w-full bg-primary text-white py-3 rounded-lg text-center font-semibold hover:bg-primary transition-colors duration-100 disabled:bg-[#91ff01ae]"
        disabled={!selectedTime}
        onClick={bookingHandle}
      >
        {selectedTime
          ? `Book appointment at ${selectedTime}`
          : "Book an appointment"}
      </button>
    </div>
  );
};

export default Appointment;
