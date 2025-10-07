import React, { useContext, useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa";
import UserContext from "../context/UserContext";
import BookingContext from "../context/BookingContext";

const LatestBookings = () => {
  const { user } = useContext(UserContext);
  const { bookings, fetchBookings, handleCancelConfirm, handleCancelRequest } =
    useContext(BookingContext);

  const [loading, setLoading] = useState(true);
  const [localBookings, setLocalBookings] = useState([]);

  // Load bookings and sync with local state
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchBookings(user);
      setLoading(false);
    };
    load();
  }, [user]);

  // Sync local state when bookings change
  useEffect(() => {
    setLocalBookings(bookings);
  }, [bookings]);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    alert(`Copied ${label}: ${text}`);
  };

  const requestCancel = (bookingId) => {
    setLocalBookings((prev) =>
      prev.map((b) => (b._id === bookingId ? { ...b, cancelRequest: true } : b))
    );
    handleCancelRequest(bookingId);
  };

  const approveCancel = (bookingId) => {
    // Remove cancelRequest and mark as cancelled immediately
    setLocalBookings((prev) =>
      prev.map((b) =>
        b._id === bookingId
          ? { ...b, cancelRequest: false, status: "cancelled" }
          : b
      )
    );
    handleCancelConfirm(bookingId, true); // backend update
  };

  const rejectCancel = (bookingId) => {
    // Remove cancelRequest immediately
    setLocalBookings((prev) =>
      prev.map((b) =>
        b._id === bookingId ? { ...b, cancelRequest: false } : b
      )
    );
    handleCancelConfirm(bookingId, false); // backend update
  };

  if (loading) return <p>Loading bookings...</p>;

  const activeBookings = localBookings.filter((b) => b.status !== "cancelled");
  const cancelledBookings = localBookings.filter(
    (b) => b.status === "cancelled"
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Latest Bookings</h2>

      {/* Active Bookings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeBookings.map((booking, index) => (
          <div
            key={booking._id}
            className="bg-white shadow-lg rounded-xl p-5 hover:shadow-2xl transition-shadow relative"
          >
            {booking.cancelRequest && (
              <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded">
                Cancel Requested
              </span>
            )}

            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-semibold">{index + 1}.</span>
              <span className="text-sm text-gray-500">
                {new Date(booking.date).toLocaleDateString()}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {booking.event}
            </h3>

            {booking.customerName && (
              <p className="text-gray-600 flex items-center gap-2 mb-1">
                <span className="font-medium">Name:</span>{" "}
                {booking.customerName}
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

            {/* Cancel/Approve/Reject Buttons */}
            {booking.cancelRequest ? (
              (user.role === "admin" || user.role === "manager") && (
                <div className="flex gap-2">
                  <button
                    onClick={() => approveCancel(booking._id)}
                    className="flex-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectCancel(booking._id)}
                    className="flex-1 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-xs"
                  >
                    Reject
                  </button>
                </div>
              )
            ) : user.role === "customer" ? (
              <button
                onClick={() => requestCancel(booking._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cancelledBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-red-100 text-red-800 shadow-lg rounded-xl p-5 relative"
              >
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  Cancelled
                </span>
                <h3 className="text-lg font-semibold">{booking.event}</h3>
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {booking.customerName}
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
