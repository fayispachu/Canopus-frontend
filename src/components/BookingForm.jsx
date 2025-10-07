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
    phone,
    setPhone,
    submitBooking,
    message,
    setMessage,
  } = useContext(BookingContext);

  const [showPopup, setShowPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitBooking();

    setShowSuccessPopup(true);

    // reset form
    setEvent("");
    setPlace("");
    setDate("");
    setGuests("");
    setPhone("");
    setServiceType("rent");
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 overflow-auto p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-3xl relative overflow-y-auto max-h-[90vh] p-6 md:p-10"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
          >
            <FaTimes />
          </button>

          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
            Book Catering Service or Rent Items
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event & Venue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  label: "Event Name",
                  value: event,
                  setter: setEvent,
                  type: "text",
                },
                {
                  label: "Venue / Place",
                  value: place,
                  setter: setPlace,
                  type: "text",
                },
                {
                  label: "Event Date",
                  value: date,
                  setter: setDate,
                  type: "date",
                },
                {
                  label: "Number of Guests",
                  value: guests,
                  setter: setGuests,
                  type: "number",
                },
              ].map((field) => (
                <div key={field.label} className="flex flex-col">
                  <label className="mb-1 font-medium text-gray-700">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    className="p-3 border rounded-lg focus:ring focus:ring-orange-300 w-full"
                    required
                  />
                </div>
              ))}
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="p-3 border rounded-lg focus:ring focus:ring-orange-300 w-full"
                required
              />
            </div>

            {/* Service Type */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <span className="font-medium text-gray-700">Service Type:</span>
              {["rent", "catering"].map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="serviceType"
                    value={type}
                    checked={serviceType === type}
                    onChange={() => setServiceType(type)}
                    className="accent-orange-500"
                  />
                  {type === "rent" ? "Rent Only" : "Book Catering Service"}
                </label>
              ))}
            </div>

            {/* Selected Items */}
            <div className="flex flex-col">
              <label className="mb-2 font-medium text-gray-700">
                Selected Items
              </label>
              {selectedItems?.length > 0 ? (
                <ul className="space-y-2 mb-2 max-h-40 overflow-y-auto">
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold w-max"
              >
                Select Items
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition font-semibold text-lg"
            >
              Submit Booking
            </button>

            {message && (
              <p className="text-center text-gray-700 mt-2 text-sm">
                {message}
              </p>
            )}
          </form>

          {showPopup && <MenuPopup onClose={() => setShowPopup(false)} />}

          {/* Success Popup */}
          <AnimatePresence>
            {showSuccessPopup && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
              >
                <motion.div
                  className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <h2 className="text-xl font-bold mb-4 text-gray-800">
                    Booking Successful
                  </h2>
                  <p className="text-gray-700 mb-6">
                    Your booking has been successfully completed. Our team will
                    contact you shortly.
                  </p>
                  <button
                    onClick={closeSuccessPopup}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    OK
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default BookingForm;
