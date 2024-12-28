import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const DoctorForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let navigate = useNavigate()

  async function registerDoctor(docsData) {
    const url = 'http://localhost:5000/api/doctor/register';
    const doctorData = docsData;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(doctorData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      else {
        const responseData = await response.json();
        console.log('Doctor registered successfully:', responseData)
        navigate("/doctors/all")
      }
    } catch (error) {
      console.error('Error registering doctor:', error);
    }
  }

  const onSubmit = (data) => {
    console.log(data);
    registerDoctor(data);

  };

  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const errorClass = "text-sm text-[red] mt-1";
  const groupClass = "mb-4";

  const qualificationArray = [
    "Bachelor of Ayurvedic Medicine and Surgery",
    "Dental degree",
    "Bachelor of Physiotherapy",
    "Bachelor of Science in Nursing",
    "Bachelor of Pharmacy or BPharm",
    "MBBS",
    "Master of Surgery",
    "MD",
    "Bachelor of Yoga and Naturopathy",
    "BAMS",
    "Others",
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">Doctor Registration</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div className={groupClass}>
          <label htmlFor="name" className={labelClass}>Name</label>
          <input
            placeholder="e.g., Robert Singh"
            id="name"
            type="text"
            className={inputClass}
            {...register("name", { required: "Doctor's name is required" })}
          />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>

        {/* Specialization */}
        <div className={groupClass}>
          <label htmlFor="specialization" className={labelClass}>Specialization</label>
          <select
            className={inputClass}
            {...register("specialization", { required: "Specialization is required" })}
          >
            <option value="" disabled>Select Specialization</option>
            <option value="Gynecologist">Gynecologist</option>
            <option value="Gastroenterologist">Gastroenterologist</option>
            <option value="General physician">General physician</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Pediatricians">Pediatricians</option>
            <option value="Neurologist">Neurologist</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Fees and Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={groupClass}>
            <label htmlFor="appointmentFees" className={labelClass}>Fees (Appointment)</label>
            <input
              placeholder="e.g., 500"
              id="appointmentFees"
              type="number"
              className={inputClass}
              {...register("appointmentFees", {
                required: "Appointment Fees is required",
                min: { value: 0, message: "Appointment Fees cannot be negative" },
              })}
            />
            {errors.appointmentFees && <p className={errorClass}>{errors.appointmentFees.message}</p>}
          </div>
          <div className={groupClass}>
            <label htmlFor="experience" className={labelClass}>Experience (Years)</label>
            <input
              placeholder="e.g., 5"
              id="experience"
              type="number"
              className={inputClass}
              {...register("experience", {
                required: "Experience is required",
                min: { value: 0, message: "Experience cannot be negative" },
              })}
            />
            {errors.experience && <p className={errorClass}>{errors.experience.message}</p>}
          </div>
        </div>

        {/* Contact Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={groupClass}>
            <label htmlFor="contactNumber" className={labelClass}>Contact Number</label>
            <input
              placeholder="e.g., 9876543210"
              id="contactNumber"
              type="text"
              className={inputClass}
              {...register("contactNumber", {
                required: "Contact number is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Contact number must be a 10-digit number",
                },
              })}
            />
            {errors.contactNumber && <p className={errorClass}>{errors.contactNumber.message}</p>}
          </div>

          <div className={groupClass}>
            <label htmlFor="email" className={labelClass}>Email</label>
            <input
              placeholder="e.g., doctor@example.com"
              id="email"
              type="email"
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
        </div>

        {/* Password */}
        <div className={groupClass}>
          <label htmlFor="password" className={labelClass}>Password</label>
          <input
            placeholder="Enter a secure password"
            id="password"
            type="password"
            className={inputClass}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Password must be at least 8 characters" },
            })}
          />
          {errors.password && <p className={errorClass}>{errors.password.message}</p>}
        </div>

        {/* Address */}
        <div className={groupClass}>
          <label className={`${labelClass} mb-2`}>Address</label>
          <div className="space-y-3 py-4 bg-gray-50 rounded-md">
            <div>
              <label htmlFor="line1" className={labelClass}>Line 1</label>
              <input
                placeholder="e.g., Street 123, Apartment 456"
                id="line1"
                type="text"
                className={inputClass}
                {...register("address.line1")}
              />
            </div>
            <div>
              <label htmlFor="line2" className={labelClass}>Line 2</label>
              <input
                placeholder="e.g., Landmark or additional details"
                id="line2"
                type="text"
                className={inputClass}
                {...register("address.line2")}
              />
            </div>
            <div>
              <label htmlFor="pincode" className={labelClass}>Pincode</label>
              <input
                placeholder="e.g., 123456"
                id="pincode"
                type="text"
                className={inputClass}
                {...register("address.pincode")}
              />
            </div>
          </div>
        </div>

        {/* License and Qualification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={groupClass}>
            <label htmlFor="licenseNumber" className={labelClass}>License Number</label>
            <input
              placeholder="e.g., LIC12345"
              id="licenseNumber"
              type="text"
              className={inputClass}
              {...register("licenseNumber", { required: "License number is required" })}
            />
            {errors.licenseNumber && <p className={errorClass}>{errors.licenseNumber.message}</p>}
          </div>

          <div className={groupClass}>
            <label htmlFor="qualification" className={labelClass}>Qualification</label>
            <select
              className={inputClass}
              {...register("qualification", { required: "Qualification is required" })}
            >
              <option value="" disabled>Select Qualification</option>
              {qualificationArray.map((qualification, index) => (
                <option key={index} value={qualification}>{qualification}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Working Hours */}
        <div className={groupClass}>
          <label className={`${labelClass} mb-2`}>Working Hours</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2 bg-gray-50 rounded-md">
            <div>
              <label htmlFor="workingHours.start" className={labelClass}>Start Time</label>
              <input
                placeholder="e.g., 09:00"
                id="workingHours.start"
                type="time"
                className={inputClass}
                {...register("workingHours.start", { required: "Start time is required" })}
              />
              {errors.workingHours?.start && <p className={errorClass}>{errors.workingHours.start.message}</p>}
            </div>
            <div>
              <label htmlFor="workingHours.end" className={labelClass}>End Time</label>
              <input
                placeholder="e.g., 18:00"
                id="workingHours.end"
                type="time"
                className={inputClass}
                {...register("workingHours.end", { required: "End time is required" })}
              />
              {errors.workingHours?.end && <p className={errorClass}>{errors.workingHours.end.message}</p>}
            </div>
          </div>
        </div>

        {/* Profile Image */}
        <div className={groupClass}>
          <label htmlFor="profileImage" className={labelClass}>Profile Image</label>
          <input
            placeholder="Upload your profile image"
            id="profileImage"
            type="file"
            accept="image/*"
            className="w-full px-3 py-2 border rounded-md focus:outline-primary"
            {...register("profileImage")}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-[green] focus:outline-primary transition-colors"
        >
          Register Doctor
        </button>
      </form>
    </div>
  );
};

export default DoctorForm;