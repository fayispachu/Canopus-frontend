import React, { useState, useContext } from "react";
import { FaBars, FaBell } from "react-icons/fa";
import AdminContext from "../context/AdminContext";
import AdminSidebar from "../components/AdminSidebar";

function AdminDashboard() {
  const { admin } = useContext(AdminContext);
  const [activeSidebar, setActiveSidebar] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!admin) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Please login to access the Admin Dashboard
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <AdminSidebar
        active={activeSidebar}
        setActive={setActiveSidebar}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-white shadow-md">
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-2xl text-red-600"
            >
              <FaBars />
            </button>
          </div>

          {/* Search placeholder */}
          <div className="flex-1 mx-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          {/* Profile and notifications */}
          <div className="flex items-center gap-4">
            <FaBell className="text-gray-600 text-xl hidden md:block" />
            <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
              <img
                src="https://randomuser.me/api/portraits/men/10.jpg"
                alt={admin.name}
                className="w-10 h-10 rounded-full border-2 border-red-600"
              />
              <span className="font-semibold">{admin.name}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6">{activeSidebar} Page</h1>
          <p>
            Welcome, {admin.name}! This is your basic dashboard content area.
          </p>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
