import React, { useEffect, useState } from "react";
import { assets } from "./../../assets/assets_frontend/assets";
import { Link } from "react-router-dom";
import { FaBuffer, FaSignOutAlt, FaUser, FaUserLock } from "react-icons/fa";
import { LuImagePlus } from "react-icons/lu";

import "./navbar.css";
const Navbar = ({ isLogin, setIsLogin }) => {
  // const [isLogin, setIsLogin] = useState(false);
  const [showMenu, setshowMenu] = useState(false);
  const [showDropdown, setshowDropdown] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setIsLogin(true);
    }
  }, [isLogin]);
  return (
    <div id="navbar">
      <div className="flex direction-column  items-center justify-between text-sm  border-b border-primary">
        <div className="logo">
          <Link
            to="/"
            onClick={() => scrollTo(0, 0)}
            className="  flex items-center"
          >
            <img src={assets.logo} alt="logo" className="w-16 py-2" />
            <span className="text-3xl font-bold text-primary">MedList</span>
          </Link>
        </div>
        <div className="links">
          <ul className="list-none hidden md:flex items-start gap-5 font-medium">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/doctors/all">All Doctors</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">contact</Link>
            </li>
          </ul>
        </div>
        <div className="user">
          {isLogin ? (
            <div className="group">
              <div
                className="profile_pic flex center gap-2"
                onClick={() => setshowDropdown(!showDropdown)}
              >
                <img
                  src={assets.profile_pic}
                  className={`w-14 rounded-md cursor-pointer duration-200  md:block ${
                    showDropdown ? "ring-4 ring-primary" : ""
                  }`}
                />
                <img src={assets.dropdown_icon} alt="" />
              </div>
              {showDropdown ? (
                <div className="float_card absolute top-0 my-24 pr-10 md:pr-12 right-10 text-base  text-[#666666] z-20 duration-200">
                  <div className="min-w-48 bg-[#eeefef] rounded-md border border-primary flex flex-col gap-4 p-4 text-[gray]">
                    <ul>
                      <li>
                        <Link
                          to="/my-profile"
                          className="hover:text-primary duration-100"
                        >
                          <FaUser className="inline-block mr-2" />
                          My profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/my-appointments"
                          className="hover:text-primary duration-100"
                        >
                          <FaBuffer className="inline-block mr-2" />
                          My Appointments
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/doctor/upload"
                          className="hover:text-primary duration-100"
                        >
                          <LuImagePlus className="inline-block mr-2" />
                          Upload Image
                        </Link>
                      </li>
                      <li>
                        <button
                          className="w-full bg-primary text-white my-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                          onClick={() => {
                            localStorage.removeItem("user");
                            setIsLogin(false);
                          }}
                        >
                          <FaSignOutAlt className="inline-block mr-2" /> Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            <Link to="/login">
              <button
                type="button"
                className="outline-0  bg-primary text-white font-lg  focus:ring-4 focus:ring-green-300 rounded-md  px-5 py-2.5 "
              >
                <FaUserLock className="inline-block mr-2" />
                Login
              </button>{" "}
            </Link>
          )}
        </div>
        <div onClick={() => setshowMenu(!showMenu)} className="w-6 md:hidden">
          {
            showMenu ? (
              <img src={assets.cross_icon} alt="" />
            ) : (
              <img src={assets.menu_icon} alt="" />
            )
            //mobile navbar
          }
        </div>
      </div>
      {showMenu ? (
        <div className="mobileNav">
          <ul
            className={`list-none  gap-5 font-medium flex flex-col justify-center items-center p-20`}
          >
            <li>
              <Link to="/" onClick={() => setshowMenu(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/doctors/all" onClick={() => setshowMenu(false)}>
                All Doctors
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setshowMenu(false)}>
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setshowMenu(false)}>
                contact
              </Link>
            </li>
          </ul>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Navbar;
