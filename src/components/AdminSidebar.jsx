import React, { useContext } from "react";
import {
  FaTimes,
  FaUserTie,
  FaCalendarAlt,
  FaTasks,
  FaCog,
  FaSignOutAlt,
  FaUsers,
} from "react-icons/fa";
import UserContext from "../context/UserContext";

function AdminSidebar({ active, setActive, sidebarOpen, setSidebarOpen }) {
  const { user } = useContext(UserContext);
  // Base menu for all staff roles s
  let menuItems = [
    { label: "Dashboard", icon: <FaUserTie /> },
    { label: "Attendance", icon: <FaCalendarAlt /> },
    { label: "Works", icon: <FaTasks /> },
    { label: "Latest Bookings", icon: <FaCalendarAlt /> },
  ];

  // Add user management section only for admin or manager
  if (user?.role === "admin" || user?.role === "manager") {
    menuItems.push({ label: "User Management", icon: <FaUsers /> });
  }

  // Add settings and logout for all users
  menuItems.push(
    { label: "Settings", icon: <FaCog /> },
    { label: "Logout", icon: <FaSignOutAlt /> }
  );

  return (
    <aside
      className={`bg-gradient-to-b from-red-600 to-red-700 min-h-screen text-white p-6 flex flex-col gap-6
      md:w-64 fixed top-0 left-0 w-64 z-50 transform transition-transform duration-300
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      md:translate-x-0`}
    >
      {/* Header */}
      <div className="flex justify-between items-center md:block border-b border-white ">
        <h1 className="text-3xl font-bold mb-6 kaushan-script-regular">
          Canopus
        </h1>
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setSidebarOpen(false)}
        >
          <FaTimes />
        </button>
      </div>

      {/* Sidebar Menu */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              setActive(item.label);
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-3 p-3 rounded-xl text-left font-medium transition-all duration-200
              ${
                active === item.label
                  ? "bg-white/20 shadow-lg backdrop-blur-md"
                  : "hover:bg-white/10"
              }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-white/20 text-sm text-center opacity-80">
        Logged in as: <span className="font-semibold">{user?.name}</span>
        <br />
        <span className="text-xs capitalize">({user?.role})</span>
      </div>
    </aside>
  );
}

export default AdminSidebar;
