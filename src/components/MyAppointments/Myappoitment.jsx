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
      {appointments.map((appointment, index) => {
        return (
          <div
            className=" p-6 rounded-md flex flex-col md:flex-row items-start md:items-center justify-between mb-4"
            key={index}
          >
            <div className="flex items-center mb-4 md:mb-0">
              <img
                src={appointment.doctorId.profileImage}
                alt={appointment}
                className="w-1/4 h-1/4 rounded-md bg-primary mr-6"
              />
              <div>
                <h2 className="text-lg font-bold">
                  {appointment.doctorId.name}
                </h2>
                <p className="text-sm text-[gray]">
                  {appointment.doctorId.specialization}
                </p>
                <p className="text-sm text-[gray]">
                  {appointment.doctorId.licenseNumber}
                </p>
                <p className="text-sm text-gray-500">
                  Fees: ${appointment.doctorId.appointmentFees}
                </p>
                <p className="text-sm text-[gray] font-semibold">
                  Date & Time:
                  <span className="font-light flex gap-x-4">
                    <span>{appointment.appointmentDate.slice(0, 10)}</span>
                    <span>{appointment.appointmentDay}</span>
                    <span>{appointment.appointmentTime}</span>
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-4">
              <button
                className="bg-primary text-white py-2 px-4 rounded-md "
                onClick={notify}
              >
                Pay Online
              </button>
              <button
                className="bg-[red] text-white py-2 px-4 rounded-md"
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
