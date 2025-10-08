import { useContext, useEffect, useState } from "react";
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

  const [stats, setStats] = useState({
    staff: 0,
    totalWorks: 0,
    completedWorks: 0,
    pendingWorks: 0,
  });

  useEffect(() => {
    if (!usersLoading && !worksLoading) {
      // Filter only staff
      const staffUsers = allUsers.filter((u) => u.role === "staff");

      // Calculate completed and pending works
      const completedWorks = allWorks.filter(
        (w) => w.status === "completed"
      ).length;
      const pendingWorks = allWorks.filter(
        (w) => w.status !== "completed"
      ).length;

      setStats({
        staff: staffUsers.length,
        totalWorks: allWorks.length,
        completedWorks,
        pendingWorks,
      });
    }
  }, [allUsers, allWorks, usersLoading, worksLoading]);

  if (usersLoading || worksLoading) return <p>Loading...</p>;

  const cardData = [
    {
      title: "Total Staffs",
      count: stats.staff,
      icon: <FaUsers className="text-2xl" />,
      color: "bg-red-500",
    },
    {
      title: "Total Works",
      count: stats.totalWorks,
      icon: <FaTasks className="text-2xl" />,
      color: "bg-red-500",
    },
    {
      title: "Completed Works",
      count: stats.completedWorks,
      icon: <FaCheckCircle className="text-2xl" />,
      color: "bg-red-500",
    },
    {
      title: "Pending Works",
      count: stats.pendingWorks,
      icon: <FaHourglassHalf className="text-2xl" />,
      color: "bg-red-500",
    },
  ];

  // Filter users for table
  const filteredUsers = allUsers.filter((u) => u.role === "staff");

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cardData.map((card, index) => (
          <div
            key={index}
            className={`p-4 ${card.color} text-white shadow flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-200`}
          >
            {card.icon}
            <h2 className="text-xl font-bold mt-2">{card.count}</h2>
            <p className="text-sm uppercase tracking-wide">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white shadow rounded-xl p-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((u, index) => (
              <tr
                key={u._id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2 font-semibold">{u.name}</td>
                <td className="px-4 py-2">{u.role}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">
                  <img
                    src={
                      u.image ||
                      "https://randomuser.me/api/portraits/men/12.jpg"
                    }
                    alt={u.name}
                    className="w-8 h-8 rounded-full border border-gray-300"
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
