// import React, { useEffect, useState } from "react";
// import {
//   FaCalendarCheck,
//   FaUserInjured,
//   FaUserMd,
//   FaStethoscope,
//   FaRupeeSign,
// } from "react-icons/fa";
// import fetchFromApi from "../utility/fetchFromApi";
// import { Link, Route, Routes } from "react-router-dom";
// import Patients from "./Patients";
// import Doctors from "./Doctors";
// import Appointments from "./Appointments";

// const AdminDashboard = () => {
//   // Dummy data for appointments
//   const [appointments, setAppointments] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [patients, setPatients] = useState([]);

//   useEffect(() => {
//     fetchFromApi("https://medlist-backend.onrender.com/api/appointment", "get")
//       .then((data) => {
//         setAppointments(data);
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error.message);
//       });
//     fetchFromApi("https://medlist-backend.onrender.com/api/doctor", "get", null)
//       .then((data) => {
//         setDoctors(data.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error.message);
//       });
//     fetchFromApi("https://medlist-backend.onrender.com/api/patient", "get")
//       .then((data) => {
//         setPatients(data.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error.message);
//       });
//   }, []);
//   // Calculate total appointments and paid appointments
//   const totalAppointments = appointments.length || 0;
//   //calculate doctors and patients
//   const totalDoctors = doctors.length || 0;
//   const totalPatients = patients.length || 0;

//   return (
//     <div className="p-6 min-h-screen">
//       <h1 className="text-3xl font-bold text-primary mb-6">Admin Dashboard</h1>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//         {/* Total Appointments */}
//         <Link to="/admin/appointments">
//           <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
//             <div className="bg-primary p-3 rounded-full text-white mr-4">
//               <FaCalendarCheck size={24} />
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold text-secondary">
//                 Total Appointments
//               </h3>
//               <p className="text-2xl font-bold">{totalAppointments}</p>
//             </div>
//           </div>
//         </Link>

//         {/* Total Patients */}
//         <Link to="/admin/patients">
//           <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
//             <div className="bg-primary p-3 rounded-full text-white mr-4">
//               <FaUserInjured size={24} />
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold text-secondary">
//                 Total Patients
//               </h3>
//               <p className="text-2xl font-bold">{totalPatients}</p>
//             </div>
//           </div>
//         </Link>

//         {/* Total Doctors */}
//         <Link to="/admin/doctors">
//           <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
//             <div className="bg-secondary p-3 rounded-full text-white mr-4">
//               <FaUserMd size={24} />
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold text-secondary">
//                 Total Doctors
//               </h3>
//               <p className="text-2xl font-bold">{totalDoctors}</p>
//             </div>
//           </div>
//         </Link>
//       </div>

//       {/* Recent Appointments Table */}

//       <Routes>
//         <Route
//           path="/"
//           element={
//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <h2 className="text-xl font-semibold text-secondary mb-4 flex items-center">
//                 <FaStethoscope className="mr-2" /> Recent Appointments
//               </h2>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-[#d2d2d2]">
//                     <tr className="bg-gray-200">
//                       <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
//                         Patient
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
//                         Doctor
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
//                         Date
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
//                         Status
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {appointments
//                       .slice(0, 5)
//                       .reverse()
//                       .map((appointment) => (
//                         <tr key={appointment.id} className="hover:bg-[#f0f0f0]">
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium ">
//                             {appointment.patientId?.name || "Unknown"}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm ">
//                             {appointment.doctorId?.name || "Unknown"}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm ">
//                             {appointment.appointmentDate.slice(0, 10)}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm ">
//                             <span
//                               className={`px-4 py-2 rounded-full text-sm  text-white ${
//                                 appointment.status === "Completed"
//                                   ? "bg-[#1c841c]"
//                                   : appointment.status === "Cancelled"
//                                   ? "bg-[#920c0c]"
//                                   : "bg-[#855900]"
//                               }`}
//                             >
//                               {appointment.status}
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           }
//         />
//         <Route path="/patients" element={<Patients />} />
//         <Route path="/doctors" element={<Doctors />} />
//         <Route path="/appointments" element={<Appointments />} />
//       </Routes>
//     </div>
//   );
// };

// export default AdminDashboard;

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Calendar,
  Users,
  UserCheck,
  DollarSign,
  Settings,
  BarChart3,
  FileText,
  Shield,
  Bell,
  Search,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
} from "lucide-react";
import { FaRupeeSign } from "react-icons/fa";

// Navigation options data
const navigationOptions = [
  {
    id: 1,
    title: "Dashboard",
    icon: BarChart3,
    description: "Overview and analytics",
    href: "/admin/dashboard",
  },
  {
    id: 2,
    title: "Manage Doctors",
    icon: UserCheck,
    description: "Doctor management",
    href: "/admin/doctors",
  },
  {
    id: 3,
    title: "Manage Patients",
    icon: Users,
    description: "Patient management",
    href: "/admin/patients",
  },
  {
    id: 4,
    title: "Appointments",
    icon: Calendar,
    description: "Appointment oversight",
    href: "/admin/appointments",
  },
  {
    id: 5,
    title: "Reports",
    icon: FileText,
    description: "Generate reports",
    href: "/admin/reports",
  },
  {
    id: 6,
    title: "Settings",
    icon: Settings,
    description: "System configuration",
    href: "/admin/settings",
  },
];

// Admin stats data
const adminStats = [
  {
    id: 1,
    title: "Total Appointments",
    count: 1247,
    trend: "+12%",
    trendUp: true,
    icon: Calendar,
    bgColor: "bg-[#66B406]",
    textColor: "text-white",
  },
  {
    id: 2,
    title: "Total Doctors",
    count: 24,
    trend: "+2",
    trendUp: true,
    icon: UserCheck,
    bgColor: "bg-white border-2 border-gray-200",
    textColor: "text-gray-900",
  },
  {
    id: 3,
    title: "Total Patients",
    count: 892,
    trend: "+45",
    trendUp: true,
    icon: Users,
    bgColor: "bg-black",
    textColor: "text-white",
  },
  {
    id: 4,
    title: "Today's Collection",
    count: "₹12,450",
    trend: "+8.5%",
    trendUp: true,
    icon: FaRupeeSign,
    bgColor: "bg-white border-2 border-gray-200",
    textColor: "text-gray-900",
  },
];

// Weekly appointment trend data
const weeklyTrendData = [
  { day: "Mon", appointments: 45, bookings: 52 },
  { day: "Tue", appointments: 38, bookings: 41 },
  { day: "Wed", appointments: 62, bookings: 58 },
  { day: "Thu", appointments: 55, bookings: 49 },
  { day: "Fri", appointments: 71, bookings: 68 },
  { day: "Sat", appointments: 34, bookings: 38 },
  { day: "Sun", appointments: 28, bookings: 31 },
];

// Demographics data
const demographicsData = [
  { name: "Male", value: 456, color: "#66B406" },
  { name: "Female", value: 436, color: "#000000" },
];

// Appointments data for management
const appointmentsData = [
  {
    id: 1,
    patientName: "Sarah Johnson",
    doctorName: "Dr. Smith",
    date: "2024-12-15",
    time: "09:00 AM",
    type: "Consultation",
    status: "scheduled",
    amount: "$150",
  },
  {
    id: 2,
    patientName: "Michael Chen",
    doctorName: "Dr. Brown",
    date: "2024-12-15",
    time: "10:30 AM",
    type: "Follow-up",
    status: "completed",
    amount: "$100",
  },
  {
    id: 3,
    patientName: "Emily Davis",
    doctorName: "Dr. Wilson",
    date: "2024-12-15",
    time: "02:00 PM",
    type: "Check-up",
    status: "scheduled",
    amount: "$120",
  },
  {
    id: 4,
    patientName: "Robert Wilson",
    doctorName: "Dr. Johnson",
    date: "2024-12-15",
    time: "03:30 PM",
    type: "Consultation",
    status: "pending",
    amount: "$180",
  },
  {
    id: 5,
    patientName: "Lisa Anderson",
    doctorName: "Dr. Davis",
    date: "2024-12-14",
    time: "11:00 AM",
    type: "Surgery Consultation",
    status: "cancelled",
    amount: "$250",
  },
  {
    id: 6,
    patientName: "David Thompson",
    doctorName: "Dr. Miller",
    date: "2024-12-16",
    time: "04:00 PM",
    type: "Follow-up",
    status: "scheduled",
    amount: "$90",
  },
];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [appointments, setAppointments] = useState(appointmentsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        bg: "bg-[#66B406]",
        text: "text-white",
        label: "Completed",
        icon: CheckCircle,
      },
      scheduled: {
        bg: "bg-blue-600",
        text: "text-white",
        label: "Scheduled",
        icon: Clock,
      },
      pending: {
        bg: "bg-yellow-500",
        text: "text-white",
        label: "Pending",
        icon: Clock,
      },
      cancelled: {
        bg: "bg-red-500",
        text: "text-white",
        label: "Cancelled",
        icon: XCircle,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} flex items-center space-x-1`}
      >
        <IconComponent size={12} />
        <span>{config.label}</span>
      </span>
    );
  };

  const updateAppointmentStatus = (appointmentId, newStatus) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === appointmentId
          ? { ...appointment, status: newStatus }
          : appointment
      )
    );
  };

  const deleteAppointment = (appointmentId) => {
    setAppointments((prev) =>
      prev.filter((appointment) => appointment.id !== appointmentId)
    );
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg border-gray-200">
          <p className="font-medium text-gray-900">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
          </div>
        </div>

        {/* Quick Navigation */}
        <div>
          <h2 className=" text-sm font-thin text-gray-500 mt-4 my-2">
            Quick Navigation
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {navigationOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <div
                  key={option.id}
                  className={`bg-white rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg  border-2 ${
                    hoveredCard === option.id
                      ? "border-[#66B406] shadow-lg"
                      : "border-gray-100"
                  }`}
                  onMouseEnter={() => setHoveredCard(option.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <IconComponent size={24} className="text-[#66B406]" />
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm">
                      {option.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminStats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.id}
                className={`${stat.bgColor} ${stat.textColor} rounded-lg p-6 transition-all duration-200 hover:shadow-lg hover:scale-105`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        stat.textColor === "text-white"
                          ? "text-gray-200"
                          : "text-gray-600"
                      }`}
                    >
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold mt-1">{stat.count}</p>
                    <div className="flex items-center mt-2">
                      <span
                        className={`text-sm ${
                          stat.trendUp ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {stat.trendUp ? "↗" : "↘"} {stat.trend}
                      </span>
                    </div>
                  </div>
                  <div className="opacity-80">
                    <IconComponent size={32} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Trend Chart (2/3 width) */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="mr-2 text-[#66B406]" size={20} />
              Weekly Appointment Booking Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="appointments"
                  stroke="#66B406"
                  strokeWidth={3}
                  dot={{ fill: "#66B406", strokeWidth: 2, r: 6 }}
                  name="Completed Appointments"
                />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#000000"
                  strokeWidth={2}
                  dot={{ fill: "#000000", strokeWidth: 2, r: 4 }}
                  name="New Bookings"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Demographics Chart (1/3 width) */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="mr-2 text-[#66B406]" size={20} />
              Patient Demographics
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={demographicsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {demographicsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {demographicsData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Appointment Management Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="mr-2 text-[#66B406]" size={20} />
              Manage Appointments
            </h3>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66B406] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66B406] focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Patient
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Doctor
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Date & Time
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">
                        {appointment.patientName}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-900">
                        {appointment.doctorName}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-900">{appointment.date}</div>
                      <div className="text-sm text-gray-600">
                        {appointment.time}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-900">
                      {appointment.type}
                    </td>
                    <td className="py-3 px-4 text-gray-900 font-medium">
                      {appointment.amount}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(appointment.status)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors duration-200"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <select
                          className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-[#66B406]"
                          value={appointment.status}
                          onChange={(e) =>
                            updateAppointmentStatus(
                              appointment.id,
                              e.target.value
                            )
                          }
                        >
                          <option value="scheduled">Scheduled</option>
                          <option value="completed">Completed</option>
                          <option value="pending">Pending</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors duration-200"
                          title="Delete Appointment"
                          onClick={() => deleteAppointment(appointment.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAppointments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No appointments found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
