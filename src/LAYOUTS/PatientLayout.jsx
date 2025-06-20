import React from "react";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { Outlet } from "react-router-dom";

const PatientLayout = () => {
  return (
    <>
      <div
        style={{ minHeight: "100vh", width: "90%", margin: "0 auto" }}
        className="flex flex-col"
      >
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </>
  );
};

export default PatientLayout;
