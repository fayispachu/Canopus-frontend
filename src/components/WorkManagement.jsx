import { useState, useContext } from "react";
import { FaTasks, FaTrash, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import WorkContext from "../context/WorkContext";
import UserContext from "../context/UserContext";

function WorkManagement() {
  const { works, deleteWork, updateWork, loading } = useContext(WorkContext);
  const { user } = useContext(UserContext);

  const [expandedWorkId, setExpandedWorkId] = useState(null);

  const handleDeleteWork = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this work?")) {
      deleteWork(id);
    }
  };

  const handleMarkReady = (work) => {
    const updatedStaff = work.assignedTo.map((s) =>
      s.user._id === user._id ? { ...s, status: "ready" } : s
    );
    updateWork(work._id, { assignedTo: updatedStaff });
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

  const getProgress = (work) => {
    if (!work.tasks || work.tasks.length === 0) return 0;
    const done = work.tasks.filter((t) => t.status === "done").length;
    return Math.round((done / work.tasks.length) * 100);
  };

  if (loading) return <p className="text-center mt-10">Loading works...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaTasks /> Work Dashboard
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {works.map((work) => {
          const isAssignedToMe = work.assignedTo.some((a) => a.user?._id === user._id);
          const progress = getProgress(work);

          let statusColor = "bg-gray-500";
          let statusText = "Pending";
          if (progress === 100) {
            statusColor = "bg-green-500";
            statusText = "Completed";
          } else if (progress > 0) {
            statusColor = "bg-yellow-500";
            statusText = "In Progress";
          }

          const expanded = expandedWorkId === work._id;

          return (
            <motion.div
              key={work._id}
              layout
              onClick={() => setExpandedWorkId(expanded ? null : work._id)}
              className={`cursor-pointer rounded-2xl shadow-lg p-5 bg-white border transition-all hover:shadow-2xl ${
                isAssignedToMe ? "border-green-500" : "border-gray-200"
              }`}
            >
              {/* Title & Status */}
              <div className="flex justify-between items-center mb-2">
                <h3 className={`text-lg font-semibold ${isAssignedToMe ? "text-green-700" : "text-gray-800"}`}>
                  {work.title}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${statusColor}`}>
                  {statusText}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3">{work.description}</p>

              {/* Meta: Due Date & Team */}
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <div>
                  <span className="font-medium">Due:</span> {new Date(work.dueDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Team:</span> {work.assignedTo.length} members
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedWorkId(expanded ? null : work._id);
                  }}
                  className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 text-xs transition"
                >
                  {expanded ? <span className="flex items-center gap-1"><FaTimes /> Close</span> : "View Details"}
                </button>
                <button
                  onClick={(e) => handleDeleteWork(work._id, e)}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs transition"
                >
                  <FaTrash />
                </button>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-4 border-t border-gray-200 pt-4"
                  >
                    <h4 className="font-semibold mb-2 text-gray-700">Assigned Staff</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {work.assignedTo.map((s) => (
                        <div key={s.user._id} className={getStatusClasses(s.status || "pending")}>
                          {s.user.name}
                        </div>
                      ))}
                    </div>

                    {/* Mark Ready button */}
                    {work.assignedTo.some((s) => s.user._id === user._id && s.status === "pending") && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkReady(work);
                        }}
                        className="w-full px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold shadow-md transition-colors duration-200"
                      >
                        Mark Ready
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default WorkManagement;
