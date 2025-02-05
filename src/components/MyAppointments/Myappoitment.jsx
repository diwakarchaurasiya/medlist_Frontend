import React, { useEffect, useState } from "react";
import { doctors } from "../../assets/assets_frontend/assets";
import { toast } from "react-toastify";
import fetchFromApi from "../../utility/fetchFromApi";
toast;
const Myappoitment = () => {
  let notify = () => toast.info("Feature Not availble");
  const [appointments, setAppointments] = useState([]);
  // const getAppointments = async () => {
  //   // fetch appointments from database
  //   const response = await fetch("http://localhost:5000/api/appointment");
  //   const data = await response.json();
  //   setAppointments(data);
  // };
  useEffect(() => {
    fetchFromApi("http://localhost:5000/api/appointment", "get")
      .then((data) => {
        setAppointments(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
      });
  }, []);
  return (
    <div className="my-10">
      {appointments?.map((appointment, index) => {
        return (
          <div
            className=" p-6 rounded-md flex flex-col md:flex-row items-start md:items-center justify-between mb-4"
            key={index}
          >
            <div className="flex items-center mb-4 md:mb-0 flex-wrap justify-center">
              <img
                src={
                  appointment.doctorId?.profileImage ||
                  "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg"
                }
                alt={appointment.doctorId?._id}
                className="w-40  h-1/4  rounded-md bg-primary mr-6"
              />
              <div>
                <h2 className="text-lg font-bold">
                  {appointment.doctorId?.name || "Unknown"}
                </h2>
                <p className="text-sm text-[gray]">
                  {appointment.doctorId?.specialization || "Unknown"}
                </p>
                <p className="text-sm text-[gray]">
                  {appointment.doctorId?.licenseNumber || "Unknown"}
                </p>
                <p className="text-sm text-gray-500">
                  Fees: ${appointment.doctorId?.appointmentFees || 0}
                </p>
                <p className="text-sm text-[gray] font-semibold">
                  Date & Time:
                  <span className="font-light flex gap-x-4">
                    <span>{appointment.appointmentDate?.slice(0, 10)}</span>
                    <span>{appointment.appointmentDay}</span>
                    <span>{appointment.appointmentTime}</span>
                  </span>
                </p>
              </div>
            </div>
            <div className=" md:m-0 m-auto flex flex-col md:flex-row md:justify-end space-y-2 md:space-y-0  md:space-x-4 justify-center items-center ">
              <button
                className="bg-[#2579da]  text-white py-2 px-4 rounded-md "
                onClick={notify}
              >
                Pay Online
              </button>
              <button
                className="bg-[#a70b0b] hover:bg-[#720505] text-white py-2 px-4 rounded-md"
                onClick={notify}
              >
                cancel
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Myappoitment;
