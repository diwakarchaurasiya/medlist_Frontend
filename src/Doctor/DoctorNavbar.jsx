import React from "react";
import { Link, useNavigate } from "react-router-dom";

const DoctorNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center border-b">
      <h1 className="text-xl font-bold text-green-700">👨‍⚕️ Doctor Panel</h1>
      <div className="space-x-4">
        <Link
          to="/doctor/dashboard"
          className="text-gray-700 hover:text-green-600"
        >
          Dashboard
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default DoctorNavbar;
