import React, { useEffect, useState } from "react";
import {
  FaCalendarCheck,
  FaUserInjured,
  FaUserMd,
  FaStethoscope,
  FaRupeeSign,
} from "react-icons/fa";
import fetchFromApi from "../../utility/fetchFromApi";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  // Dummy data for appointments
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchFromApi("http://localhost:5000/api/appointment", "get")
      .then((data) => {
        setAppointments(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
      });
    fetchFromApi("http://localhost:5000/api/doctor", "get")
      .then((data) => {
        setDoctors(data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
      });
    fetchFromApi("http://localhost:5000/api/patient", "get")
      .then((data) => {
        setPatients(data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
      });
  }, []);
  // Calculate total appointments and paid appointments
  const totalAppointments = appointments.length || 0;
  const paidAppointments = appointments.filter(
    (appointment) => appointment.status === "Paid"
  ).length;
  console.log(appointments);

  //calculate doctors and patients
  const totalDoctors = doctors.length || 0;
  const totalPatients = patients.length || 0;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-primary mb-6">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Appointments */}
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

        {/* Paid Appointments */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div className="bg-secondary p-3 rounded-full text-white mr-4">
            <FaRupeeSign size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary">
              Paid Appointments
            </h3>
            <p className="text-2xl font-bold">{paidAppointments}</p>
          </div>
        </div>

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
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-secondary mb-4 flex items-center">
          <FaStethoscope className="mr-2" /> Recent Appointments
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">Patient</th>
                <th className="p-3 text-left">Doctor</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.reverse().map((appointment) => (
                <tr key={appointment.id} className="border-b">
                  <td className="p-3">
                    {appointment.patientId?.name || "Unknown"}
                  </td>
                  <td className="p-3">
                    {appointment.doctorId?.name || "Unknown"}
                  </td>
                  <td className="p-3">
                    {appointment.appointmentDate.slice(0, 10)}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        appointment.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
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
    </div>
  );
};

export default AdminDashboard;
