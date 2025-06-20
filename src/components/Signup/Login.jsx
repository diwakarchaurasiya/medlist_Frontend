import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAuth } from "../../utility/AuthContext"; // Import useAuth

const inputClass =
  "w-full pl-10 py-3 border rounded-lg focus:outline-none focus:border-primary";
const labelClass = "sr-only";
const errorClass = "text-sm text-red-500 mt-1";
const buttonClass =
  "w-full bg-primary text-white py-3 rounded-lg hover:bg-opacity-90 focus:outline-none text-lg transition-all";
const iconClass =
  "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500";

const Login = () => {
  const navigate = useNavigate();
  const { login, isLogin, role } = useAuth(); // Use the useAuth hook
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState("Patient");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Redirect if already logged in based on context state
  useEffect(() => {
    if (isLogin && role) {
      if (role === "doctor") {
        navigate("/doctor/dashboard", { replace: true });
      } else if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "patient") {
        navigate("/", { replace: true });
      }
    }
  }, [isLogin, role, navigate]); // Depend on isLogin and role from context

  // URLs
  const urlPatient = "http://localhost:5000/api/patient/login";
  const urlDoctor = "http://localhost:5000/api/doctor/login";
  const urlAdmin = "http://localhost:5000/api/admin/login";

  const onSubmit = async (data) => {
    try {
      let url = "";
      let redirectPath = "";

      // Ensure selectedUser matches backend's expected role casing for storage
      const roleToStore = selectedUser.toLowerCase();

      if (selectedUser === "Patient") {
        url = urlPatient;
        redirectPath = "/";
      } else if (selectedUser === "Doctor") {
        url = urlDoctor;
        redirectPath = "/doctor/dashboard";
      } else if (selectedUser === "Admin") {
        url = urlAdmin;
        redirectPath = "/admin/dashboard";
      }

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
      console.log("Login Response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Login failed");
      }

      if (responseData.success) {
        // Use the login function from AuthContext
        // Assuming responseData.data contains user info and responseData.token contains the token
        login(responseData.data?.token, responseData.data?.user, roleToStore); // Pass token, user data, and role
        navigate(redirectPath, { replace: true }); // Use replace to prevent back button to login
      }
    } catch (error) {
      toast.error(`Login failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-white rounded-md shadow-md w-full max-w-lg p-6">
        <h1 className="text-center text-3xl font-bold text-primary mb-2">
          Login {selectedUser}
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Select your role and enter credentials
        </p>

        {/* Role Buttons */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {["Patient", "Doctor", "Admin"].map((roleOption) => (
            <button
              key={roleOption}
              onClick={() => setSelectedUser(roleOption)}
              className={`flex flex-col items-center text-center rounded-md p-4 transition-all ${
                selectedUser === roleOption
                  ? "bg-primary text-white"
                  : "bg-[#f0fff4] hover:bg-[#e6ffe1] hover:border-primary"
              }`}
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">
                  {roleOption === "Patient"
                    ? "🤒"
                    : roleOption === "Doctor"
                    ? "👨‍⚕️"
                    : "🛡️"}
                </span>
              </div>
              <p className="text-sm font-bold my-2">{roleOption}</p>
              <p className="text-xs">
                {roleOption === "Patient"
                  ? "Appointment & Pay"
                  : roleOption === "Doctor"
                  ? "Schedules & Appointments"
                  : "Full system access"}
              </p>
            </button>
          ))}
        </div>

        {/* Login Form */}
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

        {/* Register Link for Patients */}
        {selectedUser === "Patient" ? (
          <p className="text-center text-sm mt-4">
            Don't Have Account?
            <Link
              to="/Patient/register"
              className="text-primary hover:underline ml-1"
            >
              Register Here
            </Link>
          </p>
        ) : (
          <p className="text-center text-sm mt-4">
            {selectedUser} Can only added by admin.
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
