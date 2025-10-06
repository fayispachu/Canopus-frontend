import React, { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import BookingForm from "./BookingForm"; // import your booking form

function FloatingBooking() {
  const { bookings } = useContext(UserContext);
  const [animateIcon, setAnimateIcon] = useState(false);
  const [showBookingPopup, setShowBookingPopup] = useState(false); // new state
  const navigate = useNavigate();

  useEffect(() => {
    setAnimateIcon(true);
    const timeout = setTimeout(() => setAnimateIcon(false), 300);
    return () => clearTimeout(timeout);
  }, [bookings]);

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="fixed bottom-10 right-6 z-50"
        >
          <motion.div
            onClick={() => setShowBookingPopup(true)} // open popup
            animate={animateIcon ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative cursor-pointer bg-green-500 p-4 rounded-full shadow-lg hover:bg-green-600"
          >
            <FaCalendarAlt className="text-white w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-green-700 font-bold w-5 h-5 text-xs flex items-center justify-center rounded-full">
              {bookings?.length}
            </span>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Booking Popup */}
      {showBookingPopup && (
        <BookingForm onClose={() => setShowBookingPopup(false)} />
      )}
    </>
  );
}

export default FloatingBooking;
