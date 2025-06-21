import "react-toastify/dist/ReactToastify.css";
import DoctorManagementSkeleton from "../components/LoadingSkeleton/DoctorManagementSkeleton";
import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import { Clock, Edit, Eye, Search, Trash, UserPlus, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "neurologist", "cardiologist", etc.

  useEffect(() => {
    fetch("https://medlist-backend.onrender.com/api/doctor")
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setDoctors([]);
        setLoading(false);
      });
  }, []);

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleView = (doctor) => {
    setSelectedDoctor(doctor);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      fetch(`https://medlist-backend.onrender.com/api/doctor/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            toast.success("Doctor deleted successfully");
            setDoctors((prev) => prev.filter((doctor) => doctor._id !== id));
          } else {
            toast.error("Failed to delete doctor");
          }
        })
        .catch(() => toast.error("Error deleting doctor"));
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(
      `https://medlist-backend.onrender.com/api/doctor/${selectedDoctor._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify(selectedDoctor),
      }
    )
      .then((res) => {
        if (res.ok) {
          toast.success("Doctor updated successfully");
          setDoctors((prev) =>
            prev.map((doc) =>
              doc._id === selectedDoctor._id ? selectedDoctor : doc
            )
          );
          setIsModalOpen(false);
        } else {
          toast.error("Failed to update doctor");
        }
      })
      .catch(() => toast.error("Error updating doctor"));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedDoctor(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedDoctor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setSelectedDoctor((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleWorkingHoursChange = (e, field) => {
    const { value } = e.target;
    setSelectedDoctor((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [field]: value,
      },
    }));
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      doctor.specialization.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

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

  // Extract unique specializations for filter
  const specializations = [
    ...new Set(doctors.map((doc) => doc.specialization)),
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserPlus className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-gray-800">Doctors</h1>
        </div>
        <Link to="/admin/doctors/add">
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary flex items-center gap-2">
            <UserPlus className="h-5 w-5" /> Add Doctor
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-4 flex-1">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors..."
              className="flex-1 border-none outline-none text-sm text-gray-800 placeholder-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Filter by:</label>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Specializations</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec.toLowerCase()}>
                  {spec}
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
                  Specialization
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Fees
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Working Hours
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <tr key={doctor._id}>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            doctor.profileImage ||
                            "https://via.placeholder.com/40"
                          }
                          alt={doctor.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        {doctor.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {doctor.specialization}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div>{doctor.contactNumber}</div>
                      <div className="text-xs text-gray-500">
                        {doctor.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      ₹{doctor.appointmentFees}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {doctor.workingHours?.start} -{" "}
                        {doctor.workingHours?.end}
                      </div>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        className="text-sm text-primary hover:text-blue-800"
                        onClick={() => handleEdit(doctor)}
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        className="text-sm text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(doctor._id)}
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                      <button
                        className="text-sm text-green-600 hover:text-green-800"
                        onClick={() => handleView(doctor)}
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No doctors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Doctor Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onRequestClose={handleCloseViewModal}
        style={customStyles}
        contentLabel="Doctor Details"
      >
        {selectedDoctor && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Doctor Details
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
                    selectedDoctor.profileImage ||
                    "https://via.placeholder.com/150"
                  }
                  alt={selectedDoctor.name}
                  className="h-32 w-32 rounded-full object-cover mx-auto"
                />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {selectedDoctor.name}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Specialization
                    </p>
                    <p className="text-sm text-gray-800">
                      {selectedDoctor.specialization}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Experience
                    </p>
                    <p className="text-sm text-gray-800">
                      {selectedDoctor.experience} years
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      License Number
                    </p>
                    <p className="text-sm text-gray-800">
                      {selectedDoctor.licenseNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Appointment Fees
                    </p>
                    <p className="text-sm text-gray-800">
                      ₹{selectedDoctor.appointmentFees}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Working Hours
                  </p>
                  <p className="text-sm text-gray-800">
                    {selectedDoctor.workingHours?.start} -{" "}
                    {selectedDoctor.workingHours?.end}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact</p>
                  <p className="text-sm text-gray-800">
                    {selectedDoctor.contactNumber}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-sm text-gray-800">{selectedDoctor.email}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="text-sm text-gray-800">
                  {selectedDoctor.address?.line1},{" "}
                  {selectedDoctor.address?.line2},{" "}
                  {selectedDoctor.address?.pincode}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Doctor Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        style={customStyles}
        contentLabel="Edit Doctor"
      >
        {selectedDoctor && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Edit Doctor</h2>
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
                    value={selectedDoctor.name || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={selectedDoctor.specialization || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience (years)
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={selectedDoctor.experience || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Number
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={selectedDoctor.licenseNumber || ""}
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
                    value={selectedDoctor.contactNumber || ""}
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
                    value={selectedDoctor.email || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Appointment Fees
                  </label>
                  <input
                    type="number"
                    name="appointmentFees"
                    value={selectedDoctor.appointmentFees || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Working Hours
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={selectedDoctor.workingHours?.start || ""}
                      onChange={(e) => handleWorkingHoursChange(e, "start")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={selectedDoctor.workingHours?.end || ""}
                      onChange={(e) => handleWorkingHoursChange(e, "end")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    name="line1"
                    placeholder="Address Line 1"
                    value={selectedDoctor.address?.line1 || ""}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <input
                    type="text"
                    name="line2"
                    placeholder="Address Line 2"
                    value={selectedDoctor.address?.line2 || ""}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={selectedDoctor.address?.pincode || ""}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Update Doctor
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Doctors;
