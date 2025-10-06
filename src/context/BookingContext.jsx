import { createContext, useContext, useState, useEffect } from "react";
import AxiosInstance from "../lib/axios";
import UserContext from "./UserContext";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const { user, setUser } = useContext(UserContext);

  const [bookings, setBookings] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [serviceType, setServiceType] = useState("rent");
  const [event, setEvent] = useState("");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");

  // Fetch bookings only when user._id changes
  useEffect(() => {
    if (!user?._id) {
      setBookings([]);
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await AxiosInstance.get(`/user/profile/${user._id}`);
        const latestBookings = res.data.bookings || [];
        setBookings(latestBookings);

        // Update user only if bookings changed
        if (JSON.stringify(user.bookings) !== JSON.stringify(latestBookings)) {
          setUser((prev) => ({ ...prev, bookings: latestBookings }));
        }
      } catch (err) {
        console.error("Fetch bookings failed:", err.response?.data || err);
        setMessage("Failed to load bookings.");
      }
    };

    fetchBookings();
  }, [user?._id]);

  const addBooking = async (bookingData) => {
    if (!user?._id) {
      setMessage("You must be logged in to add a booking.");
      return;
    }
    try {
      const res = await AxiosInstance.post(
        `/user/profile/${user._id}/bookings`,
        bookingData
      );
      const updatedBookings = res.data.bookings || [];
      setBookings(updatedBookings);
      setUser((prev) => ({ ...prev, bookings: updatedBookings }));
      setMessage("Booking successfully added!");
    } catch (err) {
      console.error("Add booking failed:", err.response?.data || err);
      setMessage(
        err.response?.data?.message || "Booking failed. Please try again."
      );
    }
  };

  const submitBooking = () => {
    if (!event || !place || !date || !guests) {
      setMessage("Please fill all required fields.");
      return;
    }

    const bookingData = {
      event,
      place,
      date,
      guests,
      serviceType,
      selectedItems,
    };

    addBooking(bookingData);

    // Reset form after submission
    setEvent("");
    setPlace("");
    setDate("");
    setGuests(1);
    setServiceType("rent");
    setSelectedItems([]);
  };

  const toggleSelectItem = (item) => {
    setSelectedItems((prev) =>
      prev.some((i) => i._id === item._id)
        ? prev.filter((i) => i._id !== item._id)
        : [...prev, item]
    );
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
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
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;
