import React, { useEffect, useState } from "react";
import fetchFromApi from "../utility/fetchFromApi";
import { toast } from "react-toastify";
import { FaStethoscope, FaTrashAlt } from "react-icons/fa";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // Fetch doctors data from the API
    fetchFromApi("https://medlist-backend.onrender.com/api/doctor", "get")
      .then((data) => {
        setDoctors(data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
      });
  }, []);

  const handleDelete = (id) => {
    // Optimistic UI update
    setDoctors(doctors.filter((doctor) => doctor.id !== id));

    // Call API to delete the doctor record
    fetchFromApi(`http://localhost:5000/api/doctor/${id}`, "delete")
      .then(() => toast.success("Doctor deleted successfully"))
      .catch((error) => {
        toast.error("Error deleting doctor:", error);
        console.error("Error deleting doctor:", error);
        // Revert state if delete fails
        setDoctors([...doctors]);
      });
  };

  return (
    <div className="py-8">
      <h2 className="text-xl ml-4 font-semibold text-secondary mb-4 flex items-center">
        <FaStethoscope className="mr-2" /> All Doctors
      </h2>
      <table className="min-w-full bg-white rounded-md">
        <thead className="bg-[#d2d2d2]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Specialty
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Experience (Years)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {doctors?.map((doctor) => (
            <tr key={doctor._id} className="hover:bg-[#f0f0f0]">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium ">
                {doctor.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {doctor.specialization}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {doctor.contactNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {doctor.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {doctor.experience}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  className="text-white w-full bg-[#9f0505] hover:bg-[#640505] px-3 py-2 rounded"
                  onClick={() => handleDelete(doctor._id)}
                >
                  <span className="inline-block pr-1">
                    <FaTrashAlt />
                  </span>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Doctors;
