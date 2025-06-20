import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaUserLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// --- Cloudinary Configuration for Frontend ---
// Your Cloud Name from your Cloudinary dashboard
const CLOUDINARY_CLOUD_NAME = "dhq7wpnai"; // <--- Use your provided Cloud Name
// The name of the UNSIGNED upload preset you created in Cloudinary
const CLOUDINARY_UPLOAD_PRESET = "my_doctor_uploads"; // <--- REPLACE THIS with your preset name

const DoctorForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const navigate = useNavigate();

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [cloudinaryImageUrl, setCloudinaryImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadImageToCloudinary = async (file) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, // Backticks for template literal
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Cloudinary upload failed");
      }

      const data = await response.json();
      setCloudinaryImageUrl(data.secure_url);
      toast.success("Profile image uploaded to Cloudinary!");
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      toast.error(`Image upload failed: ${error.message}`); // Backticks for template literal
      setCloudinaryImageUrl(null);
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      uploadImageToCloudinary(file);
    } else {
      setProfileImageFile(null);
      setProfileImagePreview(null);
      setCloudinaryImageUrl(null);
    }
  };

  async function registerDoctor(docsData) {
    const url = "https://medlist-backend.onrender.com/api/doctor/register";

    const formData = new FormData();

    for (const key in docsData) {
      if (key === "address" || key === "workingHours") {
        formData.append(key, JSON.stringify(docsData[key]));
      } else {
        formData.append(key, docsData[key]);
      }
    }

    if (cloudinaryImageUrl) {
      formData.append("profileImage", cloudinaryImageUrl);
    } else if (profileImageFile && !isUploading) {
      toast.error(
        "Profile image upload failed. Please try re-selecting the image."
      );
      return;
    } else if (profileImageFile && isUploading) {
      toast.info("Please wait for the profile image to finish uploading.");
      return;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Doctor registration failed");
      } else {
        toast.success("Doctor registered successfully!");
        navigate("/login");
      }
    } catch (error) {
      toast.error(
        error.message || "An unexpected error occurred during registration"
      );
    }
  }

  const onSubmit = (data) => {
    if (isUploading) {
      toast.info(
        "Please wait, the profile image is still uploading to Cloudinary..."
      );
      return;
    }

    if (profileImageFile && !cloudinaryImageUrl) {
      toast.error(
        "Please upload a profile image or ensure the upload is complete."
      );
      return;
    }

    registerDoctor(data);
  };

  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary";
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
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">
        Doctor Registration
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div className={groupClass}>
          <label htmlFor="name" className={labelClass}>
            Name (with Dr)
          </label>
          <input
            placeholder="e.g: Dr Robert Singh"
            id="name"
            type="text"
            className={inputClass}
            {...register("name", { required: "Doctor's name is required" })}
          />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>

        {/* Specialization */}
        <div className={groupClass}>
          <label htmlFor="specialization" className={labelClass}>
            Specialization
          </label>
          <select
            className={`${inputClass} max-w-full`}
            {...register("specialization", {
              required: "Specialization is required",
            })}
          >
            <option value="" disabled>
              Select Specialization
            </option>
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
            <label htmlFor="appointmentFees" className={labelClass}>
              Fees (Appointment)
            </label>
            <input
              placeholder="e.g., 500"
              id="appointmentFees"
              type="number"
              className={inputClass}
              {...register("appointmentFees", {
                required: "Appointment Fees is required",
                min: {
                  value: 0,
                  message: "Appointment Fees cannot be negative",
                },
              })}
            />
            {errors.appointmentFees && (
              <p className={errorClass}>{errors.appointmentFees.message}</p>
            )}
          </div>
          <div className={groupClass}>
            <label htmlFor="experience" className={labelClass}>
              Experience (Years)
            </label>
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
            {errors.experience && (
              <p className={errorClass}>{errors.experience.message}</p>
            )}
          </div>
        </div>

        {/* Contact Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={groupClass}>
            <label htmlFor="contactNumber" className={labelClass}>
              Contact Number
            </label>
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
            {errors.contactNumber && (
              <p className={errorClass}>{errors.contactNumber.message}</p>
            )}
          </div>

          <div className={groupClass}>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
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
            {errors.email && (
              <p className={errorClass}>{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Password */}
        <div className={groupClass}>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <input
            placeholder="Enter a secure password"
            id="password"
            type="password"
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
          <label className={`${labelClass} mb-2`}>Address</label>
          <div className="space-y-3 py-4 bg-gray-50 rounded-md">
            <div>
              <label htmlFor="line1" className={labelClass}>
                Line 1
              </label>
              <input
                placeholder="e.g., Street 123, Apartment 456"
                id="line1"
                type="text"
                className={inputClass}
                {...register("address.line1")}
              />
            </div>
            <div>
              <label htmlFor="line2" className={labelClass}>
                Line 2
              </label>
              <input
                placeholder="e.g., Landmark or additional details"
                id="line2"
                type="text"
                className={inputClass}
                {...register("address.line2")}
              />
            </div>
            <div>
              <label htmlFor="pincode" className={labelClass}>
                Pincode
              </label>
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
            <label htmlFor="licenseNumber" className={labelClass}>
              License Number
            </label>
            <input
              placeholder="e.g., ABCD ID 12345"
              id="licenseNumber"
              type="text"
              className={inputClass}
              {...register("licenseNumber", {
                required: "License number is required",
              })}
            />
            {errors.licenseNumber && (
              <p className={errorClass}>{errors.licenseNumber.message}</p>
            )}
          </div>

          <div className={groupClass}>
            <label htmlFor="qualification" className={labelClass}>
              Qualification
            </label>
            <select
              className={inputClass}
              {...register("qualification", {
                required: "Qualification is required",
              })}
            >
              <option value="" disabled>
                Select Qualification
              </option>
              {qualificationArray.map((qualification, index) => (
                <option key={index} value={qualification}>
                  {qualification}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Working Hours */}
        <div className={groupClass}>
          <label className={`${labelClass} mb-2`}>Working Hours</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2 bg-gray-50 rounded-md">
            <div>
              <label htmlFor="workingHours.start" className={labelClass}>
                Start Time
              </label>
              <input
                id="workingHours.start"
                type="time"
                className={inputClass}
                defaultValue="09:00"
                {...register("workingHours.start", {
                  required: "Start time is required",
                })}
              />
              {errors.workingHours?.start && (
                <p className={errorClass}>
                  {errors.workingHours.start.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="workingHours.end" className={labelClass}>
                End Time
              </label>
              <input
                placeholder="e.g., 18:00"
                id="workingHours.end"
                type="time"
                className={inputClass}
                defaultValue="17:00"
                {...register("workingHours.end", {
                  required: "End time is required",
                })}
              />
              {errors.workingHours?.end && (
                <p className={errorClass}>{errors.workingHours.end.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Profile Image Upload and Preview */}
        <div className={groupClass}>
          <label htmlFor="profileImage" className={labelClass}>
            Profile Image
          </label>
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            className={inputClass}
            onChange={handleImageChange}
          />
          {isUploading && (
            <p className="text-blue-500 mt-2">
              Uploading image to Cloudinary...
            </p>
          )}
          {profileImagePreview && (
            <div className="mt-4">
              <p className="block text-sm font-medium text-gray-700 mb-2">
                Image Preview:
              </p>
              <img
                src={profileImagePreview}
                alt="Profile Preview"
                className="w-32 h-32 object-cover rounded-full border border-gray-300"
              />
            </div>
          )}
          {cloudinaryImageUrl && !isUploading && (
            <p className="text-green-600 text-sm mt-2">
              Image successfully uploaded to Cloudinary!{" "}
              <a
                href={cloudinaryImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                View Image
              </a>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-[green] focus:outline-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isUploading}
        >
          {isUploading ? "Uploading Image..." : "Register Doctor"}{" "}
          <FaUserLock className="inline-block ml-2" />
        </button>
      </form>
    </div>
  );
};

export default DoctorForm;
