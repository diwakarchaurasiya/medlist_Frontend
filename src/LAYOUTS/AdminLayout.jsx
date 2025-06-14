import React from "react";
import Sidebar from "../components/Sidebar";
import AdminNavbar from "../admin/AdminNavbar";
import { Outlet } from "react-router-dom";

const AdminLayout = ({ isExpanded, toggleSidebar }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full z-20">
        <Sidebar
          role="admin"
          isExpanded={isExpanded}
          toggleSidebar={toggleSidebar}
        />
      </div>

      {/* Main Content */}
      <div
        className={`flex flex-col w-full transition-all duration-300 ${
          isExpanded ? "ml-64" : "ml-20"
        }`}
      >
        {/* Top Navbar */}
        <div className="fixed top-0 right-0 left-0 z-10">
          <AdminNavbar toggleSidebar={toggleSidebar} />
        </div>

        {/* Page content area below the navbar */}
        <main className="mt-16 p-4 overflow-auto h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
