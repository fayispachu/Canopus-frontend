import React, { useState, useContext, useEffect } from "react";
import { FaPlus, FaUserCheck, FaTasks, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import WorkContext from "../context/WorkContext";
import UserContext from "../context/UserContext";
import WorkDetails from "./WorkDetails";

function WorkManagement() {
  const { works, addWork, deleteWork, loading } = useContext(WorkContext);
  const { allUsers } = useContext(UserContext);

  const [presentStaff, setPresentStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newWork, setNewWork] = useState({
    title: "",
    description: "",
    assignedTo: [],
    dueDate: "",
  });
  const [selectedWork, setSelectedWork] = useState(null); // for detail modal

  // Filter staff only (exclude customer/admin/manager)
  useEffect(() => {
    setPresentStaff(
      allUsers.filter((u) => !["customer", "admin", "manager"].includes(u.role))
    );
  }, [allUsers]);

  const toggleAssign = (staffId) => {
    setNewWork((prev) => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(staffId)
        ? prev.assignedTo.filter((id) => id !== staffId)
        : [...prev.assignedTo, staffId],
    }));
  };

  const handleAddWork = async () => {
    if (!newWork.title.trim()) return alert("Title required");
    await addWork(newWork);
    setNewWork({ title: "", description: "", assignedTo: [], dueDate: "" });
    setShowForm(false);
  };

  const handleDeleteWork = (id) => {
    if (window.confirm("Are you sure you want to delete this work?")) {
      deleteWork(id);
    }
  };

  if (loading) return <p>Loading works...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaTasks /> Work Management
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all hover:scale-105"
        >
          <FaPlus /> Add Work
        </button>
      </div>

      {/* Add Work Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white rounded-3xl shadow-2xl p-6 max-w-lg w-full relative"
          >
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Create New Work
            </h3>

            <input
              type="text"
              placeholder="Work Title"
              value={newWork.title}
              onChange={(e) =>
                setNewWork({ ...newWork, title: e.target.value })
              }
              className="w-full p-3 mb-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <textarea
              placeholder="Description"
              value={newWork.description}
              onChange={(e) =>
                setNewWork({ ...newWork, description: e.target.value })
              }
              className="w-full p-3 mb-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              rows={3}
            />
            <input
              type="date"
              value={newWork.dueDate}
              onChange={(e) =>
                setNewWork({ ...newWork, dueDate: e.target.value })
              }
              className="w-full p-3 mb-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            {/* Staff Assignment */}
            <div className="max-h-64 overflow-y-auto border rounded-xl p-3 mb-3 bg-gray-50">
              <h4 className="font-semibold mb-3 text-gray-700">Assign Staff</h4>
              <div className="flex flex-col gap-2">
                {presentStaff.map((staff) => {
                  const isSelected = newWork.assignedTo.includes(staff._id);
                  return (
                    <div
                      key={staff._id}
                      onClick={() => toggleAssign(staff._id)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? "bg-red-600 text-white shadow-lg"
                          : "bg-white hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            staff.profilePic ||
                            `https://ui-avatars.com/api/?name=${staff.name}`
                          }
                          alt={staff.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{staff.name}</p>
                          <small className="opacity-70">{staff.role}</small>
                        </div>
                      </div>
                      {isSelected && <FaUserCheck />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddWork}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md transition-all"
              >
                Save Work
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Work List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {works.map((work) => (
          <motion.div
            key={work._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            className="bg-red-500  p-5 relative shadow-2xl border border-red-400 cursor-pointer"
            onClick={() => {
              const fullWork = {
                ...work,
                assignedTo: presentStaff.filter((u) =>
                  work.assignedTo.includes(u._id)
                ),
              };
              setSelectedWork(fullWork);
            }}
          >
            <h3 className="text-lg font-bold mb-1 text-white">
              {work.title}
            </h3>
            {work.dueDate && (
              <p className="text-xs text-white mb-2 font-medium">
                Due: {new Date(work.dueDate).toLocaleDateString()}
              </p>
            )}
            <p className="text-sm text-white mb-3 truncate">
              {work.description}
            </p>

            <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-red-400 scrollbar-track-red-100">
              {work.assignedTo.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center gap-1 bg-white rounded-full px-3 py-1 text-xs shadow-sm flex-shrink-0"
                >
                  <img
                    src={
                      u.profilePic ||
                      `https://ui-avatars.com/api/?name=${u.name}`
                    }
                    alt={u.name}
                    className="w-5 h-5 rounded-full"
                  />
                  <span>{u.name}</span>
                </div>
              ))}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteWork(work._id);
              }}
              className="absolute top-3 right-3 text-black hover:text-red-900"
              title="Delete Work"
            >
              <FaTrash />
            </button>
          </motion.div>
        ))}
        {works.length === 0 && (
          <p className="text-gray-500 text-center mt-10">No works yet.</p>
        )}
      </div>

      {/* Work Detail Modal */}
      {selectedWork && (
        <WorkDetails
          work={selectedWork}
          onClose={() => setSelectedWork(null)}
        />
      )}
    </div>
  );
}

export default WorkManagement;
