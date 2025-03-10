import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { FaUserLock } from "react-icons/fa";
const PatientForm = () => {
  toast;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  // Function to handle patient registration
  async function registerPatient(patientData) {
    const url = "http://localhost:5000/api/patient/register";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Registration failed");
      } else {
        toast.success("Patient Registered successfully!");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred");
    }
  }

  const onSubmit = (data) => {
    registerPatient(data);
  };

  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const errorClass = "text-sm text-[red] mt-1";
  const groupClass = "mb-4";

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">
        Patient Registration
      </h2>
      <p className="my-4">
        Are You A Doctor ?
        <Link
          to="/doctor/register"
          className="mx-2  text-primary p-2  hover:text-[green] transition-colors"
        >
          Register As Doctor
        </Link>
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div className={groupClass}>
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            className={inputClass}
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>

        {/* Age */}
        <div className={groupClass}>
          <label htmlFor="age" className={labelClass}>
            Age
          </label>
          <input
            id="age"
            type="number"
            placeholder="30"
            className={inputClass}
            {...register("age", {
              required: "Age is required",
              min: { value: 0, message: "Age cannot be negative" },
            })}
          />
          {errors.age && <p className={errorClass}>{errors.age.message}</p>}
        </div>

        {/* Gender */}
        <div className={groupClass}>
          <label htmlFor="gender" className={labelClass}>
            Gender
          </label>
          <select
            id="gender"
            className={inputClass}
            {...register("gender", { required: "Gender is required" })}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <p className={errorClass}>{errors.gender.message}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div className={groupClass}>
          <label htmlFor="dateOfBirth" className={labelClass}>
            Date of Birth
          </label>
          <input
            id="dateOfBirth"
            type="date"
            className={inputClass}
            {...register("dateOfBirth", {
              required: "Date of Birth is required",
            })}
          />
          {errors.dateOfBirth && (
            <p className={errorClass}>{errors.dateOfBirth.message}</p>
          )}
        </div>

        {/* Contact Number */}
        <div className={groupClass}>
          <label htmlFor="contactNumber" className={labelClass}>
            Contact Number
          </label>
          <input
            id="contactNumber"
            type="text"
            placeholder="9876543210"
            className={inputClass}
            {...register("contactNumber", {
              required: "Contact number is required",
              pattern: {
                value: /^\d{10}$/,
                message: "Contact number must be a 10-digit number",
              },
            })}
          />
          {errors.contactNumber && (
            <p className={errorClass}>{errors.contactNumber.message}</p>
          )}
        </div>

        {/* Email */}
        <div className={groupClass}>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="john.doe@example.com"
            className={inputClass}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Invalid email format",
              },
            })}
          />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className={groupClass}>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="********"
            className={inputClass}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />
          {errors.password && (
            <p className={errorClass}>{errors.password.message}</p>
          )}
        </div>

        {/* Address */}
        <div className={groupClass}>
          <label htmlFor="address" className={labelClass}>
            Address
          </label>
          <input
            id="address"
            type="text"
            placeholder="123 Street, City"
            className={inputClass}
            {...register("address")}
          />
        </div>

        {/* Medical History */}
        <div className={groupClass}>
          <label htmlFor="medicalHistory" className={labelClass}>
            Medical History
          </label>
          <textarea
            id="medicalHistory"
            placeholder="e.g., Diabetes, Hypertension"
            className={inputClass}
            {...register("medicalHistory")}
          ></textarea>
        </div>

        {/* Emergency Contact */}
        <div className={groupClass}>
          <label htmlFor="emergencyContactNumber" className={labelClass}>
            Emergency Contact Number
          </label>
          <input
            id="emergencyContactNumber"
            type="text"
            placeholder="9876543210"
            className={inputClass}
            {...register("emergencyContact", {
              pattern: {
                value: /^\d{10}$/,
                message: "Emergency contact must be a 10-digit number",
              },
            })}
          />
          {errors.emergencyContact && (
            <p className={errorClass}>{errors.emergencyContact.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-[green] focus:outline-primary transition-colors"
        >
          Register Patient <FaUserLock className="inline-block ml-2" />
        </button>
      </form>
    </div>
  );
};

export default PatientForm;
