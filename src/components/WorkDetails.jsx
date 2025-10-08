import React, { useContext, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import WorkContext from "../context/WorkContext";
import UserContext from "../context/UserContext";

function WorkDetails({ work, onClose }) {
  const { updateWork } = useContext(WorkContext);
  const { user } = useContext(UserContext);

  const [staffStatus, setStaffStatus] = useState(
    work.assignedTo.map((u) => ({ ...u, status: u.status || "pending" }))
  );

  const handleMarkReady = () => {
    const updated = staffStatus.map((u) =>
      u._id === user._id ? { ...u, status: "ready" } : u
    );
    setStaffStatus(updated);

    updateWork(work._id, { assignedTo: updated });
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "ready":
        return "bg-green-500 text-white";
      case "leave":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <FaTimes size={20} />
        </button>

        {/* Work Title & Due Date */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{work.title}</h2>
          {work.dueDate && (
            <p className="text-sm text-gray-500 mt-1">
              Due: {new Date(work.dueDate).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-6">{work.description}</p>

        {/* Assigned Staff */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-2">Assigned Staff</h4>
          <div className="flex flex-wrap gap-3">
            {staffStatus.map((u) => (
              <div
                key={u._id}
                className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusClasses(
                  u.status
                )}`}
              >
                <img
                  src={
                    u.profilePic || `https://ui-avatars.com/api/?name=${u.name}`
                  }
                  alt={u.name}
                  className="w-6 h-6 rounded-full border border-gray-300"
                />
                <span className="text-sm font-medium">{u.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mark Ready Button */}
        {staffStatus.some(
          (s) => s._id === user._id && s.status === "pending"
        ) && (
          <button
            onClick={handleMarkReady}
            className="w-full px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md transition-colors"
          >
            Mark Ready
          </button>
        )}
      </motion.div>
    </div>
  );
}

export default WorkDetails;
