import React, { useEffect, useState } from "react";
import fetchFromApi from "../utility/fetchFromApi";
import { FaStethoscope } from "react-icons/fa";
import { toast } from "react-toastify";
import DoctorManagementSkeleton from "../components/LoadingSkeleton/DoctorManagementSkeleton";

const DoctorsAppointments = () => {
  const [Doctorsappointments, setDoctorsAppointments] = useState([]);
  const user = localStorage.getItem("user");
  const doctorId = JSON.parse(user)?.user._id || null;
  console.log("Doctor ID:", doctorId);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Doctorsappointments data from the API
    fetchFromApi(
      `https://medlist-backend.onrender.com/api/appointment/doctor/${doctorId}`,
      "get"
    )
      .then((data) => {
        setDoctorsAppointments(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
        setLoading(false);
      });
  }, []);
  console.log(Doctorsappointments);
  // Function to handle appointment status update
  const handleStatusUpdate = (id, status) => {
    fetchFromApi(
      `https://medlist-backend.onrender.com/api/appointment/${id}`,
      "PUT",
      {
        status: status,
      }
    )
      .then(() => {
        toast.success(`Appointment marked as ${status}`);
        // Update the local state to reflect the new status
        setDoctorsAppointments(
          Doctorsappointments.map((appointment) =>
            appointment._id === id
              ? { ...appointment, status: status }
              : appointment
          )
        );
      })
      .catch((error) => {
        toast.error(`Error updating appointment: ${error.message}`);
        console.error("Error updating appointment:", error);
      });
  };

  // Function to handle appointment deletion
  //   const handleDelete = (id) => {
  //     fetchFromApi(`https://medlist-backend.onrender.com/api/appointment/${id}`, "delete")
  //       .then(() => {
  //         toast.success("Appointment deleted successfully");
  //         // Remove the appointment from the local state
  //         setDoctorsAppointments(
  //           Doctorsappointments.filter((appointment) => appointment._id !== id)
  //         );
  //       })
  //       .catch((error) => {
  //         toast.error(`Error deleting appointment: ${error.message}`);
  //         console.error("Error deleting appointment:", error);
  //       });
  //   };

  if (loading) {
    return <DoctorManagementSkeleton />;
  }

  return (
    <div className="m-8">
      <h2 className="  ml-4 text-xl font-semibold text-secondary mb-4 flex items-center">
        <FaStethoscope className="mr-2" /> All DoctorsAppointments
      </h2>
      <div>
        <table className="min-w-full bg-white rounded-md">
          <thead className="bg-[#d2d2d2] rounded-lg">
            <tr className="">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doctor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {Doctorsappointments?.map((appointment) => (
              <tr key={appointment._id} className="hover:bg-[#f0f0f0]">
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
                <td className="p-3 flex gap-2 justify-end text-sm">
                  <button
                    className={`bg-primary text-white px-3 py-2 rounded hover:bg-secondary transition-all ${
                      appointment.status === "Completed" ||
                      appointment.status === "Cancelled"
                        ? "hidden"
                        : "block"
                    }`}
                    onClick={() =>
                      handleStatusUpdate(appointment._id, "Completed")
                    }
                  >
                    Mark as Completed
                  </button>
                  <button
                    className={`bg-[#b81c1c] text-white px-3 py-2 rounded hover:bg-[#6d0707] transition-all ${
                      appointment.status === "Completed" ||
                      appointment.status === "Cancelled"
                        ? "hidden"
                        : "block"
                    }`}
                    onClick={() =>
                      handleStatusUpdate(appointment._id, "Cancelled")
                    }
                  >
                    Mark as Cancelled
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorsAppointments;
