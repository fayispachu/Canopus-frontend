import { createContext, useState, useEffect } from "react";
import AxiosInstance from "../lib/axios";

const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [message, setMessage] = useState("");

  const fetchAttendance = async () => {
    try {
      const res = await AxiosInstance.get("/attendance");
      setAttendanceRecords(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch attendance.");
    }
  };

  const markAttendance = async (userId, data) => {
    try {
      const res = await AxiosInstance.post(`/attendance/${userId}`, data);
      setAttendanceRecords((prev) => [...prev, res.data]);
      setMessage("Attendance marked successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Mark attendance failed.");
    }
  };

  const updateAttendance = async (recordId, updatedData) => {
    try {
      const res = await AxiosInstance.put(
        `/attendance/${recordId}`,
        updatedData
      );
      setAttendanceRecords((prev) =>
        prev.map((r) => (r._id === recordId ? res.data : r))
      );
      setMessage("Attendance updated successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Update attendance failed.");
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <AttendanceContext.Provider
      value={{
        attendanceRecords,
        message,
        markAttendance,
        updateAttendance,
        setMessage,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export default AttendanceContext;
