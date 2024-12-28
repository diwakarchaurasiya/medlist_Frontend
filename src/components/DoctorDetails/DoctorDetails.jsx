import React, { useEffect, useState } from 'react';
import { useParams,Link } from 'react-router-dom';
import { assets } from './../../assets/assets_frontend/assets'
import Appointment from '../Appointment';
import DocsCard from '../docsCard/docsCard';
import Recommendation from './Recommendation';

const DoctorDetails = () => {
  const { docName } = useParams();
  const [docInfo, setDocInfo] = useState([]);
  let [showAppointment, setShowAppointment] = useState(false)
  const fetchDoc = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/doctor/${docName}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const apiResponse = await response.json();
      setDocInfo(apiResponse.data);
    } catch (error) {
      console.error("Error fetching doctor info:", error);
      setDocInfo(null);
    }
  }
  useEffect(() => {
    fetchDoc()
  }, [docName])
  return (
    <div className="mx-auto p-6">
      {/* Container for image and info */}
      <div className="flex flex-col md:flex-row items-center md:items-start">
        {/* Profile Picture */}
        <div className="md:w-1/3 flex justify-center">
          <img
            className="rounded-lg w-48 h-48 md:w-60 md:h-80 object-cover bg-primary"
            src={docInfo.profileImage}
            alt={docInfo.name}
          />
        </div>

        {/* Doctor Information */}
        <div className="md:w-2/3 md:ml-8 text-center md:text-left mt-4 md:mt-0">
            <h1 className="text-3xl font-bold flex items-center justify-center md:justify-start">{docInfo.name}<img src={assets.verified_icon} className="px-2 w-8"/></h1>
            <h2 className="text-lg text-blue-600 mt-2">{docInfo.specialization} - { docInfo.qualification}</h2>
          {showAppointment ? <Appointment setShowAppointment={setShowAppointment} /> : <div className="right">
            <p className="mt-4 ">Working Hours: <span className='font-semibold text-[gray]'>{docInfo.workingHours?.start}-{docInfo.workingHours?.end}</span>
              
          </p>
          <p className="mt-4 ">
          License Number: <span className='font-bold text-[gray]'>{docInfo.licenseNumber}</span>
          </p>
          {/* Contact Information */}
          <div className="flex flex-col md:flex-row mt-4 text-sm">
            <div className="flex items-center">
                <span role="img" aria-label="phone" className="mr-2">📞</span>
                <a href={"tel:"+docInfo.contactNumber}>{docInfo.contactNumber}</a>
            </div>
            <div className="flex items-center mt-2 md:mt-0 md:ml-8">
                <span role="img" aria-label="email" className="mr-2">✉️</span>
                <a href={"mailto:"+docInfo.email}>{docInfo.email}</a>
              {/* <p>{docInfo.email}</p> */}
            </div>
          </div>
          
          {/* Book an appointment*/}
          <div className="flex mt-4 space-x-4 justify-center md:justify-start">
            <button type="button" className="outline-0  bg-primary focus:ring-4 focus:ring-green-300 font-medium rounded-md  px-5 py-2.5 text-white" onClick={()=>setShowAppointment(!showAppointment)}>Book an appointment</button>
            </div>
            </div>
}
        </div>
      </div>

      {/* Specialties Section */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold">My Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {/* Specialties Cards */}
          <div className="p-6 border rounded-lg shadow-lg text-center">
            <h4 className="text-xl font-semibold">{docInfo.experience}</h4>
            <p className="mt-2">Experience</p>
          </div>
          <div className="p-6 border rounded-lg shadow-lg text-center">
            <h4 className="text-xl font-semibold">{docInfo.qualification}</h4>
              <p className="mt-2">In {docInfo.specialization}</p>
          </div>
          <div className="p-6 border rounded-lg shadow-lg text-center">
            <h4 className="text-xl font-semibold">₹{docInfo.appointmentFees}</h4>
            <p className="mt-2">Appointment Fees</p>
          </div>
        </div>
      </div>
      <div className="recommendedDoctors  w-full flex flex-wrap gap-8 items-center  px-3 sm:px-0 my-10 text-center">
        <Recommendation speciality = {docInfo.specialization}/>
      </div>
    </div>

  )
}

export default DoctorDetails
