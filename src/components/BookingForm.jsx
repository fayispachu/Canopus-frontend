import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrashAlt, FaTimes } from "react-icons/fa";
import BookingContext from "../context/BookingContext";
import MenuPopup from "./MenuPopup";

function BookingForm({ onClose }) {
  const {
    selectedItems,
    toggleSelectItem,
    serviceType,
    setServiceType,
    event,
    setEvent,
    place,
    setPlace,
    date,
    setDate,
    guests,
    setGuests,
    submitBooking,
    message,
    setMessage,
  } = useContext(BookingContext);

  const [phone, setPhone] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!phone) {
      setMessage("Please enter a phone number.");
      return;
    }

    submitBooking();
    setPhone("");
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="p-6 md:p-10 bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
          >
            <FaTimes />
          </button>

          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Book Catering Service or Rent Items
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event & Venue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">
                  Event Name
                </label>
                <input
                  type="text"
                  placeholder="Enter event name"
                  value={event}
                  onChange={(e) => setEvent(e.target.value)}
                  className="p-3 border rounded-lg focus:ring focus:ring-orange-300 w-full"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">
                  Venue / Place
                </label>
                <input
                  type="text"
                  placeholder="Enter place or venue"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  className="p-3 border rounded-lg focus:ring focus:ring-orange-300 w-full"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">
                  Event Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="p-3 border rounded-lg focus:ring focus:ring-orange-300 w-full"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">
                  Number of Guests
                </label>
                <input
                  type="number"
                  placeholder="Number of guests"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="p-3 border rounded-lg focus:ring focus:ring-orange-300 w-full"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="p-3 border rounded-lg focus:ring focus:ring-orange-300 w-full"
                required
              />
            </div>

            {/* Service Type */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <span className="font-medium text-gray-700">Service Type:</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="serviceType"
                  value="rent"
                  checked={serviceType === "rent"}
                  onChange={() => setServiceType("rent")}
                  className="accent-orange-500"
                />
                Rent Only
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="serviceType"
                  value="catering"
                  checked={serviceType === "catering"}
                  onChange={() => setServiceType("catering")}
                  className="accent-orange-500"
                />
                Book Catering Service
              </label>
            </div>

            {/* Selected Items & Button */}
            <div className="flex flex-col">
              <label className="mb-2 font-medium text-gray-700">
                Selected Items
              </label>
              {selectedItems?.length > 0 ? (
                <ul className="space-y-2 mb-2">
                  {selectedItems.map((item) => (
                    <li
                      key={item._id}
                      className="flex justify-between items-center bg-orange-100 border border-orange-400 px-4 py-2 rounded"
                    >
                      <span>{item.name}</span>
                      <button
                        type="button"
                        onClick={() => toggleSelectItem(item)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <FaTrashAlt />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 mb-2">No items selected</p>
              )}
              <button
                type="button"
                onClick={() => setShowPopup(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Select Items
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-semibold text-lg"
            >
              Submit Booking
            </button>

            {/* Message */}
            {message && (
              <p className="text-center text-gray-700 mt-2 text-sm">
                {message}
              </p>
            )}
          </form>

          {/* Menu Popup */}
          {showPopup && <MenuPopup onClose={() => setShowPopup(false)} />}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default BookingForm;
