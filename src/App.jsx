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

// Role-Based Protection
const ProtectedRoute = ({ isLogin, role, allowedRoles, children }) => {
  if (!isLogin) return <Navigate to="/login" />;
  if (!allowedRoles.includes(role)) return <Navigate to="/unauthorized" />;
  return children;
};

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("admin"); // or doctor/patient
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleSidebar = () => setIsExpanded((prev) => !prev);

  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          {/* Login */}
          <Route
            path="/login"
            element={<Login isLogin={isLogin} setIsLogin={setIsLogin} />}
          />

          {/* ================= PATIENT ROUTES ================= */}
          <Route
            path="/"
            element={
              <PatientLayout isLogin={isLogin} setIsLogin={setIsLogin} />
            }
          >
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="doctors/:speciality" element={<DoctorsListing />} />
            <Route path="doctor/:docName" element={<DoctorDetails />} />
            <Route path="patient/register" element={<PatientForm />} />
            <Route
              path="my-profile"
              element={
                <ProtectedRoute
                  isLogin={isLogin}
                  role={role}
                  allowedRoles={["patient"]}
                >
                  <MyProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-appointments"
              element={
                <ProtectedRoute
                  isLogin={isLogin}
                  role={role}
                  allowedRoles={["patient"]}
                >
                  <MyAppointments />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Invalid />} />
          </Route>

          {/* ================= DOCTOR ROUTES ================= */}
          <Route
            path="/doctor"
            element={
              <ProtectedRoute
                isLogin={isLogin}
                role={role}
                allowedRoles={["doctor"]}
              >
                <DoctorLayout
                  isExpanded={isExpanded}
                  toggleSidebar={toggleSidebar}
                />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="register" element={<DoctorForm />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="*" element={<div>Doctor: Page Not Found</div>} />
          </Route>

          {/* ================= ADMIN ROUTES ================= */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                isLogin={isLogin}
                role={role}
                allowedRoles={["admin"]}
              >
                <AdminLayout
                  isExpanded={isExpanded}
                  toggleSidebar={toggleSidebar}
                />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<div>Admin: Page Not Found</div>} />
          </Route>

          {/* Unauthorized */}
          <Route
            path="/unauthorized"
            element={<div>Unauthorized Access</div>}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
