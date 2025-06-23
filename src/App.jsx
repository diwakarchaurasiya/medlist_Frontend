import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Common
import Login from "./components/Signup/Login"; // Ensure this path is correct
import Invalid from "./components/InvalidURL/Invalid";

// Patient
import Home from "./components/home/Home";
import About from "./components/AboutUs/About";
import Contact from "./components/Contact/Contact";
import DoctorsListing from "./components/DoctorsListing/DoctorsListing";
import DoctorDetails from "./components/DoctorDetails/DoctorDetails";
import MyProfile from "./components/MyProfile/MyProfile";
import MyAppointments from "./components/MyAppointments/Myappoitment";
import PatientForm from "./components/Patient/PatientForm";

// Doctor
import DoctorDashboard from "./Doctor/DoctorDashboard";
import DoctorForm from "./admin/doctorOnboardingForm/DoctorForm";
import DoctorAppointments from "./Doctor/DoctorAppointments";

// Admin
import AdminDashboard from "./admin/AdminDashboard";
import Doctors from "./Doctor/DoctorManagement";
import AppointmentBooking from "./admin/BookAppointmentAdmin";
import Patients from "./admin/PatientManagement";
import AppointmentManagementPage from "./admin/AppointmentManagement";
import AdminProfile from "./admin/AdminProfile";

// Layouts
import PatientLayout from "./LAYOUTS/PatientLayout";
import DoctorLayout from "./LAYOUTS/DoctorLayout";
import AdminLayout from "./LAYOUTS/AdminLayout";
import ProtectedRoute from "./utility/ProtectedRoute";
import PaymentManagementPage from "./admin/PaymentManagement";

function App() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : {});
  }, []);

  const [isExpanded, setIsExpanded] = useState(true);
  const toggleSidebar = () => setIsExpanded((prev) => !prev);
  console.log("User in App.jsx:", user); // Debugging line to check user state

  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          {/* Public Route - Login page receives setUser prop */}
          <Route path="/login" element={<Login setUser={setUser} />} />

          {/* ================= PATIENT ROUTES ================= */}
          <Route path="/" element={<PatientLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="doctors/:speciality" element={<DoctorsListing />} />
            <Route path="doc/:docName" element={<DoctorDetails />} />
            <Route path="patient/register" element={<PatientForm />} />{" "}
            {/* Public registration */}
            <Route
              path="my-profile"
              element={
                <ProtectedRoute userType="patient" user={user}>
                  <MyProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-appointments"
              element={
                <ProtectedRoute userType="patient" user={user}>
                  <MyAppointments />
                </ProtectedRoute>
              }
            />
            {/* Catch-all for patient layout if not found in specific routes */}
            <Route path="*" element={<Invalid />} />
          </Route>

          {/* ================= DOCTOR ROUTES ================= */}
          <Route
            path="/doctor/*"
            element={
              <ProtectedRoute userType="doctor" user={user}>
                <DoctorLayout
                  isExpanded={isExpanded}
                  toggleSidebar={toggleSidebar}
                />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="appointments/view" element={<DoctorAppointments />} />
            {/* Catch-all for doctor routes */}
            <Route path="*" element={<div>Doctor: Page Not Found</div>} />
          </Route>

          {/* ================= ADMIN ROUTES ================= */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute userType="admin" user={user}>
                <AdminLayout
                  isExpanded={isExpanded}
                  toggleSidebar={toggleSidebar}
                />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="doctors/add" element={<DoctorForm />} />
            <Route path="patients/add" element={<PatientForm />} />
            <Route path="doctors/manage" element={<Doctors />} />
            <Route path="patients/manage" element={<Patients />} />
            <Route path="fees" element={<PaymentManagementPage />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route
              path="appointments/manage"
              element={<AppointmentManagementPage />}
            />
            <Route path="appointments/book" element={<AppointmentBooking />} />
            {/* Catch-all for admin routes */}
            <Route path="*" element={<div>Admin: Page Not Found</div>} />
          </Route>

          {/* Unauthorized access route */}
          <Route
            path="/unauthorized"
            element={
              <div className="text-center text-red-600 font-bold text-xl mt-20">
                Unauthorized Access!
              </div>
            }
          />
          {/* Fallback for any unmatched routes */}
          <Route path="*" element={<Invalid />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
