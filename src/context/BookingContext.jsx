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
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  // Fetch bookings
  const fetchBookings = async (userParam = user) => {
    if (!userParam?._id) return;
    try {
      const res =
        userParam.role === "admin" || userParam.role === "manager"
          ? await AxiosInstance.get("/booking")
          : await AxiosInstance.get(`/booking/user/${userParam._id}`);
      setBookings(res.data);
      // Sync with user context
      if (
        userParam._id &&
        JSON.stringify(user.bookings) !== JSON.stringify(res.data)
      ) {
        setUser((prev) => ({ ...prev, bookings: res.data }));
      }
    } catch (err) {
      console.error("Failed to fetch bookings:", err.response?.data || err);
    }
  };

  // Add booking
  const addBooking = async (bookingData) => {
    if (!user?._id) {
      setMessage("You must be logged in to add a booking.");
      return;
    }
    try {
      await AxiosInstance.post("/booking", {
        customerId: user._id,
        ...bookingData,
      });
      await fetchBookings();
      setMessage("Booking successfully added!");
    } catch (err) {
      console.error("Add booking failed:", err.response?.data || err);
      setMessage(err.response?.data?.message || "Booking failed. Try again.");
    }
  };

  const submitBooking = () => {
    if (!event || !place || !date || !guests || !phone) {
      setMessage("Please fill all required fields including phone number.");
      return;
    }

    const bookingData = {
      event,
      place,
      date,
      guests,
      phone,
      serviceType,
      items: selectedItems.map((i) => ({ name: i.name, desc: i.desc })),
    };
    addBooking(bookingData);

    // Reset form
    setEvent("");
    setPlace("");
    setDate("");
    setGuests(1);
    setPhone("");
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

  // User cancel request
  const handleCancelRequest = async (bookingId) => {
    try {
      const res = await AxiosInstance.patch(
        `/booking/cancel-request/${bookingId}`
      );
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, cancelRequest: true } : b
        )
      );
      alert("Cancel request sent. Admin approval required.");
      console.log(res.data, "cancel request response");
    } catch (err) {
      console.error("Cancel request failed:", err.response?.data || err);
      alert("Failed to send cancel request.");
    }
  };

  // Admin approve/reject cancel
  const handleCancelConfirm = async (bookingId, approve = true) => {
    try {
      const res = await AxiosInstance.put(`/booking/cancel/${bookingId}`, {
        approve,
      });
      // Update booking in local state
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? res.data.booking : b))
      );
      alert(res.data.message);
    } catch (err) {
      console.error("Cancel approval failed:", err.response?.data || err);
      alert("Failed to process cancel approval.");
    }
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        fetchBookings,
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
        phone,
        setPhone,
        submitBooking,
        message,
        setMessage,
        handleCancelRequest,
        handleCancelConfirm,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;
