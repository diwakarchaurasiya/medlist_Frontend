import React, { useEffect, useState } from "react";
import fetchFromApi from "../../utility/fetchFromApi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import MyAppointmentsSkeleton from "../LoadingSkeleton/MyAppointmentLoading";

const MyAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const user = localStorage.getItem("user");
  const patientId = user ? JSON.parse(user)?.user._id : null;

  useEffect(() => {
    if (!patientId) {
      setFetchError("User not found. Please log in again.");
      setLoading(false);
      return;
    }

    fetchFromApi(
      `https://medlist-backend.onrender.com/api/appointment/patient/${patientId}`,
      "GET"
    )
      .then((data) => {
        setAppointments(data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error.message);
        setFetchError("Failed to load appointments. Please try again.");
        setLoading(false);
      });
  }, [patientId]);

  const notify = () => toast.info("This feature is coming soon!");

  if (loading) {
    return <MyAppointmentsSkeleton />;
  }

  if (fetchError) {
    return (
      <div className="min-h-[200px] flex justify-center items-center text-red-600 font-medium">
        {fetchError}
      </div>
    );
  }

  if (!appointments.length) {
    return (
      <div className="min-h-[300px] flex flex-col justify-center items-center text-center px-6">
        <img
          src="http://localhost:5173/src/assets/assets_frontend/sad404.svg"
          alt="No Appointments"
          className="w-64 mb-6"
        />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          No Appointments Found
        </h2>
        <p className="text-gray-500 mb-4">
          You haven't booked any appointments yet.
        </p>
        <Link
          to="/doctors/all"
          className="bg-primary text-white px-5 py-2 rounded-md hover:bg-secondary transition-all"
        >
          Book Now
        </Link>
      </div>
    );
  }

  return (
    <div className=" px-4">
      <h1 className="text-2xl font-bold text-gray-800 my-6 text-center">
        My Appointments
      </h1>
      {appointments.map((appointment, index) => (
        <div
          className="bg-white p-6 rounded-md shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between mb-6"
          key={index}
        >
          {/* Doctor Info */}
          <div className="flex items-center mb-4 md:mb-0 flex-wrap justify-center">
            <img
              src={
                appointment.doctorId?.profileImage ||
                "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg"
              }
              alt={appointment.doctorId?._id}
              className="p-2 w-40 h-40 object-cover rounded-full border-2 border-gray-40 mr-6"
            />
            <div>
              <h2 className="text-lg font-bold">
                {appointment.doctorId?.name || "Unknown Doctor"}
              </h2>
              <p className="text-sm text-gray-600">
                {appointment.doctorId?.specialization || "Specialization N/A"}
              </p>
              <p className="text-sm text-gray-500">
                License: {appointment.doctorId?.licenseNumber || "N/A"}
              </p>
              <p className="text-sm text-gray-500">
                Fees: ₹{appointment.doctorId?.appointmentFees || 0}
              </p>
              <p className="text-sm text-gray-600 font-semibold">
                Date & Time:
                <span className="font-normal flex flex-col sm:flex-row sm:gap-x-4">
                  <span>{appointment.appointmentDate?.slice(0, 10)}</span>
                  <span>{appointment.appointmentDay}</span>
                  <span>{appointment.appointmentTime}</span>
                </span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row md:justify-end gap-2 mt-4 md:mt-0">
            <button
              className="bg-[#2579da] text-white py-2 px-4 rounded-md hover:bg-[#1e66bb]"
              onClick={notify}
            >
              Pay Online
            </button>
            <button
              className="bg-[#a70b0b] hover:bg-[#720505] text-white py-2 px-4 rounded-md"
              onClick={notify}
            >
              Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyAppointment;
