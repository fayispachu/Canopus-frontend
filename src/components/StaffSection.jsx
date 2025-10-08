import { useContext, useMemo } from "react";
import {
  FaUsers,
  FaTasks,
  FaCheckCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import UserContext from "../context/UserContext";
import WorkContext from "../context/WorkContext";

function StaffSection() {
  const { allUsers = [], loading: usersLoading } = useContext(UserContext);
  const { allWorks = [], loading: worksLoading } = useContext(WorkContext);

  // Filter staff users
  const staffUsers = useMemo(() => {
    return allUsers.filter((u) => u.role === "staff");
  }, [allUsers]);

  // Compute work stats
  const { totalWorks, completedWorks, pendingWorks } = useMemo(() => {
    const completed = allWorks.filter((w) => w.status === "completed").length;
    const pending = allWorks.length - completed;
    return {
      totalWorks: allWorks.length,
      completedWorks: completed,
      pendingWorks: pending,
    };
  }, [allWorks]);

  if (usersLoading || worksLoading)
    return (
      <p className="text-center text-gray-500 mt-10 text-lg">Loading...</p>
    );

  const cardData = [
    {
      title: "Total Staffs",
      count: staffUsers.length,
      icon: <FaUsers className="text-3xl" />,
      color: "from-red-400 to-red-600",
    },
    {
      title: "Total Works",
      count: totalWorks,
      icon: <FaTasks className="text-3xl" />,
      color: "from-orange-400 to-orange-600",
    },
    {
      title: "Completed Works",
      count: completedWorks,
      icon: <FaCheckCircle className="text-3xl" />,
      color: "from-green-400 to-green-600",
    },
    {
      title: "Pending Works",
      count: pendingWorks,
      icon: <FaHourglassHalf className="text-3xl" />,
      color: "from-yellow-400 to-yellow-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {cardData.map((card, index) => (
          <div
            key={index}
            className={`p-5 rounded-2xl shadow-lg bg-gradient-to-br ${card.color} text-white flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-200`}
          >
            {card.icon}
            <h2 className="text-2xl font-bold mt-3">{card.count}</h2>
            <p className="text-sm uppercase tracking-wide">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-2xl p-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 rounded-t-2xl">
            <tr>
              {["#", "Name", "Role", "Email", "Profile"].map((title) => (
                <th
                  key={title}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {staffUsers.map((u, index) => (
              <tr
                key={u._id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-4 py-3 text-gray-700 font-medium">
                  {index + 1}
                </td>
                <td className="px-4 py-3 font-semibold text-gray-800">{u.name}</td>
                <td className="px-4 py-3 capitalize text-gray-600">{u.role}</td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3">
                  <img
                    src={u.image || "https://randomuser.me/api/portraits/men/12.jpg"}
                    alt={u.name}
                    className="w-12 h-12 rounded-full border-2 border-gray-200 shadow-sm"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StaffSection;
