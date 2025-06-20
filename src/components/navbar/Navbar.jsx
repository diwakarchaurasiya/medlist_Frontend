import React, { useEffect, useState } from "react";
import { assets } from "./../../assets/assets_frontend/assets";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import { FaBuffer, FaSignOutAlt, FaUser, FaUserLock } from "react-icons/fa";
import { LuImagePlus } from "react-icons/lu";

import "./navbar.css";
// import { Lock } from "lucide-react"; // Lock import seems unused, consider removing if not needed.
import { toast } from "react-toastify";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false); // Renamed for consistency
  const [showDropdown, setShowDropdown] = useState(false); // Renamed for consistency
  const location = useLocation(); // Initialize useLocation hook
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user"))); // Get user from localStorage
  const [isLogin, setIsLogin] = useState(true); // Check if user is logged in

  // Close mobile menu or dropdown when route changes
  useEffect(() => {
    setShowMenu(false);
    setShowDropdown(false);
  }, [location.pathname]);

  const getLinkClass = (path) => {
    return location.pathname === path
      ? "text-primary font-bold transition-all duration-300" // Active link style
      : "hover:text-primary transition-all duration-300"; // Default hover style
  };

  return (
    <div
      id="navbar"
      className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200"
    >
      {" "}
      {/* Added shadow for better separation */}
      <div className="flex items-center justify-between px-4 md:px-8">
        {" "}
        {/* Added padding and responsive padding */}
        <div className="logo">
          <Link
            to="/"
            onClick={() => {
              window.scrollTo(0, 0); // Use window.scrollTo instead of global scrollTo
              setShowMenu(false); // Close menu on logo click for mobile
            }}
            className="flex items-center"
          >
            <img src={assets.logo} alt="MedList logo" className="w-16 py-2" />
            <span className="text-3xl font-bold text-primary ml-2">
              MedList
            </span>{" "}
            {/* Added margin-left */}
          </Link>
        </div>
        <div className="links">
          <ul className="list-none text-md  hidden md:flex items-center gap-8 font-medium">
            {" "}
            {/* Increased gap for better spacing */}
            <li>
              <Link to="/" className={getLinkClass("/")}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/doctors/all" className={getLinkClass("/doctors/all")}>
                All Doctors
              </Link>
            </li>
            <li>
              <Link to="/about" className={getLinkClass("/about")}>
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className={getLinkClass("/contact")}>
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className="user flex items-center gap-4">
          {" "}
          {/* Added gap for alignment */}
          {isLogin ? (
            <div className="relative">
              {" "}
              {/* Use relative positioning for dropdown */}
              <div
                className="profile_pic flex items-center gap-2 cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <img
                  src={assets.profile_pic}
                  className={`w-12 h-12 rounded-lg object-cover duration-200 ${
                    // Made image round and added object-cover
                    showDropdown ? "ring-4 ring-primary" : ""
                  }`}
                  alt="Profile" // Added alt text for accessibility
                />
                <img
                  src={assets.dropdown_icon}
                  alt="Dropdown icon"
                  className="w-3 h-3"
                />{" "}
                {/* Added alt text and fixed size */}
              </div>
              {showDropdown && ( // Conditionally render dropdown
                <div className="absolute top-full right-0 mt-3 text-base text-[#666666] z-20 shadow-lg rounded-md bg-white border border-gray-200">
                  {" "}
                  {/* Adjusted positioning and added shadow */}
                  <div className="min-w-48 flex flex-col gap-2 p-4">
                    {" "}
                    {/* Adjusted gap and padding */}
                    <ul>
                      <li>
                        <Link
                          to="/my-profile"
                          className="flex items-center justify-center py-2 px-3 hover:bg-gray-100 hover:text-primary rounded-md duration-100 capitalize" // Added padding, gap, and background on hover
                          onClick={() => setShowDropdown(false)}
                        >
                          <FaUser className="inline-block mr-2" /> My profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/my-appointments"
                          className="flex items-center justify-center py-2 px-3 hover:bg-gray-100 hover:text-primary rounded-md duration-100 capitalize"
                          onClick={() => setShowDropdown(false)}
                        >
                          <FaBuffer className="inline-block mr-2" />
                          Appointments
                        </Link>
                      </li>
                      <li>
                        <button
                          className="w-full bg-primary text-white my-2 py-2 rounded-md hover:bg-green-600 transition duration-300 flex items-center justify-center gap-2 capitalize" // Improved button styling and centered content
                          onClick={() => {
                            localStorage.clear(); // Clear user from localStorage
                            setShowDropdown(false); // Close dropdown after logout
                            setIsLogin(false); // Update login state
                            toast.success("Logged out successfully!"); // Added toast notification
                          }}
                        >
                          <FaSignOutAlt className="inline-block" /> Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button
                type="button"
                className="outline-0 bg-primary text-white font-medium focus:ring-4 focus:ring-green-300 rounded-md px-5 py-2.5 transition duration-300 hover:bg-green-600" // Improved button hover effect
              >
                <FaUserLock className="inline-block mr-2" />
                Login
              </button>
            </Link>
          )}
        </div>
        <div
          onClick={() => setShowMenu(!showMenu)}
          className="w-8 h-8 md:hidden cursor-pointer flex items-center justify-center"
        >
          {" "}
          {/* Adjusted size and added flex for centering */}
          {showMenu ? (
            <img
              src={assets.cross_icon}
              alt="Close menu"
              className="w-full h-full"
            />
          ) : (
            <img
              src={assets.menu_icon}
              alt="Open menu"
              className="w-full h-full"
            />
          )}
        </div>
      </div>
      {showMenu && (
        <div className="mobileNav md:hidden bg-white py-4 shadow-md">
          {" "}
          {/* Added background and shadow for mobile nav */}
          <ul
            className={`list-none gap-4 font-medium flex flex-col justify-center items-center p-4`}
          >
            <li>
              <Link
                to="/"
                onClick={() => setShowMenu(false)}
                className={getLinkClass("/") + " block py-2"}
              >
                {" "}
                {/* Added block and padding */}
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/doctors/all"
                onClick={() => setShowMenu(false)}
                className={getLinkClass("/doctors/all") + " block py-2"}
              >
                All Doctors
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                onClick={() => setShowMenu(false)}
                className={getLinkClass("/about") + " block py-2"}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                onClick={() => setShowMenu(false)}
                className={getLinkClass("/contact") + " block py-2"}
              >
                Contact
              </Link>
            </li>
            {/* Conditional rendering for admin link in mobile nav if user is admin, etc. */}
            {/* Assuming a basic admin check, adapt as per your AuthContext */}
            {user &&
              user.role === "admin" && ( // Example: only show if user has an 'admin' role
                <li className="bg-secondary text-white px-4 py-2 rounded-md mt-4">
                  {" "}
                  {/* Increased top margin */}
                  <Link to="/admin" onClick={() => setShowMenu(false)}>
                    Admin
                  </Link>
                </li>
              )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
