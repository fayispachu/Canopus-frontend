import React, { useState, useContext } from "react";
import { FaBars } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";
import UserContext from "../context/UserContext";

// Import sections
import Attendance from "../components/AttendanceSection";
import StaffSection from "../components/StaffSection";
import UserManagement from "../components/UserManagement";
import WorkManagement from "../components/WorkManagement";
import LatestBookings from "../components/LatestBookings";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [active, setActive] = useState("Dashboard");

  const { user } = useContext(UserContext); // 👈 get real user data

  const renderContent = () => {
    switch (active) {
      case "Attendance":
        return <Attendance />;
      case "Dashboard":
      default:
        return <StaffSection />;
      case "User Management":
        return <UserManagement />;
      case "Works":
        return <WorkManagement />;
      case "Latest Bookings":
        return <LatestBookings />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <AdminSidebar
        active={active}
        setActive={setActive}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-white shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-2xl text-red-600"
          >
            <FaBars />
          </button>

          <h1 className="text-xl font-semibold text-gray-800">{active}</h1>

          <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
            <img
              src={
                user?.profilePic ||
                "https://randomuser.me/api/portraits/men/12.jpg"
              }
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-red-600"
            />
            <span className="font-semibold">{user?.name || "Manager"}</span>
          </div>
        </header>

        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  );
}

export default Dashboard;
