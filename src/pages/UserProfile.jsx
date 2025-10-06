import React, { useContext, useState, useEffect } from "react";
import {
  FaTrashAlt,
  FaPlus,
  FaCalendarAlt,
  FaEdit,
  FaSignOutAlt,
  FaUpload,
} from "react-icons/fa";
import UserContext from "../context/UserContext";
import BookingContext from "../context/BookingContext";

function UserProfile() {
  const { user, toggleAttendance, logoutUser, updateUser } =
    useContext(UserContext);
  const { bookings, addBooking, updateBooking, deleteBooking } =
    useContext(BookingContext);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [image, setImage] = useState(user?.image || "");

  // Keep local form state in sync with user context
  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setImage(user?.image || "");
  }, [user]);

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading...
      </div>
    );

  const handleLogout = () => logoutUser();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateUser({ name, email, image });
    setIsEditing(false);
  };

  const handleDeleteBooking = (bookingId) => {
    deleteBooking(bookingId);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto pt-24 px-4 md:px-8 space-y-10">
        {/* User Info Card */}
        <div className="bg-white shadow-md rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="w-28 h-28 rounded-full border-4 border-red-500"
                />
              ) : (
                <div className="w-28 h-28 flex items-center justify-center rounded-full bg-red-500 text-white text-5xl font-bold">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full border cursor-pointer hover:bg-gray-100">
                  <FaUpload className="text-red-500" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="flex flex-col gap-2">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border rounded px-3 py-1 focus:ring focus:ring-orange-300"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border rounded px-3 py-1 focus:ring focus:ring-orange-300"
                  />
                </>
              ) : (
                <>
                  <h2 className="text-3xl md:text-4xl font-bold">{name}</h2>
                  <p className="text-gray-600">{email}</p>
                </>
              )}

              {/* Show role and attendance only if not a customer */}
              {user.role !== "customer" && (
                <>
                  <p className="text-gray-500 capitalize">Role: {user.role}</p>
                  <p className="text-gray-500">
                    Attendance:{" "}
                    <span
                      className={`font-semibold ${
                        user.attendance ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {user.attendance ? "Present" : "Absent"}
                    </span>
                    <button
                      onClick={toggleAttendance}
                      className="ml-3 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                    >
                      Toggle
                    </button>
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4 md:mt-0">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 flex items-center gap-2"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FaCalendarAlt className="text-red-500" /> Your Bookings
          </h3>

          {(!bookings || bookings.length === 0) && (
            <p className="text-gray-500">No bookings yet.</p>
          )}

          {bookings?.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 border-b text-left">Event</th>
                    <th className="px-4 py-3 border-b text-left">Date</th>
                    <th className="px-4 py-3 border-b text-left">Guests</th>
                    <th className="px-4 py-3 border-b text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr
                      key={b._id}
                      className="hover:bg-gray-100 transition-all duration-150"
                    >
                      <td className="px-4 py-3 border-b">{b.event}</td>
                      <td className="px-4 py-3 border-b">
                        {new Date(b.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 border-b">{b.guests}</td>
                      <td className="px-4 py-3 border-b text-center">
                        <button
                          onClick={() => handleDeleteBooking(b._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            onClick={() =>
              addBooking({
                event: "New Event",
                date: new Date(),
                guests: 1,
                items: [],
              })
            }
            className="mt-4 flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition font-semibold"
          >
            <FaPlus /> Make New Booking
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
