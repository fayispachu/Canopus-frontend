import { createContext, useState, useEffect } from "react";
import AxiosInstance from "../lib/axios";

const WorkContext = createContext();

export const WorkProvider = ({ children }) => {
  const [works, setWorks] = useState([]);
  const [message, setMessage] = useState("");

  const fetchWorks = async () => {
    try {
      const res = await AxiosInstance.get("/works");
      setWorks(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch works.");
    }
  };

  const addWork = async (workData) => {
    try {
      const res = await AxiosInstance.post("/works", workData);
      setWorks((prev) => [...prev, res.data]);
      setMessage("Work added successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Add work failed.");
    }
  };

  const updateWork = async (workId, updatedData) => {
    try {
      const res = await AxiosInstance.put(`/works/${workId}`, updatedData);
      setWorks((prev) => prev.map((w) => (w._id === workId ? res.data : w)));
      setMessage("Work updated successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Update work failed.");
    }
  };

  const deleteWork = async (workId) => {
    try {
      await AxiosInstance.delete(`/works/${workId}`);
      setWorks((prev) => prev.filter((w) => w._id !== workId));
      setMessage("Work deleted successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Delete work failed.");
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  return (
    <WorkContext.Provider
      value={{ works, message, addWork, updateWork, deleteWork, setMessage }}
    >
      {children}
    </WorkContext.Provider>
  );
};

export default WorkContext;
