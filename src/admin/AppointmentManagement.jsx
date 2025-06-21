// src/AppointmentManagementPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { format, parseISO, isPast, isToday } from "date-fns";
import { Link } from "react-router-dom";
import {
  Search,
  CalendarDays,
  Plus,
  ChevronUp,
  ChevronDown,
  Repeat,
  Trash2,
  FileText, // Import the FileText icon for CSV export
} from "lucide-react";
import DoctorManagementSkeleton from "../components/LoadingSkeleton/DoctorManagementSkeleton";

const API_URL = "https://medlist-backend.onrender.com/api/appointment";

// --- Helper Functions (remain unchanged) ---

// Helper function to get patient name, handling null patientId
const getPatientDisplayName = (patientId) => {
  if (!patientId) {
    return "N/A"; // Or a placeholder like 'Guest Patient'
  }
  return patientId.name || "N/A";
};

// Helper function to get doctor name, handling null doctorId
const getDoctorDisplayName = (doctorId) => {
  if (!doctorId) {
    return "N/A"; // Or a placeholder like 'Unknown Doctor'
  }
  return doctorId.name || "N/A";
};

// Helper function to get patient's first letter for avatar, or a default
const getPatientAvatarLetter = (patientId) => {
  const name = getPatientDisplayName(patientId);
  return name !== "N/A" ? name.charAt(0).toUpperCase() : "U"; // U for Unknown
};

// Helper function to get patient age, handling null patientId or missing age
const getPatientAge = (appointment) => {
  // Assuming patientId in the appointment object *might* have an 'age' property.
  // The provided sample API response for doctorId didn't show a patient object with age,
  // so this assumes patientId, when populated, would have an 'age' property.
  return appointment.patientId?.age || "N/A";
};

// --- Main Component ---
const AppointmentManagementPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("new"); // 'new' or 'completed'
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState(""); // Format:YYYY-MM-DD for input type="date"
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(10); // Number of rows per page as per image

  // --- Data Fetching ---
  useEffect(() => {
    const fetchAppointments = async () => {
      // Inside your useEffect's fetchAppointments function:
      try {
        setLoading(true);
        const response = await axios.get(API_URL);

        setAppointments(response.data);
      } catch (err) {
        setError(
          "Failed to fetch appointments. Please check the API URL or network connection."
        );
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []); // Empty dependency array means this runs once on mount

  // --- Filtering and Sorting Logic ---
  const filteredAndSortedAppointments = useMemo(() => {
    let currentAppointments = [...appointments];

    // 1. Filter by Active Tab (New/Completed)
    currentAppointments = currentAppointments.filter((appointment) => {
      // Robust check for appointment.appointmentDate existence and type
      if (
        !appointment.appointmentDate ||
        typeof appointment.appointmentDate !== "string"
      ) {
        // console.warn('Skipping appointment due to missing or invalid date type:', appointment);
        return false; // Exclude appointments without a date or non-string date
      }

      const appointmentDate = parseISO(appointment.appointmentDate);
      // Check if parseISO successfully created a valid date object
      if (isNaN(appointmentDate.getTime())) {
        // console.warn('Skipping appointment due to unparseable date string:', appointment.appointmentDate, 'for appointment:', appointment);
        return false; // Skip if date string is unparseable
      }

      // An appointment is "completed" if its date is in the past, but not today
      // (Today's appointments are considered "new" until their time passes).
      const isCompleted = isPast(appointmentDate) && !isToday(appointmentDate);
      return activeTab === "new" ? !isCompleted : isCompleted;
    });

    // 2. Filter by Search Term
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

    // 3. Filter by Specific Date
    if (filterDate) {
      currentAppointments = currentAppointments.filter((appointment) => {
        if (
          !appointment.appointmentDate ||
          typeof appointment.appointmentDate !== "string"
        )
          return false; // Already handled above but good to re-check
        const appDate = parseISO(appointment.appointmentDate);
        if (isNaN(appDate.getTime())) return false; // Skip if date is unparseable

        // Compare the formatted date from API with the filterDate (both YYYY-MM-DD)
        // For filtering, we still need YYYY-MM-DD to match the input type="date"
        return format(appDate, "yyyy-MM-dd") === filterDate;
      });
    }

    // 4. Sort
    if (sortConfig.key) {
      currentAppointments.sort((a, b) => {
        let aValue, bValue;

        switch (sortConfig.key) {
          case "time":
            // Assume appointment.time is a string like "HH:MM"
            aValue = a.appointmentTime || "";
            bValue = b.appointmentTime || "";
            break;
          case "date":
            // Convert date strings to timestamps for reliable comparison
            aValue =
              a.appointmentDate &&
              typeof a.appointmentDate === "string" &&
              !isNaN(parseISO(a.appointmentDate).getTime())
                ? parseISO(a.appointmentDate).getTime()
                : 0; // Default to 0 for invalid dates, placing them at the beginning/end
            bValue =
              b.appointmentDate &&
              typeof b.appointmentDate === "string" &&
              !isNaN(parseISO(b.appointmentDate).getTime())
                ? parseISO(b.appointmentDate).getTime()
                : 0;
            break;
          case "patientName":
            aValue = getPatientDisplayName(a.patientId);
            bValue = getPatientDisplayName(b.patientId); // Corrected to use getPatientDisplayName for 'b'
            break;
          case "patientAge":
            aValue = a.patientId?.age || 0; // Default to 0 for missing age for sorting
            bValue = b.patientId?.age || 0;
            break;
          case "doctor":
            aValue = getDoctorDisplayName(a.doctorId);
            bValue = getDoctorDisplayName(b.doctorId);
            break;
          default:
            return 0; // No sorting if key is unknown
        }

        if (typeof aValue === "string") {
          return sortConfig.direction === "ascending"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else {
          // For numbers or date timestamps
          return sortConfig.direction === "ascending"
            ? aValue - bValue
            : bValue - aValue;
        }
      });
    }

    return currentAppointments;
  }, [appointments, activeTab, searchTerm, filterDate, sortConfig]);

  // --- Pagination Logic ---
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointmentsPaginated = filteredAndSortedAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  const totalPages = Math.ceil(
    filteredAndSortedAppointments.length / appointmentsPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // --- Sorting UI Helpers ---
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page when sort criteria changes
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="w-3 h-3 ml-1" />
    ) : (
      <ChevronDown className="w-3 h-3 ml-1" />
    );
  };

  // --- Action Handlers ---
  const handleReschedule = (appointmentId) => {
    alert(`Reschedule appointment with ID: ${appointmentId}`);
    // Here you would typically open a modal or navigate to a reschedule form.
    // After a successful reschedule, you'd likely refetch appointments or update the state.
  };

  const handleDelete = async (appointmentId) => {
    if (window.confirm(`Are you sure you want to delete this appointment?`)) {
      try {
        // Assuming your backend has a DELETE endpoint like /api/appointment/:id
        await axios.delete(`${API_URL}/${appointmentId}`);
        // Update the state to remove the deleted appointment without re-fetching all data
        setAppointments((prevAppointments) =>
          prevAppointments.filter((app) => app._id !== appointmentId)
        );
        alert("Appointment deleted successfully!");
      } catch (err) {
        setError("Failed to delete appointment. Please try again.");
        console.error("Error deleting appointment:", err);
      }
    }
  };

  const handleExportCsv = () => {
    const headers = [
      "Appointment Time",
      "Appointment Date",
      "Patient Name",
      "Patient Age",
      "Doctor Name",
      "Status",
    ];

    const data = filteredAndSortedAppointments.map((appointment) => {
      const appointmentDate = appointment.appointmentDate
        ? format(parseISO(appointment.appointmentDate), "dd-MM-yyyy")
        : "N/A"; // Format for CSV
      const status =
        isPast(parseISO(appointment.appointmentDate)) &&
        !isToday(parseISO(appointment.appointmentDate))
          ? "Completed"
          : "New";
      return [
        appointment.appointmentTime || "N/A",
        appointmentDate, // Use the formatted date here
        getPatientDisplayName(appointment.patientId),
        getPatientAge(appointment),
        getDoctorDisplayName(appointment.doctorId),
        status,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...data.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "appointments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Conditional Rendering for Loading/Error States ---
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

  // --- Main Component JSX ---
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Appointment Management
        </h1>
        <div className="flex space-x-3">
          {" "}
          {/* Use a div to group buttons */}
          <button
            onClick={handleExportCsv}
            className="flex items-center px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 shadow-md"
          >
            <FileText className="w-5 h-5 mr-2" />
            Export to CSV
          </button>
          <Link to="/admin/appointments/book" className="no-underline">
            <button className="flex items-center px-5 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors duration-200 shadow-md">
              <Plus className="w-5 h-5 mr-2" />
              New Appointment
            </button>
          </Link>
        </div>
      </div>

      {/* Tabs for New/Completed Appointments */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => {
              setActiveTab("new");
              setCurrentPage(1);
            }}
            className={` capitalize
              ${
                activeTab === "new"
                  ? "border-primary text-primary font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
              whitespace-nowrap py-3 px-1 border-b-2 text-base font-medium transition-colors duration-200 focus:outline-none 
            `}
          >
            New Appointments
          </button>
          <button
            onClick={() => {
              setActiveTab("completed");
              setCurrentPage(1);
            }}
            className={`
              ${
                activeTab === "completed"
                  ? "border-primary text-primary font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
              whitespace-nowrap py-3 px-1 border-b-2 text-base font-medium transition-colors duration-200 focus:outline-none 
            `}
          >
            Completed Appointments
          </button>
        </nav>
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
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          />
        </div>
        <div className="relative">
          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => {
              setFilterDate(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-gray-700 appearance-none"
            // The `appearance-none` class helps with custom styling of date inputs across browsers
          />
        </div>
      </div>

      {/* Appointments Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => requestSort("time")}
              >
                <div className="flex items-center">
                  Time
                  {getSortIndicator("time")}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => requestSort("date")}
              >
                <div className="flex items-center">
                  Date
                  {getSortIndicator("date")}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => requestSort("patientName")}
              >
                <div className="flex items-center">
                  Patient Name
                  {getSortIndicator("patientName")}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => requestSort("patientAge")}
              >
                <div className="flex items-center">
                  Patient Age
                  {getSortIndicator("patientAge")}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => requestSort("doctor")}
              >
                <div className="flex items-center">
                  Doctor
                  {getSortIndicator("doctor")}
                </div>
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
                    {appointment.appointmentTime || "N/A"}
                    {/* Assumed directly available */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {/* Safely format date for display in DD-MM-YYYY */}
                    {appointment.appointmentDate
                      ? format(
                          parseISO(appointment.appointmentDate),
                          "dd-MM-yyyy"
                        )
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {appointment.patientId?.profileImage ? (
                        <img
                          className="h-9 w-9 rounded-full object-cover border border-gray-200"
                          src={appointment.patientId.profileImage}
                          alt={getPatientDisplayName(appointment.patientId)}
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold text-sm border border-gray-200">
                          {getPatientAvatarLetter(appointment.patientId)}
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {getPatientDisplayName(appointment.patientId)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getPatientAge(appointment)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getDoctorDisplayName(appointment.doctorId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {activeTab === "new" && ( // Only show reschedule for new appointments
                        <button
                          onClick={() => handleReschedule(appointment._id)}
                          className="text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
                          title="Reschedule Appointment"
                        >
                          <Repeat className="w-4 h-4 mr-1" />
                          Reschedule
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(appointment._id)}
                        className="text-red-600 hover:text-red-800 flex items-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md px-2 py-1"
                        title="Delete Appointment"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="sr-only md:not-sr-only ml-1">
                          Delete
                        </span>{" "}
                        {/* Show text on medium+ screens */}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6  text-center text-gray-500 py-8"
                >
                  No appointments found for this view.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
                {Math.min(
                  indexOfLastAppointment,
                  filteredAndSortedAppointments.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium">
                {filteredAndSortedAppointments.length}
              </span>{" "}
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
  );
};

export default AppointmentManagementPage;
