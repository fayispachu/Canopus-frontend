import React, { useState, useEffect } from "react";
import { FaPlus, FaUserCheck, FaTasks } from "react-icons/fa";
import { motion } from "framer-motion";

function WorkManagement() {
  const [presentStaff, setPresentStaff] = useState([]);
  const [works, setWorks] = useState([]);
  const [newWork, setNewWork] = useState({
    title: "",
    description: "",
    assignedTo: [],
  });
  const [showForm, setShowForm] = useState(false);

  // ✅ Dummy present staff (fetch from backend later)
  useEffect(() => {
    const todayPresent = [
      { id: 1, name: "Rahul Kumar", role: "Chef" },
      { id: 2, name: "Sneha Patel", role: "Waiter" },
      { id: 3, name: "Aarav Singh", role: "Cleaner" },
    ];
    setPresentStaff(todayPresent);
  }, []);

  // ✅ Add new work
  const handleAddWork = () => {
    if (!newWork.title.trim()) return alert("Please enter work title");
    const newEntry = {
      id: Date.now(),
      ...newWork,
      createdAt: new Date().toLocaleString(),
    };
    setWorks([...works, newEntry]);
    setNewWork({ title: "", description: "", assignedTo: [] });
    setShowForm(false);
  };

  // ✅ Toggle assigned staff
  const toggleAssign = (staffId) => {
    setNewWork((prev) => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(staffId)
        ? prev.assignedTo.filter((id) => id !== staffId)
        : [...prev.assignedTo, staffId],
    }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaTasks /> Work Management
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> Add Work
        </button>
      </div>

      {/* Add Work Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-md mb-6"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            New Work Details
          </h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Work Title
            </label>
            <input
              type="text"
              value={newWork.title}
              onChange={(e) =>
                setNewWork({ ...newWork, title: e.target.value })
              }
              className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="E.g., Setup dining tables"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Description
            </label>
            <textarea
              value={newWork.description}
              onChange={(e) =>
                setNewWork({ ...newWork, description: e.target.value })
              }
              className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="E.g., Arrange 10 tables for the wedding event"
              rows={3}
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Assign To (Present Staff)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {presentStaff.map((staff) => (
                <button
                  key={staff.id}
                  onClick={() => toggleAssign(staff.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    newWork.assignedTo.includes(staff.id)
                      ? "bg-red-600 text-white border-red-700"
                      : "bg-gray-50 hover:bg-gray-100 border-gray-300"
                  }`}
                >
                  <span>
                    {staff.name}{" "}
                    <span className="text-xs opacity-70">({staff.role})</span>
                  </span>
                  {newWork.assignedTo.includes(staff.id) && <FaUserCheck />}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleAddWork}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
            >
              Save Work
            </button>
          </div>
        </motion.div>
      )}

      {/* Work List */}
      <div className="grid gap-4">
        {works.map((work) => (
          <motion.div
            key={work.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow p-5 border-l-4 border-red-600"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">{work.title}</h3>
              <span className="text-sm text-gray-500">{work.createdAt}</span>
            </div>
            <p className="text-gray-600 mt-2">{work.description}</p>
            <div className="mt-3">
              <h4 className="font-semibold text-sm text-gray-700">
                Assigned To:
              </h4>
              <ul className="text-gray-700 text-sm list-disc list-inside">
                {work.assignedTo.map((id) => {
                  const staff = presentStaff.find((s) => s.id === id);
                  return (
                    <li key={id}>
                      {staff?.name}{" "}
                      <span className="opacity-70">({staff?.role})</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        ))}

        {works.length === 0 && (
          <p className="text-gray-500 text-center mt-10">No work added yet.</p>
        )}
      </div>
    </div>
  );
}

export default WorkManagement;
