import React, { useState, useEffect } from "react";
import {
  UserPlus,
  Search,
  Edit,
  Trash,
  X,
  Eye,
  FileText,
  ChevronUp,
  ChevronDown,
} from "lucide-react"; // Added Chevron icons for future sorting if needed
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import DoctorManagementSkeleton from "../components/LoadingSkeleton/DoctorManagementSkeleton";

Modal.setAppElement("#root"); // Important for accessibility with react-modal

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "Male", "Female", etc.

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10); // Number of patients to display per page

  useEffect(() => {
    fetch("https://medlist-backend.onrender.com/api/patient")
      .then((res) => res.json())
      .then((data) => {
        setPatients(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setPatients([]);
        setLoading(false);
        toast.error("Failed to fetch patients.");
      });
  }, []);

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleView = (patient) => {
    setSelectedPatient(patient);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      fetch(`https://medlist-backend.onrender.com/api/patient/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            toast.success("Patient deleted successfully");
            setPatients((prev) => prev.filter((patient) => patient._id !== id));
            // No need to reset current page here, as filteredPatients will auto-adjust
          } else {
            toast.error("Failed to delete patient");
          }
        })
        .catch(() => toast.error("Error deleting patient"));
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(
      `https://medlist-backend.onrender.com/api/patient/${selectedPatient._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedPatient),
      }
    )
      .then((res) => {
        if (res.ok) {
          toast.success("Patient updated successfully");
          setPatients((prev) =>
            prev.map((pat) =>
              pat._id === selectedPatient._id ? selectedPatient : pat
            )
          );
          setIsModalOpen(false);
        } else {
          toast.error("Failed to update patient");
        }
      })
      .catch(() => toast.error("Error updating patient"));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedPatient(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedPatient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Filter patients based on search term and gender filter
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" || patient.gender.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Calculate for pagination
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatientsPaginated = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // --- New function for CSV export ---
  const handleExportCsv = () => {
    const headers = [
      "Name",
      "Gender",
      "Age",
      "Date of Birth",
      "Contact Number",
      "Email",
      "Address",
      "Emergency Contact",
      "Medical History",
    ];

    const data = filteredPatients.map((patient) => [
      // Double quotes around values to handle commas within fields
      `"${patient.name}"`,
      `"${patient.gender}"`,
      patient.age,
      patient.dateOfBirth
        ? new Date(patient.dateOfBirth).toLocaleDateString("en-GB") // Format as DD/MM/YYYY
        : "N/A",
      `"${patient.contactNumber}"`,
      `"${patient.email}"`,
      `"${patient.address || "N/A"}"`, // Ensure address is handled and quoted
      `"${patient.emergencyContact || "N/A"}"`,
      `"${patient.medicalHistory || "None"}"`,
    ]);

    // Join rows with comma and then each row with newline
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        headers.map((h) => `"${h}"`).join(","), // Quote headers too
        ...data.map((row) => row.join(",")),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "patients.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Patients data exported to CSV!");
  };

  if (loading) {
    return <DoctorManagementSkeleton />;
  }

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      maxWidth: "600px",
      width: "90%",
      borderRadius: "8px",
      padding: "0",
      border: "none",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1000,
    },
  };

  // Extract unique genders for filter
  const genders = [...new Set(patients.map((pat) => pat.gender))];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserPlus className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-gray-800">Patients</h1>
        </div>
        <div className="flex space-x-3">
          {" "}
          {/* Group buttons */}
          <button
            onClick={handleExportCsv}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors duration-200"
          >
            <FileText className="h-5 w-5" /> Export CSV
          </button>
          <Link to="/admin/patients/add">
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary flex items-center gap-2">
              <UserPlus className="h-5 w-5" /> Add Patient
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-4 flex-1">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              className="flex-1 border-none outline-none text-sm text-gray-800 placeholder-gray-400"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Filter by:</label>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1); // Reset to first page on filter change
              }}
            >
              <option value="all">All Genders</option>
              {genders.map((gender) => (
                <option key={gender} value={gender.toLowerCase()}>
                  {gender}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Gender
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Age
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentPatientsPaginated.length > 0 ? (
                currentPatientsPaginated.map((patient) => (
                  <tr key={patient._id}>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            patient.profileImage ||
                            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                          }
                          alt={patient.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        {patient.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {patient.gender}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div>{patient.contactNumber}</div>
                      <div className="text-xs text-gray-500">
                        {patient.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {patient.age}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        className="text-sm text-primary hover:text-blue-800"
                        onClick={() => handleEdit(patient)}
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        className="text-sm text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(patient._id)}
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                      <button
                        className="text-sm text-green-600 hover:text-green-800"
                        onClick={() => handleView(patient)}
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No patients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <nav
            className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-b-lg"
            aria-label="Pagination"
          >
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{indexOfFirstPatient + 1}</span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastPatient, filteredPatients.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium">{filteredPatients.length}</span>{" "}
                results
              </p>
            </div>
            <div className="flex-1 flex justify-between sm:justify-end">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="ml-3 flex space-x-1">
                {/* Render pagination buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`
                        relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md
                        ${
                          pageNumber === currentPage
                            ? "z-10 bg-primary text-white border-primary shadow-sm"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        } transition-colors
                      `}
                    >
                      {pageNumber}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </nav>
        )}
      </div>

      {/* View Patient Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onRequestClose={handleCloseViewModal}
        style={customStyles}
        contentLabel="Patient Details"
      >
        {selectedPatient && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Patient Details
              </h2>
              <button
                onClick={handleCloseViewModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex-shrink-0">
                <img
                  src={
                    selectedPatient.profileImage ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  }
                  alt={selectedPatient.name}
                  className="h-32 w-32 rounded-full object-cover mx-auto"
                />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {selectedPatient.name}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Age</p>
                    <p className="text-sm text-gray-800">
                      {selectedPatient.age}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Gender</p>
                    <p className="text-sm text-gray-800">
                      {selectedPatient.gender}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Date of Birth
                    </p>
                    <p className="text-sm text-gray-800">
                      {selectedPatient.dateOfBirth
                        ? new Date(
                            selectedPatient.dateOfBirth
                          ).toLocaleDateString("en-GB") // Formatted as DD/MM/YYYY
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Role</p>
                    <p className="text-sm text-gray-800">
                      {selectedPatient.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact</p>
                  <p className="text-sm text-gray-800">
                    {selectedPatient.contactNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-sm text-gray-800">
                    {selectedPatient.email}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="text-sm text-gray-800">
                  {selectedPatient.address || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Emergency Contact
                </p>
                <p className="text-sm text-gray-800">
                  {selectedPatient.emergencyContact || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Medical History
                </p>
                <p className="text-sm text-gray-800">
                  {selectedPatient.medicalHistory || "None"}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Patient Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        style={customStyles}
        contentLabel="Edit Patient"
      >
        {selectedPatient && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Edit Patient</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={selectedPatient.name || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={selectedPatient.age || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={selectedPatient.gender || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={
                      selectedPatient.dateOfBirth
                        ? new Date(selectedPatient.dateOfBirth)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={selectedPatient.contactNumber || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={selectedPatient.email || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Image URL
                </label>
                <input
                  type="text"
                  name="profileImage"
                  value={selectedPatient.profileImage || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Full Address"
                  value={selectedPatient.address || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medical History
                </label>
                <textarea
                  name="medicalHistory"
                  value={selectedPatient.medicalHistory || ""}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={selectedPatient.emergencyContact || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Update Patient
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Patients;
