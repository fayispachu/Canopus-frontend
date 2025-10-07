import { Routes, Route, Navigate, HashRouter } from "react-router-dom";
import Home from "./pages/Home";
import OfferingList from "./pages/OfferingList";
import Header from "./components/Header";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function AppWrapper() {
  // No useLocation needed for HashRouter, optional
  return (

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
  );
}

export default AppWrapper;
