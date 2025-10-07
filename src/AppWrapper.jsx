// AppWrapper.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import OfferingList from "./pages/OfferingList";
import Header from "./components/Header";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import Dashboard from "./pages/Dashboard";
import FloatingBooking from "./components/FloatingBooking";
import ProtectedRoute from "./components/ProtectedRoute";

function AppWrapper() {
  return (
    <>
      <Header />
      <FloatingBooking />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/offerings" element={<OfferingList />} />
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default AppWrapper;
