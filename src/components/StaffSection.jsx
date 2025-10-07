import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaSmile, FaUserCheck, FaUsers } from "react-icons/fa";

function StaffSection() {
  const staffData = [
    {
      name: "Aisha Khan",
      jobTitle: "Event Coordinator",
      department: "Catering",
    },
    { name: "Rahul Menon", jobTitle: "Chef", department: "Kitchen" },
    { name: "Linda Parker", jobTitle: "Waiter", department: "Service" },
    { name: "Ravi Kumar", jobTitle: "Cleaner", department: "Maintenance" },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const filteredStaff = staffData.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Manage Staff
      </h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<FaUsers />}
          label="Total Staff"
          value="42"
          color="text-red-600"
        />
        <StatCard
          icon={<FaUserCheck />}
          label="Active Staff"
          value="38"
          color="text-green-600"
        />
        <StatCard
          icon={<FaSmile />}
          label="On Leave"
          value="3"
          color="text-yellow-500"
        />
        <StatCard
          icon={<FaUser />}
          label="New Joinees"
          value="1"
          color="text-blue-600"
        />
      </div>

      {/* Search + Table */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Job Title</th>
                <th className="py-3 px-4 text-left">Department</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((staff, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="py-3 px-4 flex items-center gap-2">
                    <img
                      src={`https://randomuser.me/api/portraits/${
                        index % 2 === 0 ? "men" : "women"
                      }/${index + 20}.jpg`}
                      alt={staff.name}
                      className="w-8 h-8 rounded-full border"
                    />
                    {staff.name}
                  </td>
                  <td className="py-3 px-4">{staff.jobTitle}</td>
                  <td className="py-3 px-4">{staff.department}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

const StatCard = ({ icon, label, value, color }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="flex items-center gap-4 bg-white rounded-xl shadow p-4"
  >
    <div className={`text-3xl ${color}`}>{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <h2 className="text-xl font-semibold">{value}</h2>
    </div>
  </motion.div>
);

export default StaffSection;
