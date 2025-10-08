import React, { useContext, useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa";
import UserContext from "../context/UserContext";
import BookingContext from "../context/BookingContext";

const LatestBookings = () => {
  const { user } = useContext(UserContext);
  const {
    bookings = [],
    fetchBookings,
    handleCancelConfirm,
    handleCancelRequest,
  } = useContext(BookingContext);

  const [loading, setLoading] = useState(true);
  const [localBookings, setLocalBookings] = useState([]);

  // Load bookings
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchBookings(user);
      setLoading(false);
    };
    load();
  }, [user, fetchBookings]);

  // Sync local state safely
  useEffect(() => {
    setLocalBookings(Array.isArray(bookings) ? bookings : []);
  }, [bookings]);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    alert(`Copied ${label}: ${text}`);
  };

  const requestCancel = (bookingId) => {
    setLocalBookings((prev) =>
      Array.isArray(prev)
        ? prev.map((b) =>
            b._id === bookingId ? { ...b, cancelRequest: true } : b
          )
        : []
    );
    handleCancelRequest(bookingId);
  };

  const approveCancel = (bookingId) => {
    setLocalBookings((prev) =>
      Array.isArray(prev)
        ? prev.map((b) =>
            b._id === bookingId
              ? { ...b, cancelRequest: false, status: "cancelled" }
              : b
          )
        : []
    );
    handleCancelConfirm(bookingId, true);
  };

  const rejectCancel = (bookingId) => {
    setLocalBookings((prev) =>
      Array.isArray(prev)
        ? prev.map((b) =>
            b._id === bookingId ? { ...b, cancelRequest: false } : b
          )
        : []
    );
    handleCancelConfirm(bookingId, false);
  };

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10 text-lg">
        Loading bookings...
      </p>
    );

  const activeBookings = Array.isArray(localBookings)
    ? localBookings.filter((b) => b.status !== "cancelled")
    : [];

  const cancelledBookings = Array.isArray(localBookings)
    ? localBookings.filter((b) => b.status === "cancelled")
    : [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Latest Bookings</h2>

      {/* Active Bookings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeBookings.length === 0 && (
          <p className="text-gray-500 col-span-full text-center">
            No active bookings.
          </p>
        )}
        {activeBookings.map((booking, index) => (
          <div
            key={booking._id}
            className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition-shadow relative border border-gray-100"
          >
            {booking.cancelRequest && (
              <span className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">
                Cancel Requested
              </span>
            )}

            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-400 font-semibold">{index + 1}.</span>
              <span className="text-sm text-gray-500">
                {new Date(booking.date).toLocaleDateString()}
              </span>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {booking.event}
            </h3>

            {booking.customerName && (
              <p className="text-gray-600 flex items-center gap-2 mb-1">
                <span className="font-medium">Name:</span> {booking.customerName}
                <button
                  onClick={() => copyToClipboard(booking.customerName, "name")}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaCopy />
                </button>
              </p>
            )}

            {booking.phone && (
              <p className="text-gray-600 flex items-center gap-2 mb-1">
                <span className="font-medium">Phone:</span> {booking.phone}
                <button
                  onClick={() => copyToClipboard(booking.phone, "phone")}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaCopy />
                </button>
              </p>
            )}

            {booking.place && (
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Place:</span> {booking.place}
              </p>
            )}

            <p className="text-gray-600 mb-3">
              <span className="font-medium">Guests:</span> {booking.guests}
            </p>

            {/* Buttons */}
            {booking.cancelRequest ? (
              (user.role === "admin" || user.role === "manager") && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => approveCancel(booking._id)}
                    className="flex-1 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 text-sm font-medium"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectCancel(booking._id)}
                    className="flex-1 bg-gray-400 text-white px-3 py-1 rounded-lg hover:bg-gray-500 text-sm font-medium"
                  >
                    Reject
                  </button>
                </div>
              )
            ) : user.role === "customer" ? (
              <button
                onClick={() => requestCancel(booking._id)}
                className="mt-3 w-full bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-sm font-medium"
              >
                Cancel
              </button>
            ) : null}
          </div>
        ))}
      </div>

      {/* Cancelled Bookings */}
      {cancelledBookings.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Cancelled Bookings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cancelledBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-red-50 text-red-800 rounded-2xl shadow-md p-5 relative border border-red-200"
              >
                <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  Cancelled
                </span>
                <h3 className="text-lg font-semibold mb-1">{booking.event}</h3>
                <p>
                  <span className="font-medium">Name:</span> {booking.customerName}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(booking.date).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Guests:</span> {booking.guests}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LatestBookings;
