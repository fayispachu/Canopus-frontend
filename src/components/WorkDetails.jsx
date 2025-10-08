import React, { useContext, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import WorkContext from "../context/WorkContext";
import UserContext from "../context/UserContext";

function WorkDetails({ work, onClose }) {
  const { updateWork } = useContext(WorkContext);
  const { user } = useContext(UserContext);

  // Initialize staff status
  const [staffStatus, setStaffStatus] = useState(
    work.assignedTo.map((u) => ({ ...u, status: u.status || "pending" }))
  );

  const handleMarkReady = () => {
    const updated = staffStatus.map((s) =>
      s.user._id === user._id ? { ...s, status: "ready" } : s
    );
    setStaffStatus(updated);
    updateWork(work._id, { assignedTo: updated });
  };

  const getStatusClasses = (status) => {
    const base = "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors";
    switch (status) {
      case "ready":
        return `${base} bg-green-600 text-white border border-green-500`;
      case "leave":
        return `${base} bg-red-600 text-white border border-red-500`;
      default:
        return `${base} bg-gray-700 text-gray-200 border border-gray-600`;
    }
  };

  return (
    <div className="bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-lg w-full h-full relative text-gray-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close Work Details"
        >
          <FaTimes size={20} />
        </button>

        {/* Work Title & Due Date */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold">{work.title}</h2>
          {work.dueDate && (
            <p className="text-sm text-gray-400 mt-1">
              Due: {new Date(work.dueDate).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Description */}
        {work.description && <p className="text-gray-300 mb-6">{work.description}</p>}

        {/* Assigned Staff */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Assigned Staff</h4>
          <div className="flex flex-wrap gap-3">
            {staffStatus.map(({ user: u, status }) => (
              <div key={u._id} className={getStatusClasses(status)}>
                {u.name}
              </div>
            ))}
          </div>
        </div>

        {/* Mark Ready Button */}
        {staffStatus.some((s) => s.user._id === user._id && s.status === "pending") && (
          <button
            onClick={handleMarkReady}
            className="w-full px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold shadow-md transition-colors duration-200"
          >
            Mark Ready
          </button>
        )}
      </motion.div>
    </div>
  );
}

export default WorkDetails;
