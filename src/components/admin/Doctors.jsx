import React, { useEffect, useState } from "react";
import fetchFromApi from "../../utility/fetchFromApi";
import { toast } from "react-toastify";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // Fetch doctors data from the API
    fetchFromApi("http://localhost:5000/api/doctor", "get")
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
      <table className="min-w-full bg-white rounded-md">
        <thead className="bg-[#d2d2d2]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Specialty
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Experience (Years)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {doctors?.map((doctor) => (
            <tr key={doctor._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {doctor.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {doctor.specialization}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {doctor.contactNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {doctor.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {doctor.experience}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  className="text-white bg-[#9f0505] hover:bg-[#640505] px-3 py-1 rounded"
                  onClick={() => handleDelete(doctor._id)}
                >
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
