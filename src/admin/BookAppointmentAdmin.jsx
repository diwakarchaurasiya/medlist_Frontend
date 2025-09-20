import DoctorManagementSkeleton from "../components/LoadingSkeleton/DoctorManagementSkeleton";
import React, { useEffect, useRef, useState } from "react";

import {
  Search,
  Clock,
  Calendar,
  DollarSign,
  User,
  Medal,
  CheckCircle,
  XCircle,
} from "lucide-react"; // Assuming you have Lucide React installed

const AppointmentBooking = () => {
  // State
  const [doctors, setDoctors] = useState([]); // Will be populated from backend
  const [patients, setPatients] = useState([]); // Will be populated from backend
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [days, setDays] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state for fetching data
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for the success popup

  // Refs for dropdowns to handle clicks outside
  const doctorSearchRef = useRef(null);
  const doctorDropdownRef = useRef(null);
  const patientSearchRef = useRef(null);
  const patientDropdownRef = useRef(null);

  // Utility Functions (unchanged from your provided code)
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getWeekday = (dateString) => {
    const date = new Date(dateString);
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return weekdays[date.getDay()];
  };

  const generateDays = () => {
    const daysArray = [];
    const today = new Date();
    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    for (let i = 1; i <= 7; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);

      daysArray.push({
        day: dayNames[futureDate.getDay()],
        date: futureDate.toISOString().split("T")[0],
        displayDate: futureDate.getDate(),
      });
    }
    return daysArray;
  };

  const generateTimeSlots = (start, end) => {
    const slots = [];
    const startTime = Number(start.split(":")[0]);
    const endTime = Number(end.split(":")[0]) - 1; // Assuming slots are hourly and end before the hour

    for (let i = startTime; i <= endTime; i++) {
      slots.push(`${String(i).padStart(2, "0")}:00`); // Ensure consistent "HH:00" format
    }
    return slots;
  };

  // --- Backend Data Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsRes, patientsRes] = await Promise.all([
          fetch("https://medlist-backend.onrender.com/api/doctor"),
          fetch("https://medlist-backend.onrender.com/api/patient"),
        ]);

        if (!doctorsRes.ok) throw new Error("Failed to fetch doctors");
        if (!patientsRes.ok) throw new Error("Failed to fetch patients");

        const doctorsData = await doctorsRes.json();
        const patientsData = await patientsRes.json();

        setDoctors(doctorsData.data || []);
        setFilteredDoctors(doctorsData.data || []);
        setPatients(patientsData.data || []);
        setFilteredPatients(patientsData.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data. Please try again later."); // Use alert as toastify wasn't in provided code
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Initialize days
  useEffect(() => {
    setDays(generateDays());
  }, []);

  // Doctor Dropdown Functions
  const handleDoctorSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = doctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(searchTerm) ||
        doctor.specialization.toLowerCase().includes(searchTerm)
    );
    setFilteredDoctors(filtered);
    setSelectedDoctor(null); // Clear selected doctor if user starts typing
    setShowDoctorDropdown(true);
  };

  const selectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorDropdown(false);
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedDayIndex(null);
    setTimeSlots([]); // Clear time slots when a new doctor is selected
    // Note: days are already generated and shouldn't need regeneration here
  };

  // Patient Dropdown Functions
  const handlePatientSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(searchTerm) ||
        patient.email.toLowerCase().includes(searchTerm)
    );
    setFilteredPatients(filtered);
    setSelectedPatient(null); // Clear selected patient if user starts typing
    setShowPatientDropdown(true);
  };

  const selectPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDropdown(false);
  };

  const handleDaySelect = (index, day) => {
    setSelectedDayIndex(index); // This is 0–6 (Sunday–Saturday)
    setSelectedDate(day.date);
    setSelectedTime(null);

    if (selectedDoctor?.workingHours) {
      setTimeSlots(
        generateTimeSlots(
          selectedDoctor.workingHours.start,
          selectedDoctor.workingHours.end
        )
      );
    } else {
      setTimeSlots([]);
    }
  };

  const getDayNameFromIndex = (index) => {
    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    return dayNames[index];
  };

  // Time Slots Functions
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  // Preview and Validation Functions
  const validateForm = () => {
    return (
      selectedDoctor &&
      selectedPatient &&
      selectedDate &&
      selectedTime &&
      selectedPaymentStatus
    );
  };
  const getDayName = (dateString) => {
    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const date = new Date(dateString);
    return dayNames[date.getDay()];
  };

  const handleBookAppointment = async () => {
    if (validateForm()) {
      // Ensure admin is authenticated before attempting to book
      const adminToken = localStorage.getItem("admin_token");
      if (!adminToken) {
        alert("Admin not authenticated. Please log in and try again.");
        return;
      }
      const appointmentData = {
        patientId: selectedPatient._id,
        doctorId: selectedDoctor._id,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        status: "Scheduled",
        paymentStatus: selectedPaymentStatus,
        amount: selectedDoctor.appointmentFees,
        appointmentDay: getDayNameFromIndex(selectedDayIndex), // ✅ FIXED
      };
      try {
        const response = await fetch(
          "https://medlist-backend.onrender.com/api/appointment/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Include admin auth token as required by backend auth middleware
              authorization: `Bearer ${adminToken}`,
            },

            body: JSON.stringify(appointmentData),
          }
        );

        if (response.ok) {
          // Show success popup instead of alert
          setShowSuccessPopup(true);

          // Reset form after successful booking
          setSelectedDoctor(null);
          setSelectedPatient(null);
          setSelectedDate(null);
          setSelectedTime(null);
          setSelectedPaymentStatus(null);
          setSelectedDayIndex(null);
          setTimeSlots([]);
          setFilteredDoctors(doctors); // Reset search filters
          setFilteredPatients(patients); // Reset search filters
        } else {
          const errorData = await response.json();
          alert(
            `Failed to book appointment: ${
              errorData.message || "Unknown error"
            }`
          );
        }
      } catch (error) {
        console.error("Error booking appointment:", error);
        alert("An error occurred while trying to book the appointment.");
      }
    } else {
      alert("Please fill all required fields before booking.");
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        doctorSearchRef.current &&
        !doctorSearchRef.current.contains(event.target) &&
        doctorDropdownRef.current &&
        !doctorDropdownRef.current.contains(event.target)
      ) {
        setShowDoctorDropdown(false);
      }

      if (
        patientSearchRef.current &&
        !patientSearchRef.current.contains(event.target) &&
        patientDropdownRef.current &&
        !patientDropdownRef.current.contains(event.target)
      ) {
        setShowPatientDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return <DoctorManagementSkeleton />;
  }

  return (
    <div className=" mx-auto px-4 max-w-7xl">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="text-center py-8 px-8 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Book an Appointment
          </h1>
          <p className="text-gray-600">
            Select your preferred doctor, date, and time
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          {/* Left Column - Form Fields */}
          <div className="p-8 space-y-6 border-r border-gray-200">
            {/* Doctor Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Doctor
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="doctorSearch"
                  ref={doctorSearchRef}
                  placeholder="Search doctors..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  onChange={handleDoctorSearch}
                  onFocus={() => setShowDoctorDropdown(true)}
                  value={selectedDoctor ? selectedDoctor.name : ""} // Show selected doctor's name in the input field
                />
                {showDoctorDropdown && (
                  <div
                    id="doctorDropdown"
                    ref={doctorDropdownRef}
                    className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto custom-scrollbar"
                  >
                    {filteredDoctors.length === 0 ? (
                      <div className="p-3 text-gray-500 text-center">
                        No doctors found
                      </div>
                    ) : (
                      filteredDoctors.map((doctor) => (
                        <div
                          key={doctor._id}
                          className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                          onClick={() => selectDoctor(doctor)}
                        >
                          <div className="font-medium text-gray-800">
                            {doctor.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {doctor.specialization}
                          </div>
                          <div className="text-xs text-primary mt-1">
                            ₹{doctor.appointmentFees} •{" "}
                            {doctor.workingHours
                              ? `${formatTime(
                                  doctor.workingHours.start
                                )} - ${formatTime(doctor.workingHours.end)}`
                              : "N/A"}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Patient Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Patient
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="patientSearch"
                  ref={patientSearchRef}
                  placeholder="Search patients..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  onChange={handlePatientSearch}
                  onFocus={() => setShowPatientDropdown(true)}
                  value={selectedPatient ? selectedPatient.name : ""} // Show selected patient's name in the input field
                />
                {showPatientDropdown && (
                  <div
                    id="patientDropdown"
                    ref={patientDropdownRef}
                    className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto custom-scrollbar"
                  >
                    {filteredPatients.length === 0 ? (
                      <div className="p-3 text-gray-500 text-center">
                        No patients found
                      </div>
                    ) : (
                      filteredPatients.map((patient) => (
                        <div
                          key={patient._id}
                          className="p-3 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                          onClick={() => selectPatient(patient)}
                        >
                          <div className="font-medium text-gray-800">
                            {patient.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {patient.email}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Days Selection */}
            {selectedDoctor && (
              <div id="daysContainer">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Date
                </label>
                <div
                  id="daysGrid"
                  className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-4"
                >
                  {days.map((day, index) => (
                    <div
                      key={index}
                      className={`flex flex-col items-center cursor-pointer p-2 rounded-md transition-colors duration-100 w-full text-center border ${
                        selectedDayIndex === index
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-gray-700 border-gray-300 hover:border-primary hover:bg-primary/5"
                      }`}
                      onClick={() => handleDaySelect(index, day)}
                    >
                      <span className="font-semibold text-xs">{day.day}</span>
                      <span className="text-xs mt-1">{day.displayDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Time Slots */}
            {selectedDate && (
              <div id="timeSlotsContainer">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Available Time Slots
                </label>
                <div
                  id="timeSlots"
                  className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4"
                >
                  {timeSlots.length > 0 ? (
                    timeSlots.map((slot, index) => (
                      <div
                        key={index}
                        className={`px-6 py-2 border rounded-md cursor-pointer transition-colors duration-100 w-full text-center text-sm ${
                          selectedTime === slot
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-gray-700 border-gray-300 hover:border-primary hover:bg-primary/5"
                        }`}
                        onClick={() => handleTimeSelect(slot)}
                      >
                        {formatTime(slot)}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm col-span-full">
                      No time slots available for this doctor/day.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Payment Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Payment Status
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentStatus"
                    value="Completed"
                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                    onChange={() => setSelectedPaymentStatus("Completed")}
                    checked={selectedPaymentStatus === "Completed"}
                  />
                  <span className="ml-2 text-sm text-gray-700">Completed</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentStatus"
                    value="Pending"
                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                    onChange={() => setSelectedPaymentStatus("Pending")}
                    checked={selectedPaymentStatus === "Pending"}
                  />
                  <span className="ml-2 text-sm text-gray-700">Pending</span>
                </label>
              </div>
            </div>

            {/* Book Appointment Button */}
            <button
              id="bookAppointmentBtn"
              disabled={!validateForm()}
              className={`w-full px-6 py-3 text-white font-semibold rounded-lg transition-all duration-200 ${
                validateForm()
                  ? "bg-primary hover:bg-blue-600"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              onClick={handleBookAppointment}
            >
              {validateForm()
                ? `Book appointment at ${formatTime(selectedTime)}`
                : "Book Appointment"}
            </button>
          </div>

          {/* Right Column - Preview */}
          <div className="p-8 bg-white">
            <div className="sticky top-4">
              <h3 className="text-lg font-semibold text-black mb-6">
                Appointment Preview
              </h3>

              <div id="previewContent" className="space-y-4 text-black">
                <div className="border border-primary rounded-lg p-4 flex items-center justify-between">
                  <h4 className="font-semibold text-primary flex items-center gap-2">
                    <Medal className="h-5 w-5" /> Doctor:{" "}
                    <span className="text-gray-800">
                      {selectedDoctor ? selectedDoctor.name : "N/A"}
                    </span>
                  </h4>
                  <h4 className="font-semibold text-primary flex items-center gap-2">
                    <User className="h-5 w-5" /> Patient:{" "}
                    <span className="text-gray-800">
                      {selectedPatient ? selectedPatient.name : "N/A"}
                    </span>
                  </h4>
                </div>

                <div className="border border-primary rounded-lg p-4 flex items-center justify-between">
                  <h4 className="font-semibold text-primary flex items-center gap-2">
                    <Calendar className="h-5 w-5" /> Date:{" "}
                    <span className="text-gray-800">
                      {selectedDate
                        ? `${selectedDate} (${getWeekday(selectedDate)})`
                        : "N/A"}
                    </span>
                  </h4>
                  <h4 className="font-semibold text-primary flex items-center gap-2">
                    <Clock className="h-5 w-5" /> Time:{" "}
                    <span className="text-gray-800">
                      {selectedTime ? formatTime(selectedTime) : "N/A"}
                    </span>
                  </h4>
                </div>

                <div className="border border-primary rounded-lg p-4 flex items-center justify-between">
                  <h4 className="font-semibold text-primary flex items-center gap-2">
                    <DollarSign className="h-5 w-5" /> Payment Status:{" "}
                    <span className="text-gray-800">
                      {selectedPaymentStatus ? selectedPaymentStatus : "N/A"}
                    </span>
                  </h4>
                  <h4 className="font-semibold text-primary flex items-center gap-2">
                    <DollarSign className="h-5 w-5" /> Amount:{" "}
                    <span className="text-gray-800">
                      ₹{selectedDoctor ? selectedDoctor.appointmentFees : "0"}
                    </span>
                  </h4>
                </div>

                {!validateForm() && (
                  <div className="text-sm text-gray-500">
                    Please select all required fields to see the full preview.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-sm w-full mx-auto">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Appointment Booked!
            </h2>
            <p className="text-gray-700 mb-2">
              Your appointment for{" "}
              <span className="font-semibold text-primary">
                {selectedPatient?.name}
              </span>{" "}
              with{" "}
              <span className="font-semibold text-primary">
                {selectedDoctor?.name}
              </span>{" "}
              is confirmed!
            </p>
            <div className="text-left bg-gray-50 p-4 rounded-md mt-4">
              <p className="text-gray-700 flex items-center mb-2">
                <User className="h-4 w-4 mr-2 text-primary" />
                <span className="font-medium">Patient:</span>{" "}
                {selectedPatient?.name}
              </p>
              <p className="text-gray-700 flex items-center mb-2">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                <span className="font-medium">Date:</span>{" "}
                {selectedDate &&
                  new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
              </p>
              <p className="text-gray-700 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-primary" />
                <span className="font-medium">Time:</span>{" "}
                {selectedTime && formatTime(selectedTime)}
              </p>
            </div>
            <button
              className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all"
              onClick={() => setShowSuccessPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentBooking;
