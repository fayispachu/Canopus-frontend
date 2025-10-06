import React, { useState, useContext } from "react";
import { FaTimes } from "react-icons/fa";
import AdminContext from "../context/AdminContext";

function AdminSidebar({ active, setActive, sidebarOpen, setSidebarOpen }) {
  const { admin } = useContext(AdminContext);

  const sidebarItems =
    admin?.role === "admin"
      ? [
          "Dashboard",
          "Users",
          "Orders",
          "Staffs",
          "Inventory",
          "Schedules",
          "Works",
          "Support",
          "Settings",
          "Logout",
        ]
      : ["Dashboard", "Schedules", "Works", "Support", "Logout"];

  return (
    <aside
      className={`bg-red-600 min-h-[100vh] text-white p-6 flex flex-col gap-6
      md:w-64 fixed top-0 left-0 w-64 z-50 transform transition-transform duration-300
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      md:translate-x-0`}
    >
      <div className="flex justify-between items-center md:block">
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

      {sidebarItems.map((item) => (
        <button
          key={item}
          onClick={() => {
            setActive(item);
            setSidebarOpen(false);
          }}
          className={`text-left p-3 rounded-xl font-medium transition ${
            active === item ? "bg-red-700 shadow-lg" : "hover:bg-red-700"
          }`}
        >
          {item}
        </button>
      ))}
    </aside>
  );
}

export default AdminSidebar;
