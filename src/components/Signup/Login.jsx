import React, { useState } from "react";
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

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState("Patient");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const onSubmit = async (data) => {
    const userType = selectedUser.toLowerCase();
    setLoading(true);

    const apiEndpoints = {
      patient: "http://localhost:5000/api/patient/login",
      doctor: "http://localhost:5000/api/doctor/login",
      admin: "http://localhost:5000/api/admin/login",
    };

    try {
      const response = await fetch(apiEndpoints[userType], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const dataRecieved = await response.json();
      const result = dataRecieved?.data;
      console.log("Login response:", result); // Debugging line to check API response
      if (!response.ok) throw new Error(result.message || "Login failed");

      const token = result.token;
      const user = result.user;

      localStorage.setItem("user", JSON.stringify({ user, token, userType }));
      localStorage.setItem(`${userType}_token`, token);
      setUser({ user, token, userType });

      switch (userType) {
        case "patient":
          navigate("/my-profile", { replace: true });
          break;
        case "doctor":
          navigate("/doctor/dashboard", { replace: true });
          break;
        case "admin":
          navigate("/admin/dashboard", { replace: true });
          break;
        default:
          navigate("/", { replace: true });
      }
      toast.success("Login successful!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
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

        <div className="grid grid-cols-3 gap-4 mb-4">
          {["Patient", "Doctor", "Admin"].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedUser(role)}
              className={`flex flex-col items-center text-center rounded-md p-4 transition-all ${
                selectedUser === role
                  ? "bg-primary text-white"
                  : "bg-[#f0fff4] hover:bg-[#e6ffe1] hover:border-primary"
              }`}
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">
                  {role === "Patient" ? "🤒" : role === "Doctor" ? "👨‍⚕️" : "🛡️"}
                </span>
              </div>
              <p className="text-sm font-bold my-2">{role}</p>
              <p className="text-xs">
                {role === "Patient"
                  ? "Appointment & Pay"
                  : role === "Doctor"
                  ? "Schedules & Appointments"
                  : "Full system access"}
              </p>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <button
            type="submit"
            disabled={loading}
            className={`${buttonClass} ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {selectedUser === "Patient" ? (
          <p className="text-center text-sm mt-4">
            Don't Have Account?
            <Link
              to="/patient/register"
              className="text-primary hover:underline ml-1"
            >
              Register Here
            </Link>
          </p>
        ) : (
          <p className="text-center text-sm mt-4">
            {selectedUser} can only be added by admin.
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
