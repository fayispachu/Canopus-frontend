import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUserCheck,
  FaUserTimes,
  FaClock,
  FaWalking,
  FaSearch,
} from "react-icons/fa";

function AttendanceSection() {
  const [searchTerm, setSearchTerm] = useState("");

  const staffAttendance = [
    {
      name: "Aisha Khan",
      department: "Catering",
      status: "Present",
      checkIn: "09:03 AM",
      checkOut: "06:10 PM",
    },
    {
      name: "Rahul Menon",
      department: "Kitchen",
      status: "Late",
      checkIn: "09:48 AM",
      checkOut: "06:20 PM",
    },
    {
      name: "Linda Parker",
      department: "Service",
      status: "Absent",
      checkIn: "-",
      checkOut: "-",
    },
    {
      name: "Ravi Kumar",
      department: "Maintenance",
      status: "On Leave",
      checkIn: "-",
      checkOut: "-",
    },
  ];

  const filtered = staffAttendance.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Attendance Overview
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<FaUserCheck />}
          label="Present"
          value={26}
          color="text-green-600"
          bg="bg-green-100"
        />
        <StatCard
          icon={<FaUserTimes />}
          label="Absent"
          value={4}
          color="text-red-600"
          bg="bg-red-100"
        />
        <StatCard
          icon={<FaClock />}
          label="Late"
          value={3}
          color="text-yellow-600"
          bg="bg-yellow-100"
        />
        <StatCard
          icon={<FaWalking />}
          label="On Leave"
          value={2}
          color="text-blue-600"
          bg="bg-blue-100"
        />
      </div>

      {/* Search */}
      <div className="flex items-center mb-4 bg-white shadow-sm p-3 rounded-xl">
        <FaSearch className="text-gray-500 text-lg mr-3" />
        <input
          type="text"
          placeholder="Search staff..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full outline-none text-gray-700"
        />
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Department</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Check-In</th>
              <th className="py-3 px-4 text-left">Check-Out</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="border-t hover:bg-gray-50"
              >
                <td className="py-3 px-4 flex items-center gap-2">
                  <img
                    src={`https://randomuser.me/api/portraits/${
                      i % 2 === 0 ? "men" : "women"
                    }/${i + 40}.jpg`}
                    alt={s.name}
                    className="w-8 h-8 rounded-full border"
                  />
                  {s.name}
                </td>
                <td className="py-3 px-4">{s.department}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      s.status === "Present"
                        ? "bg-green-100 text-green-700"
                        : s.status === "Late"
                        ? "bg-yellow-100 text-yellow-700"
                        : s.status === "Absent"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="py-3 px-4">{s.checkIn}</td>
                <td className="py-3 px-4">{s.checkOut}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const StatCard = ({ icon, label, value, color, bg }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`flex items-center gap-4 ${bg} rounded-xl shadow p-4`}
  >
    <div className={`text-3xl ${color}`}>{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <h2 className="text-xl font-semibold">{value}</h2>
    </div>
  </motion.div>
);

export default AttendanceSection;
