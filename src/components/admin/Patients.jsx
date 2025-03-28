import React, { useEffect, useState } from "react";
import fetchFromApi from "../../utility/fetchFromApi";
import { toast } from "react-toastify";
import { FaStethoscope, FaTrashAlt } from "react-icons/fa";

const Patients = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // Fetch patients data from the API
    fetchFromApi("https://medlist-backend.onrender.com/api/patient", "get")
      .then((data) => {
        setPatients(data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
      });
  }, []);

  const handleDelete = (id) => {
    // Remove the patient from the state for now (optimistic UI update)
    setPatients(patients.filter((patient) => patient.id !== id));

    // Call API to delete the patient record
    fetchFromApi(
      `https://medlist-backend.onrender.com/api/patient/${id}`,
      "delete"
    )
      .then(toast.success("Patient deleted successfully"))
      .catch((error) => {
        toast.error("Error deleting patient:", error);
        console.error("Error deleting patient:", error);
        // Revert state if delete fails
        setPatients([...patients]);
      });
  };

  return (
    <div className="py-8">
      <h2 className="  ml-4 text-xl font-semibold text-secondary mb-4 flex items-center">
        <FaStethoscope className="mr-2" /> All Patients
      </h2>
      <table className="min-w-full bg-white  rounded-md">
        <thead className="bg-[#d2d2d2] ">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
              Age
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
              Gender
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
              Medical History
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {patients?.map((patient) => (
            <tr key={patient._id} className="hover:bg-[#f0f0f0]">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {patient.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm ">
                {patient.age}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm ">
                {patient.gender}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm ">
                {patient.contactNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm ">
                {patient.email}
              </td>
              <td className="px-6 py-4 text-sm ">
                {patient.medicalHistory || "None"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  className="text-white w-full  bg-[#9f0505] hover:bg-[#640505] px-3 py-2 rounded"
                  onClick={() => handleDelete(patient._id)}
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

export default Patients;
