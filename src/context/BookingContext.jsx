import { createContext, useContext, useState, useEffect, useCallback } from "react";
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

  const fetchBookings = useCallback(async (userParam = user) => {
    if (!userParam?._id) return;
    try {
      const res =
        userParam.role === "admin" || userParam.role === "manager"
          ? await AxiosInstance.get("/booking")
          : await AxiosInstance.get(`/booking/user/${userParam._id}`);

      const data = Array.isArray(res.data.bookings) ? res.data.bookings : [];
      setBookings(data);

      if (userParam._id && JSON.stringify(user.bookings) !== JSON.stringify(data)) {
        setUser((prev) => ({ ...prev, bookings: data }));
      }
    } catch (err) {
      console.error("Failed to fetch bookings:", err.response?.data || err);
    }
  }, [user, setUser]);

  const addBooking = async (bookingData) => {
    if (!user?._id) return setMessage("You must be logged in to add a booking.");
    try {
      await AxiosInstance.post("/booking", { customerId: user._id, ...bookingData });
      await fetchBookings();
      setMessage("Booking successfully added!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Booking failed. Try again.");
    }
  };

  const submitBooking = () => {
    if (!event || !place || !date || !guests || !phone) {
      return setMessage("Please fill all required fields including phone number.");
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

    setEvent(""); setPlace(""); setDate(""); setGuests(1); setPhone("");
    setServiceType("rent"); setSelectedItems([]);
  };

  const toggleSelectItem = (item) => {
    setSelectedItems((prev) =>
      prev.some((i) => i._id === item._id)
        ? prev.filter((i) => i._id !== item._id)
        : [...prev, item]
    );
  };

  const handleCancelRequest = async (bookingId) => {
    try {
      await AxiosInstance.patch(`/booking/cancel-request/${bookingId}`);
      setBookings((prev) => prev.map((b) => (b._id === bookingId ? { ...b, cancelRequest: true } : b)));
      alert("Cancel request sent. Admin approval required.");
    } catch {
      alert("Failed to send cancel request.");
    }
  };

  const handleCancelConfirm = async (bookingId, approve = true) => {
    try {
      const res = await AxiosInstance.put(`/booking/cancel/${bookingId}`, { approve });
      setBookings((prev) => prev.map((b) => (b._id === bookingId ? res.data.booking : b)));
      alert(res.data.message);
    } catch {
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
