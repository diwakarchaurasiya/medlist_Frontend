import {
  CalendarCheck2,
  CalendarPlus,
  FileText,
  LayoutDashboard,
  Search,
  UserCog,
  UserSquare,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const navigationOptions = [
  {
    id: 2,
    title: "View Appointments",
    icon: <CalendarCheck2 className="w-5 h-5" />,
    linkTo: "/doctor/appointments/view",
  },
  {
    id: 3,
    title: "Schedule Availability",
    icon: <CalendarPlus className="w-5 h-5" />,
    linkTo: "/doctor/appointments/schedule",
  },
  {
    id: 4,
    title: "My Patients",
    icon: <UserSquare className="w-5 h-5" />,
    linkTo: "/doctor/patients/my-patients",
  },
  {
    id: 5,
    title: "Search Patients",
    icon: <Search className="w-5 h-5" />,
    linkTo: "/doctor/patients/search",
  },
  {
    id: 6,
    title: "Reports",
    icon: <FileText className="w-5 h-5" />,
    linkTo: "/doctor/reports",
  },
];

// Appointment stats data
const appointmentStats = [
  {
    id: 1,
    title: "Today's Appointments",
    count: 12,
    trend: "+3",
    trendUp: true,
    icon: "📅",
    bgColor: "bg-primary",
    textColor: "text-white",
  },
  {
    id: 2,
    title: "Completed Appointments",
    count: 45,
    trend: "+8",
    trendUp: true,
    icon: "✅",
    bgColor: "bg-black",
    textColor: "text-white",
  },
  {
    id: 3,
    title: "Pending Appointments",
    count: 7,
    trend: "-2",
    trendUp: false,
    icon: "⏳",
    bgColor: "bg-white border-2 border-gray-200",
    textColor: "text-gray-900",
  },
];

// Recent appointments data
const recentAppointments = [
  {
    id: 1,
    patientName: "Sarah Johnson",
    time: "09:00 AM",
    date: "Today",
    type: "Consultation",
    status: "completed",
    avatar: "SJ",
  },
  {
    id: 2,
    patientName: "Michael Chen",
    time: "10:30 AM",
    date: "Today",
    type: "Follow-up",
    status: "completed",
    avatar: "MC",
  },
  {
    id: 3,
    patientName: "Emily Davis",
    time: "02:00 PM",
    date: "Today",
    type: "Check-up",
    status: "scheduled",
    avatar: "ED",
  },
  {
    id: 4,
    patientName: "Robert Wilson",
    time: "03:30 PM",
    date: "Today",
    type: "Consultation",
    status: "pending",
    avatar: "RW",
  },
];

// All appointments data
const allAppointments = [
  {
    id: 1,
    patientName: "John Smith",
    date: "Dec 15, 2024",
    time: "09:00 AM",
    type: "Annual Check-up",
    status: "completed",
    duration: "45 min",
  },
  {
    id: 2,
    patientName: "Maria Garcia",
    date: "Dec 14, 2024",
    time: "11:00 AM",
    type: "Consultation",
    status: "completed",
    duration: "30 min",
  },
  {
    id: 3,
    patientName: "David Brown",
    date: "Dec 16, 2024",
    time: "02:00 PM",
    type: "Follow-up",
    status: "scheduled",
    duration: "20 min",
  },
  {
    id: 4,
    patientName: "Jennifer Lee",
    date: "Dec 13, 2024",
    time: "10:00 AM",
    type: "Consultation",
    status: "cancelled",
    duration: "35 min",
  },
  {
    id: 5,
    patientName: "Alex Thompson",
    date: "Dec 17, 2024",
    time: "04:00 PM",
    type: "Check-up",
    status: "pending",
    duration: "25 min",
  },
  {
    id: 6,
    patientName: "Lisa Anderson",
    date: "Dec 12, 2024",
    time: "03:00 PM",
    type: "Follow-up",
    status: "completed",
    duration: "20 min",
  },
];

// Chart data
const chartData = [
  { name: "Completed", value: 45, color: "#66B406" },
  { name: "Cancelled", value: 8, color: "#262626" },
  { name: "Scheduled", value: 12, color: "#C6F00D" },
];

const barChartData = [
  { name: "Mon", completed: 8, cancelled: 1, scheduled: 3 },
  { name: "Tue", completed: 6, cancelled: 2, scheduled: 4 },
  { name: "Wed", completed: 9, cancelled: 0, scheduled: 2 },
  { name: "Thu", completed: 7, cancelled: 1, scheduled: 5 },
  { name: "Fri", completed: 10, cancelled: 2, scheduled: 3 },
  { name: "Sat", completed: 5, cancelled: 1, scheduled: 1 },
  { name: "Sun", completed: 3, cancelled: 1, scheduled: 2 },
];

export default function DoctorDashboard() {
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeChart, setActiveChart] = useState("pie");

  useEffect(() => {
    // Simulate loading with 2 second timeout
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { bg: "bg-black", text: "text-white", label: "Completed" },
      scheduled: { bg: "bg-blue-600", text: "text-white", label: "Scheduled" },
      pending: { bg: "bg-yellow-500", text: "text-white", label: "Pending" },
      cancelled: { bg: "bg-red-500", text: "text-white", label: "Cancelled" },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg border-gray-200">
          <p className="font-medium text-gray-900">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="  p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Welcome back, Dr. Smith
            </h1>
          </div>
        </div>

        {/* Navigation Options */}
        <div>
          <h2 className="text-md  text-gray-500 my-2 font-light">
            Quick Navigation
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {navigationOptions.map((option) => (
              <Link
                to={option.linkTo}
                key={option.id}
                className="bg-white rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-primary"
                onMouseEnter={() => setHoveredCard(option.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="text-2xl p-2">{option.icon}</div>
                  <h3 className="font-medium text-gray-900 text-sm">
                    {option.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Appointment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {appointmentStats.map((stat) => (
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
                <div className="text-3xl opacity-80">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Appointments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="mr-2">📊</span>
                Appointment Analytics
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveChart("pie")}
                  className={`px-3 py-1 rounded text-sm transition-colors duration-200 ${
                    activeChart === "pie"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setActiveChart("bar")}
                  className={`px-3 py-1 rounded text-sm transition-colors duration-200 ${
                    activeChart === "bar"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  This Week
                </button>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              {activeChart === "pie" ? (
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              ) : (
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#66B406" name="Completed" />
                  <Bar dataKey="cancelled" fill="#262626" name="Cancelled" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Recent Appointments */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🕒</span>
              Recent Appointments
            </h3>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {recentAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-medium text-sm">
                      {appointment.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {appointment.patientName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {appointment.time} - {appointment.type}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(appointment.status)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All Appointments */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">📋</span>
            All Appointments
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Patient
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Date & Time
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Duration
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {allAppointments.map((appointment) => (
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
                      <div className="text-gray-900">{appointment.date}</div>
                      <div className="text-sm text-gray-600">
                        {appointment.time}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-900">
                      {appointment.type}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {appointment.duration}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(appointment.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
