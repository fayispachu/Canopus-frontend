import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaSearch, FaUserShield } from "react-icons/fa";

function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([
    { id: 1, name: "Aisha Khan", email: "aisha@canopus.com", role: "Admin" },
    { id: 2, name: "Rahul Menon", email: "rahul@canopus.com", role: "Manager" },
    { id: 3, name: "Linda Parker", email: "linda@canopus.com", role: "Staff" },
    { id: 4, name: "Ravi Kumar", email: "ravi@canopus.com", role: "Staff" },
  ]);

  const [editUser, setEditUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  // Filter users
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = (id, role) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, role } : u)));
    setEditUser(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <FaUserShield className="text-red-600" /> Manage Users
        </h1>
      </div>

      {/* Search Bar */}
      <div className="flex items-center mb-4 bg-white shadow-sm p-3 rounded-xl">
        <FaSearch className="text-gray-500 text-lg mr-3" />
        <input
          type="text"
          placeholder="Search user by name, email or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full outline-none text-gray-700"
        />
      </div>

      {/* User Table */}
      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u, i) => (
              <motion.tr
                key={u.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-t hover:bg-gray-50"
              >
                <td className="py-3 px-4 flex items-center gap-2">
                  <img
                    src={`https://randomuser.me/api/portraits/${
                      i % 2 === 0 ? "men" : "women"
                    }/${i + 30}.jpg`}
                    alt={u.name}
                    className="w-8 h-8 rounded-full border"
                  />
                  {u.name}
                </td>
                <td className="py-3 px-4">{u.email}</td>
                <td className="py-3 px-4">
                  {editUser === u.id ? (
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="border rounded-lg p-1 text-sm"
                    >
                      <option value="">Select role</option>
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Staff">Staff</option>
                    </select>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        u.role === "Admin"
                          ? "bg-red-100 text-red-700"
                          : u.role === "Manager"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  )}
                </td>

                <td className="py-3 px-4 text-center">
                  {editUser === u.id ? (
                    <button
                      onClick={() => handleRoleChange(u.id, newRole)}
                      className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600"
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditUser(u.id);
                          setNewRole(u.role);
                        }}
                        className="text-blue-500 hover:text-blue-700 mr-3"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;
