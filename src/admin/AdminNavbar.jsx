import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Bell, Expand } from "lucide-react";

const AdminNavbar = ({
  hospitalName = "to HealthManage",
  hospitalLogo,
  toggleSidebar,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
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
      {/* Left Side - Logo & Hospital Name */}
      <div className="flex items-center space-x-4">
        {hospitalLogo && (
          <img
            src={hospitalLogo}
            alt="Hospital Logo"
            className="h-10 w-10 object-contain bg-white rounded mr-2"
            style={{ maxWidth: 40, maxHeight: 40 }}
          />
        )}
        <h1 className="text-white">Welcome {hospitalName}</h1>
      </div>

      {/* Right Side - Icons */}
      <div className="flex items-center space-x-6 ">
        <Expand
          onClick={toggleFullScreen}
          className="text-white w-6 h-6 cursor-pointer rounded"
        />
        <Link to="/admin/notifications">
          <div className="relative">
            <Bell className="text-white w-6 h-6 cursor-pointer" />
            <span className="absolute -top-1 -right-2 bg-white text-primary text-xs rounded-full px-1">
              99+
            </span>
          </div>
        </Link>
        <Link to="/admin/profile">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Admin Profile"
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

export default AdminNavbar;
