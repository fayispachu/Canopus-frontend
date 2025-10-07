import { useLocation, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import OfferingList from "./pages/OfferingList";
import Header from "./components/Header";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import Dashboard from "./pages/Dashboard";
import FloatingBooking from "./components/FloatingBooking";

import ProtectedRoute from "./components/ProtectedRoute";

function AppWrapper() {
  const location = useLocation();

  // Hide header and floating booking for these routes
  const hideitem = ["/login", "/dashboard"].includes(location.pathname);

  return (
    <>
      {!hideitem && <Header />}
      {!hideitem && <FloatingBooking />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/offerings" element={<OfferingList />} />
        <Route path="/login" element={<Login />} />

        {/* Protected User Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
      </Routes>
    </>
  );
}

export default AppWrapper;
