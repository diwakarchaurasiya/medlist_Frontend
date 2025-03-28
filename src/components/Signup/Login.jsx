import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const inputClass =
  "w-full pl-10 py-3 border rounded-lg focus:outline-none focus:border-primary";
const labelClass = "sr-only";
const errorClass = "text-sm text-red-500 mt-1";
const buttonClass =
  "w-full bg-primary text-white py-3 rounded-lg hover:bg-opacity-90 focus:outline-none text-lg transition-all";
const iconClass =
  "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500";

const Login = ({ isLogin, setIsLogin }) => {
  useEffect(() => {
    const checkLogin = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        navigate("/doctors/all");
      }
    };

    checkLogin();
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState("Patient");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const url = selectedUser === "Patient" ? urlPatient : urlDoctor;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });
      const responseData = await response.json();
      console.log(responseData);
      if (!response.ok) {
        throw new Error(responseData.message || "Something went wrong");
      }

      if (responseData.success) {
        toast.success("Sucessfully logged in");
        localStorage.setItem("user", JSON.stringify(responseData.data));
        setIsLogin(true);
        navigate("/doctors/all");
      }
    } catch (error) {
      toast.error(`Login failed:${error.message}`);
    }
  };

  const urlPatient = "http://localhost:5000/api/patient/login";
  const urlDoctor = "http://localhost:5000/api/doctor/login";

  return (
    <div className="flex justify-center items-center my-10">
      <div className="bg-white rounded-md shadow-md  w-full max-w-lg p-6">
        <h1 className="text-center text-3xl font-bold text-primary mb-2">
          Login {selectedUser}
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
            <p className="text-xs ">Appointment & Pay</p>
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
            <p className="text-xs">Schedules & Appointments</p>
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
            <p className="text-xs ">Full system access</p>
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <div className="relative">
              <span className={iconClass}>👤</span>
              <input
                type="email"
                id="email"
                className={inputClass}
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email format",
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className={errorClass}>{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <div className="relative">
              <span className={iconClass}>🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={inputClass}
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                })}
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
            {errors.password && (
              <p className={errorClass}>{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className={`${buttonClass} bg-primary`}>
            Login
          </button>
        </form>
        {selectedUser === "Admin" ? (
          ""
        ) : (
          <p className="text-center text-sm mt-4">
            Don't Have Account?
            <Link
              to={`/${selectedUser}/register`}
              className="text-primary hover:underline"
            >
              Register Here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
