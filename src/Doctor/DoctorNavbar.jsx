import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Expand } from "lucide-react";

const DoctorNavbar = ({ doctorName = "Doctor", toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleFullScreen = () => {
    const el = document.documentElement;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch((err) =>
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`
        )
      );
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <nav className="sticky top-0 z-10 bg-black shadow-md px-6 py-4 flex pl-72 justify-between items-center">
      {/* Left - Doctor Name or Logo */}
      <div className="flex items-center space-x-4">
        <img
          src="https://cdn-icons-png.flaticon.com/512/387/387561.png"
          alt="Doctor Avatar"
          className="h-10 w-10 object-contain bg-white rounded-full mr-2"
          style={{ maxWidth: 40, maxHeight: 40 }}
        />
        <h1 className="text-white">Welcome Dr. {doctorName}</h1>
      </div>

      {/* Right - Icons & Actions */}
      <div className="flex items-center space-x-6">
        <Expand
          onClick={toggleFullScreen}
          className="text-white w-6 h-6 cursor-pointer rounded"
        />
        <Link to="/doctor/notifications">
          <div className="relative">
            <Bell className="text-white w-6 h-6 cursor-pointer" />
            <span className="absolute -top-1 -right-2 bg-white text-primary text-xs rounded-full px-1">
              5
            </span>
          </div>
        </Link>
        <Link to="/doctor/profile">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Doctor Profile"
            className="h-8"
          />
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default DoctorNavbar;
