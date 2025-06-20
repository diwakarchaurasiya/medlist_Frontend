import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./utility/AuthContext"; // Import AuthProvider and useAuth

// Common
import Login from "./components/Signup/Login";
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

// Layouts
import PatientLayout from "./LAYOUTS/PatientLayout";
import DoctorLayout from "./LAYOUTS/DoctorLayout";
import AdminLayout from "./LAYOUTS/AdminLayout";
import Doctors from "./Doctor/DoctorManagement";
import AppointmentBooking from "./admin/BookAppointmentAdmin";
import Patients from "./admin/PatientManagement";
import AppointmentManagementPage from "./admin/AppointmentManagement";
import AdminProfile from "./admin/AdminProfile";

// Role-Based Protection - now uses useAuth hook internally
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isLogin, role } = useAuth(); // Get auth state from context

  if (!isLogin) {
    // Optionally save the attempted path to redirect after login
    // sessionStorage.setItem('redirectPath', window.location.pathname);
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

function App() {
  const [isExpanded, setIsExpanded] = useState(true);
  const toggleSidebar = () => setIsExpanded((prev) => !prev);

  return (
    <>
      <ToastContainer />
      <Router>
        <AuthProvider>
          {" "}
          {/* Wrap the entire application with AuthProvider */}
          <Routes>
            {/* Login */}
            <Route path="/login" element={<Login />} />{" "}
            {/* No need to pass props */}
            {/* ================= PATIENT ROUTES ================= */}
            {/* Patient routes that don't require login */}
            <Route path="/" element={<PatientLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="doctors/:speciality" element={<DoctorsListing />} />
              <Route path="doc/:docName" element={<DoctorDetails />} />
              <Route path="patient/register" element={<PatientForm />} />
              <Route
                path="my-profile"
                element={
                  <ProtectedRoute allowedRoles={["patient"]}>
                    <MyProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="my-appointments"
                element={
                  <ProtectedRoute allowedRoles={["patient"]}>
                    <MyAppointments />
                  </ProtectedRoute>
                }
              />
              {/* Catch-all for patient layout if not found in specific routes */}
              <Route path="*" element={<Invalid />} />
            </Route>
            {/* ================= DOCTOR ROUTES ================= */}
            <Route
              path="/doctor"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <DoctorLayout
                    isExpanded={isExpanded}
                    toggleSidebar={toggleSidebar}
                  />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route path="register" element={<DoctorForm />} />{" "}
              {/* Should this be protected for doctor only? or admin only? */}
              <Route path="appointments" element={<DoctorAppointments />} />
              <Route path="*" element={<div>Doctor: Page Not Found</div>} />
            </Route>
            {/* ================= ADMIN ROUTES ================= */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
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
              <Route path="profile" element={<AdminProfile />} />
              <Route
                path="appointments/manage"
                element={<AppointmentManagementPage />}
              />
              <Route
                path="appointments/book"
                element={<AppointmentBooking />}
              />
              <Route path="*" element={<div>Admin: Page Not Found</div>} />
            </Route>
            {/* Unauthorized */}
            <Route
              path="/unauthorized"
              element={<div>Unauthorized Access</div>}
            />
            {/* Fallback for any unmatched routes outside of PatientLayout's scope */}
            <Route path="*" element={<Invalid />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
