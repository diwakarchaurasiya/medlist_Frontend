import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./components/home/Home";
import About from "./components/AboutUs/About";
import Footer from "./components/Footer/Footer";
import DoctorDetails from "./components/DoctorDetails/DoctorDetails";
import DoctorsListing from "./components/DoctorsListing/DoctorsListing";
import Contact from "./components/Contact/Contact";
import Invalid from "./components/InvalidURL/Invalid";
import Login from "./components/Signup/Login";
import MyProfile from "./components/MyProfile/MyProfile";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Myappoitment from "./components/MyAppointments/Myappoitment";
import DoctorForm from "./components/doctorOnboardingForm/DoctorForm";
import PatientForm from "./components/Patient/PatientForm";
import { useState } from "react";
import ImageUpload from "./components/ImageUpload";
import AdminDashboard from "./components/admin/AdminDashboard";
import DoctorListingSkeleton from "./components/LoadingSkeleton/DoctorListingSkeleton";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <Navbar isLogin={isLogin} setIsLogin={setIsLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="doctor/:docName" element={<DoctorDetails />} />
          <Route path="contact" element={<Contact />} />
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="my-appointments" element={<Myappoitment />} />
          <Route path="doctors/:speciality" element={<DoctorsListing />} />
          <Route
            path="doctors/:speciality"
            element={<DoctorListingSkeleton />}
          />
          // creation of doctor and updation of doctor
          <Route path="doctor/register" element={<DoctorForm />} />
          <Route path="doctor/upload" element={<ImageUpload />} />
          // creation of patient and updation of patient
          <Route path="patient/register" element={<PatientForm />} />
          //admin routes for dashboard and patient listing
          <Route path="admin/*" element={<AdminDashboard />} />
          <Route
            path="login"
            element={<Login isLogin={isLogin} setIsLogin={setIsLogin} />}
          />
          <Route path="*" element={<Invalid />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
