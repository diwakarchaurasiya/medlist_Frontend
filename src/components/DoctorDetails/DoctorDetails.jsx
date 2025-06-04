import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets } from "./../../assets/assets_frontend/assets";
import Appointment from "../Appointment/Appointment";
import DocsCard from "../docsCard/DocsCard";
import Recommendation from "./Recommendation";
import RecommendationLoading from "../LoadingSkeleton/RecommendationLoading";
import { FaCalendarPlus, FaRupeeSign, FaUserClock } from "react-icons/fa";

const DoctorDetails = () => {
  const { docName } = useParams();
  const [docInfo, setDocInfo] = useState(null); // Default to null
  const [isLoading, setIsLoading] = useState(true);
  const [showAppointment, setShowAppointment] = useState(false);

  const fetchDoc = async () => {
    try {
      const response = await fetch(
        `https://medlist-backend.onrender.com/api/doctor/${docName}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const apiResponse = await response.json();
      setDocInfo(apiResponse.data);
    } catch (error) {
      console.error("Error fetching doctor info:", error);
      setDocInfo(null);
    } finally {
      setIsLoading(false); // Stop loading regardless of success or failure
    }
  };

  useEffect(() => {
    fetchDoc();
  }, [docName]);

  return (
    <div className="mx-auto p-6 w-full">
      {/* Doctor Profile Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start">
        {/* Profile Picture */}
        <div className="md:w-1/3 flex justify-center">
          {isLoading ? (
            <div className="w-48 h-48 md:w-60 md:h-80 bg-gray-300 animate-pulse rounded-lg"></div>
          ) : (
            <img
              className="rounded-lg w-48 h-48 md:w-60 md:h-80 object-cover bg-primary"
              src={docInfo?.profileImage}
              alt={docInfo?.name}
            />
          )}
        </div>

        {/* Doctor Information */}
        <div className="md:w-2/3 md:ml-8 text-center md:text-left mt-4 md:mt-0">
          {isLoading ? (
            <>
              <div className="w-64 h-8 bg-gray-300 animate-pulse rounded-md mx-auto md:mx-0"></div>
              <div className="w-32 h-4 bg-gray-200 animate-pulse rounded-md mt-2 mx-auto md:mx-0"></div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold flex items-center justify-center md:justify-start capitalize">
                {docInfo?.name}
                <img src={assets.verified_icon} className="px-2 w-8" />
              </h1>
              <h2 className="text-lg text-blue-600 mt-2">
                {docInfo?.specialization} - {docInfo?.qualification}
              </h2>
            </>
          )}

          {showAppointment ? (
            <Appointment
              doctorId={docInfo?._id}
              setShowAppointment={setShowAppointment}
              workingHours={docInfo?.workingHours}
            />
          ) : (
            <div className="right">
              <p className="mt-4 ">
                Working Hours:{" "}
                {isLoading ? (
                  <span className="w-20 h-4 bg-gray-200 animate-pulse inline-block"></span>
                ) : (
                  <span className="font-semibold text-[gray]">
                    {docInfo?.workingHours?.start}-{docInfo?.workingHours?.end}
                  </span>
                )}
              </p>

              <p className="mt-4 ">
                License Number:{" "}
                {isLoading ? (
                  <span className="w-24 h-4 bg-gray-200 animate-pulse inline-block"></span>
                ) : (
                  <span className="font-bold text-[gray]">
                    {docInfo?.licenseNumber}
                  </span>
                )}
              </p>

              {/* Contact Information */}
              <div className="flex flex-col md:flex-row mt-4 text-sm">
                <div className="flex items-center">
                  📞{" "}
                  {isLoading ? (
                    <span className="w-24 h-4 bg-gray-200 animate-pulse inline-block"></span>
                  ) : (
                    <a href={"tel:" + docInfo?.contactNumber}>
                      {docInfo?.contactNumber}
                    </a>
                  )}
                </div>
                <div className="flex items-center mt-2 md:mt-0 md:ml-8">
                  ✉️{" "}
                  {isLoading ? (
                    <span className="w-24 h-4 bg-gray-200 animate-pulse inline-block"></span>
                  ) : (
                    <a href={"mailto:" + docInfo?.email}>{docInfo?.email}</a>
                  )}
                </div>
              </div>

              {/* Book an appointment */}
              <div className="flex mt-4 space-x-4 justify-center md:justify-start">
                <button
                  type="button"
                  className="outline-0 bg-primary focus:ring-4 focus:ring-green-300 font-medium rounded-md px-5 py-2.5 text-white"
                  onClick={() => setShowAppointment(!showAppointment)}
                  disabled={isLoading}
                >
                  Book an appointment
                  <FaCalendarPlus className="ml-2 inline-block" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold">My Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {["Experience", "Qualification", "Appointment Fees"].map(
            (field, index) => (
              <div
                key={index}
                className="p-6 border rounded-lg shadow-lg text-center"
              >
                {isLoading ? (
                  <div className="w-24 h-6 bg-gray-200 animate-pulse mx-auto rounded-md"></div>
                ) : (
                  <h4 className="text-xl font-semibold">
                    {field === "Experience"
                      ? `${docInfo?.experience} years`
                      : field === "Qualification"
                      ? docInfo?.qualification
                      : `₹${docInfo?.appointmentFees}`}
                  </h4>
                )}
                <p className="mt-2">{field}</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Recommended Doctors */}
      <div className="recommendedDoctors w-full flex flex-wrap gap-8 items-center px-3 sm:px-0 my-10 text-center">
        {isLoading ? (
          <RecommendationLoading />
        ) : (
          <Recommendation speciality={docInfo?.specialization} />
        )}
      </div>
    </div>
  );
};

export default DoctorDetails;
