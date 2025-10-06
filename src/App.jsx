import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import OfferingList from "./pages/OfferingList";
import Header from "./components/Header";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";

// Context providers
import { UserProvider } from "./context/UserContext";
import { BookingProvider } from "./context/BookingContext";
import FloatingBooking from "./components/FloatingBooking";
import { MenuProvider } from "./context/MenuContext";
import { GalleryProvider } from "./context/GalleryContext";
import AdminDashboard from "./pages/AdminDashboard";

function AppWrapper() {
  const location = useLocation();

  // Hide header and floating booking for specific routes
  const hideitem = ["/login", "/dashboard", "/admin/dashboard"].includes(
    location.pathname
  );

  const isAdminAuthenticated =
    localStorage.getItem("adminAuthenticated") === "true";

  return (
    <>
      {!hideitem && <Header />}
      {!hideitem && <FloatingBooking />}

      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/offerings" element={<OfferingList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<UserProfile />} />

        {/* ✅ Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            isAdminAuthenticated ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />

        {/* Catch-all (optional) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <UserProvider>
      <BookingProvider>
        <MenuProvider>
          <GalleryProvider>
            <BrowserRouter>
              <AppWrapper />
            </BrowserRouter>
          </GalleryProvider>
        </MenuProvider>
      </BookingProvider>
    </UserProvider>
  );
}

export default App;
