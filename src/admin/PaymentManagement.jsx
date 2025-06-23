// src/PaymentManagementPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { format, parseISO } from "date-fns";
import {
  Search,
  DollarSign,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  RefreshCcw, // Added for refresh button on collection card
} from "lucide-react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import DoctorManagementSkeleton from "../components/LoadingSkeleton/DoctorManagementSkeleton"; // Re-using existing skeleton

Modal.setAppElement("#root"); // Important for accessibility with react-modal

const API_URL_APPOINTMENTS =
  "https://medlist-backend.onrender.com/api/appointment";
const API_URL_PAYMENTS = "http://localhost:5000/api/payment"; // Your local backend for payments

// Helper function to get patient name, handling null patientId
const getPatientDisplayName = (patientId) => {
  if (!patientId) {
    return "N/A";
  }
  return patientId.name || "N/A";
};

// Helper function to get doctor name, handling null doctorId
const getDoctorDisplayName = (doctorId) => {
  if (!doctorId) {
    return "N/A";
  }
  return doctorId.name || "N/A";
};

// Helper function to get patient's first letter for avatar, or a default
const getPatientAvatarLetter = (patientId) => {
  const name = getPatientDisplayName(patientId);
  return name !== "N/A" ? name.charAt(0).toUpperCase() : "U";
};

// Helper function to format date as DD-MM-YYYY
const formatDateForDisplay = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date =
      typeof dateString === "string" ? parseISO(dateString) : dateString;
    return format(date, "dd-MM-yyyy");
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return "Invalid Date";
  }
};

const PaymentManagementPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("all");

  const [todayCollection, setTodayCollection] = useState(0);

  // Modal for updating payment status
  const [isUpdatePaymentModalOpen, setIsUpdatePaymentModalOpen] =
    useState(false);
  const [selectedAppointmentForPayment, setSelectedAppointmentForPayment] =
    useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash"); // Default payment method for update

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(10); // Number of rows per page

  // --- Data Fetching ---
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL_APPOINTMENTS);
      setAppointments(response.data);
    } catch (err) {
      setError(
        "Failed to fetch appointments. Please check the API URL or network connection."
      );
      console.error("Error fetching appointments:", err);
      toast.error("Failed to fetch appointments.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTodayCollection = useCallback(async () => {
    try {
      const adminToken = localStorage.getItem("admin_token");
      const headers = adminToken
        ? { Authorization: `Bearer ${adminToken}` }
        : {};

      const response = await axios.get(`${API_URL_PAYMENTS}/today`, {
        headers,
      });
      setTodayCollection(response.data.today.totalAmount || 0);
    } catch (err) {
      console.error("Error fetching today's collection:", err);
      if (err.response && err.response.status === 403) {
        toast.error(
          "Authentication failed for collection data. Please log in as admin."
        );
      } else {
        toast.error("Failed to fetch today's collection.");
      }
      setTodayCollection(0);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
    fetchTodayCollection();

    // Refresh collection every 5 minutes
    const intervalId = setInterval(fetchTodayCollection, 300000); // 300000 ms = 5 minutes
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [fetchAppointments, fetchTodayCollection]);

  // --- Filtering Logic ---
  const filteredAppointments = useMemo(() => {
    let currentAppointments = [...appointments];

    // Filter by Search Term (Patient Name, Doctor Name)
    if (searchTerm) {
      currentAppointments = currentAppointments.filter(
        (appointment) =>
          getPatientDisplayName(appointment.patientId)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          getDoctorDisplayName(appointment.doctorId)
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Filter by Payment Status
    if (filterPaymentStatus !== "all") {
      currentAppointments = currentAppointments.filter(
        (appointment) =>
          (appointment.paymentStatus || "pending").toLowerCase() ===
          filterPaymentStatus.toLowerCase()
      );
    }

    return currentAppointments;
  }, [appointments, searchTerm, filterPaymentStatus]);

  // --- Pagination Logic ---
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointmentsPaginated = filteredAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  const totalPages = Math.ceil(
    filteredAppointments.length / appointmentsPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // --- Payment Modal Handlers ---
  const openUpdatePaymentModal = (appointment) => {
    setSelectedAppointmentForPayment({ ...appointment }); // Create a copy
    setPaymentMethod(
      appointment.paymentStatus === "completed" ? "cash" : "cash"
    ); // Default to cash
    setIsUpdatePaymentModalOpen(true);
  };

  const closeUpdatePaymentModal = () => {
    setIsUpdatePaymentModalOpen(false);
    setSelectedAppointmentForPayment(null);
    setPaymentMethod("cash");
  };

  const handleUpdatePaymentStatus = async (e) => {
    e.preventDefault();
    if (!selectedAppointmentForPayment) return;

    const originalPaymentStatus = appointments.find(
      (app) => app._id === selectedAppointmentForPayment._id
    )?.paymentStatus;

    // Data to update the appointment's payment status
    const updateAppointmentPayload = {
      ...selectedAppointmentForPayment,
      paymentStatus: selectedAppointmentForPayment.paymentStatus, // Use the status from the form
    };

    try {
      const adminToken = localStorage.getItem("admin_token");
      if (!adminToken) {
        toast.error("Authentication token missing. Please log in.");
        return;
      }

      // First, update the appointment record itself (status, fees if changed in future)
      const updateAppointmentRes = await axios.put(
        `${API_URL_PAYMENTS}/payment-status/${selectedAppointmentForPayment._id}`,
        updateAppointmentPayload,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (updateAppointmentRes.status === 200) {
        toast.success("Appointment status updated successfully!");
        // Update local appointments state
        setAppointments((prev) =>
          prev.map((app) =>
            app._id === selectedAppointmentForPayment._id
              ? {
                  ...app,
                  paymentStatus: selectedAppointmentForPayment.paymentStatus,
                }
              : app
          )
        );

        // If payment status changed to 'completed' AND it wasn't already completed,
        // then send a POST request to record the payment.
        if (
          selectedAppointmentForPayment.paymentStatus === "completed" &&
          originalPaymentStatus !== "completed"
        ) {
          try {
            const paymentPayload = {
              appointmentId: selectedAppointmentForPayment._id,
              patient: selectedAppointmentForPayment.patientId._id,
              doctor: selectedAppointmentForPayment.doctorId._id,
              amount: selectedAppointmentForPayment.doctorId?.appointmentFees,
              paymentMethod: paymentMethod, // Use the selected method from the modal
              status: "completed",
            };
            await axios.post(API_URL_PAYMENTS, paymentPayload, {
              headers: {
                Authorization: `Bearer ${adminToken}`,
                "Content-Type": "application/json",
              },
            });
            toast.success("Payment recorded in collection!");
            fetchTodayCollection(); // Refresh today's collection
          } catch (paymentErr) {
            console.error("Error recording payment:", paymentErr);
            const paymentErrMsg =
              paymentErr.response?.data?.message || "Failed to record payment.";
            toast.error(paymentErrMsg);
            // Optionally, revert appointment status if payment recording fails,
            // or mark it as partially paid, etc., depending on business logic.
            // For now, we'll just log and display an error.
          }
        } else if (
          selectedAppointmentForPayment.paymentStatus !== "completed" &&
          originalPaymentStatus === "completed"
        ) {
          // If status changed from completed to something else, you might want to consider refund/adjustment logic.
          // For now, we'll just show a warning.
          toast.info(
            "Payment status changed from 'completed'. Collection might need manual adjustment if a payment record exists."
          );
        }
      } else {
        toast.error("Failed to update appointment status.");
      }
    } catch (err) {
      console.error("Error updating appointment or payment:", err);
      const errMsg =
        err.response?.data?.message || "An error occurred during update.";
      toast.error(errMsg);
    } finally {
      closeUpdatePaymentModal(); // Close modal whether successful or not
    }
  };

  if (loading) {
    return <DoctorManagementSkeleton />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-red-500 text-xl font-medium text-center p-4">
          Error: {error}
          <p className="mt-2 text-sm text-gray-600">
            Please try refreshing the page or check your network connection.
          </p>
        </div>
      </div>
    );
  }

  const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      maxWidth: "500px", // Smaller max width for payment modal
      width: "90%",
      borderRadius: "8px",
      padding: "0",
      border: "none",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      zIndex: 1001,
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1000,
    },
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-7xl mx-auto font-sans">
      {/* Today's Collection Card */}
      <div className="bg-gradient-to-r from-blue-500 to-primary text-white rounded-lg p-6 mb-6 shadow-md flex items-center justify-between">
        <div className="flex items-center">
          <DollarSign className="w-8 h-8 mr-4" />
          <div>
            <h2 className="text-xl font-semibold">Today's Collection</h2>
            <p className="text-3xl font-bold">₹ {todayCollection}</p>
          </div>
        </div>
        <button
          onClick={fetchTodayCollection}
          className="bg-white text-primary px-4 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2 shadow"
        >
          <RefreshCcw className="w-5 h-5" /> Refresh
        </button>
      </div>

      {/* Header for Appointment List */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Appointments</h1>
        {/* You can add a 'New Appointment' button here if desired */}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by Patient or Doctor Name"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          />
        </div>
        <div className="relative">
          <label htmlFor="paymentStatusFilter" className="sr-only">
            Filter by Payment Status
          </label>
          <select
            id="paymentStatusFilter"
            value={filterPaymentStatus}
            onChange={(e) => {
              setFilterPaymentStatus(e.target.value);
              setCurrentPage(1); // Reset to first page on filter change
            }}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-gray-700"
          >
            <option value="all">All Payment Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Appointment Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Patient Name (ID)
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Doctor Name (ID)
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Fees
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentAppointmentsPaginated.length > 0 ? (
              currentAppointmentsPaginated.map((appointment) => (
                <tr
                  key={appointment._id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>
                        {formatDateForDisplay(appointment.appointmentDate)}
                      </span>
                      <span className="ml-2 font-medium">
                        {appointment.appointmentTime}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold text-sm border border-gray-200">
                        {getPatientAvatarLetter(appointment.patientId)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 capitalize">
                          {getPatientDisplayName(appointment.patientId)}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {appointment.patientId?._id || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <div className="ml-0">
                        <div className="text-sm font-medium text-gray-900">
                          {getDoctorDisplayName(appointment.doctorId)}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {appointment.doctorId?._id || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{appointment.doctorId?.appointmentFees || "0.00"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        appointment.paymentStatus === "Completed"
                          ? "bg-green-100 text-green-800"
                          : appointment.paymentStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : appointment.paymentStatus === "Refunded"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {appointment.paymentStatus === "Completed" ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : appointment.paymentStatus === "Refunded" ? (
                        <XCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <CreditCard className="w-3 h-3 mr-1" />
                      )}
                      {appointment.paymentStatus || "pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openUpdatePaymentModal(appointment)}
                      className="text-primary hover:text-blue-800 flex items-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1"
                      title="Update Payment Status"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Update Payment
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 text-center text-gray-500 py-8">
                  No appointments found for the selected criteria.
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
              <span className="font-medium">{indexOfFirstAppointment + 1}</span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastAppointment, filteredAppointments.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium">{filteredAppointments.length}</span>{" "}
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

      {/* Update Payment Status Modal */}
      <Modal
        isOpen={isUpdatePaymentModalOpen}
        onRequestClose={closeUpdatePaymentModal}
        style={customModalStyles}
        contentLabel="Update Payment Status"
      >
        {selectedAppointmentForPayment && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Update Payment Status
              </h2>
              <button
                onClick={closeUpdatePaymentModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleUpdatePaymentStatus} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    value={getPatientDisplayName(
                      selectedAppointmentForPayment.patientId
                    )}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Doctor Name
                  </label>
                  <input
                    type="text"
                    value={getDoctorDisplayName(
                      selectedAppointmentForPayment.doctorId
                    )}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Date & Time
                </label>
                <input
                  type="text"
                  value={`${formatDateForDisplay(
                    selectedAppointmentForPayment.appointmentDate
                  )} at ${selectedAppointmentForPayment.appointmentTime}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Fees (₹)
                </label>
                <input
                  type="number"
                  name="appointmentFees"
                  value={
                    selectedAppointmentForPayment.doctorId?.appointmentFees || 0
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                  disabled // Should be read-only as it comes from appointment
                />
              </div>

              <div>
                <label
                  htmlFor="paymentStatus"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Payment Status
                </label>
                <select
                  id="paymentStatus"
                  name="paymentStatus"
                  value={
                    selectedAppointmentForPayment.paymentStatus || "pending"
                  }
                  onChange={(e) =>
                    setSelectedAppointmentForPayment((prev) => ({
                      ...prev,
                      paymentStatus: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              {selectedAppointmentForPayment.paymentStatus === "completed" && (
                <div>
                  <label
                    htmlFor="paymentMethod"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Payment Method
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="online">Online</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Confirm Update
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PaymentManagementPage;
