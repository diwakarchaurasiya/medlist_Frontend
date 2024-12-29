import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUser,setSelectedUser] = useState("Patient")
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white rounded-md shadow-md  w-full max-w-lg p-4">
        <h1 className="text-center text-3xl font-bold text-primary mb-2">
          MedList Login {selectedUser}
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Select your role and enter credentials
        </p>
        <div className="grid grid-cols-3 gap-4 mb-4">

      {/* Patient Button (Default Selected) */}
      <button
        onClick={() => setSelectedUser("Patient")}
        className={`flex flex-col items-center text-center rounded-md p-4  transition-all 
          ${
            selectedUser === "Patient"
              ? "bg-primary text-white"
              : "bg-[#f0fff4] hover:bg-[#e6ffe1] hover:border-primary"
          }`}
      >
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-4xl">🤒</span>
        </div>
        <p className="text-sm font-bold my-2">Patient</p>
        <p className="text-xs text-gray-500">Appointment & Pay</p>
      </button>

      {/* Doctor Button */}
      <button
        onClick={() => setSelectedUser("Doctor")}
        className={`flex flex-col items-center text-center rounded-md p-4  transition-all 
          ${
            selectedUser === "Doctor"
              ? "bg-primary text-white"
              : "bg-[#f0fff4] hover:bg-[#e6ffe1] hover:border-primary"
          }`}
      >
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-4xl">👨‍⚕️</span>
        </div>
        <p className="text-sm font-bold my-2">Doctor</p>
        <p className="text-xs text-gray-500">Schedules & Appointments</p>
          </button>
            {/* Admin Button */}
      <button
        onClick={() => setSelectedUser("Admin")}
        className={`flex flex-col items-center text-center rounded-md p-4 transition-all 
          ${
            selectedUser === "Admin"
              ? "bg-primary text-white" 
              : "bg-[#f0fff4] hover:bg-[#e8ffe1] hover:border-primary"
          }`}
      >
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-4xl">🛡️</span>
        </div>
        <p className="text-sm font-bold my-2">Admin</p>
        <p className="text-xs text-gray-500">Full system access</p>
      </button>
    </div>
        <form className="space-y-4">
          <div>
            <label className="sr-only" htmlFor="username">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">👤</span>
              <input
                type="text"
                id="email"
                className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:border-primary"
                placeholder="email"
              />
            </div>
          </div>
          <div>
            <label className="sr-only" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:border-primary"
                placeholder="Password"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark focus:outline-none text-lg"
          > Login
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Don't Have Account?<Link to={`/${selectedUser}/register`}  className="text-primary hover:underline">
           Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
