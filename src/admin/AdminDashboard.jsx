import React, { useEffect, useState } from "react";
import {
  FaCalendarCheck,
  FaUserInjured,
  FaUserMd,
  FaStethoscope,
  FaRupeeSign,
} from "react-icons/fa";
import fetchFromApi from "../utility/fetchFromApi";
import { Link, Route, Routes } from "react-router-dom";
import Patients from "./Patients";
import Doctors from "./Doctors";
import Appointments from "./Appointments";

const AdminDashboard = () => {
  // Dummy data for appointments
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchFromApi("https://medlist-backend.onrender.com/api/appointment", "get")
      .then((data) => {
        setAppointments(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
      });
    fetchFromApi("https://medlist-backend.onrender.com/api/doctor", "get", null)
      .then((data) => {
        setDoctors(data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
      });
    fetchFromApi("https://medlist-backend.onrender.com/api/patient", "get")
      .then((data) => {
        setPatients(data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
      });
  }, []);
  // Calculate total appointments and paid appointments
  const totalAppointments = appointments.length || 0;
  //calculate doctors and patients
  const totalDoctors = doctors.length || 0;
  const totalPatients = patients.length || 0;

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-primary mb-6">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Total Appointments */}
        <Link to="/admin/appointments">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="bg-primary p-3 rounded-full text-white mr-4">
              <FaCalendarCheck size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-secondary">
                Total Appointments
              </h3>
              <p className="text-2xl font-bold">{totalAppointments}</p>
            </div>
          </div>
        </Link>

        {/* Total Patients */}
        <Link to="/admin/patients">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="bg-primary p-3 rounded-full text-white mr-4">
              <FaUserInjured size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-secondary">
                Total Patients
              </h3>
              <p className="text-2xl font-bold">{totalPatients}</p>
            </div>
          </div>
        </Link>

        {/* Total Doctors */}
        <Link to="/admin/doctors">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="bg-secondary p-3 rounded-full text-white mr-4">
              <FaUserMd size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-secondary">
                Total Doctors
              </h3>
              <p className="text-2xl font-bold">{totalDoctors}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Appointments Table */}

      <Routes>
        <Route
          path="/"
          element={
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-secondary mb-4 flex items-center">
                <FaStethoscope className="mr-2" /> Recent Appointments
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#d2d2d2]">
                    <tr className="bg-gray-200">
                      <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                        Doctor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments
                      .slice(0, 5)
                      .reverse()
                      .map((appointment) => (
                        <tr key={appointment.id} className="hover:bg-[#f0f0f0]">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium ">
                            {appointment.patientId?.name || "Unknown"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm ">
                            {appointment.doctorId?.name || "Unknown"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm ">
                            {appointment.appointmentDate.slice(0, 10)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm ">
                            <span
                              className={`px-4 py-2 rounded-full text-sm  text-white ${
                                appointment.status === "Completed"
                                  ? "bg-[#1c841c]"
                                  : appointment.status === "Cancelled"
                                  ? "bg-[#920c0c]"
                                  : "bg-[#855900]"
                              }`}
                            >
                              {appointment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          }
        />
        <Route path="/patients" element={<Patients />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/appointments" element={<Appointments />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;
