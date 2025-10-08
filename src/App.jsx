import { BrowserRouter, useLocation } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { BookingProvider } from "./context/BookingContext";
import { AttendanceProvider } from "./context/AttendanceContext";
import { WorkProvider } from "./context/WorkContext";
import { MenuProvider } from "./context/MenuContext";
import { GalleryProvider } from "./context/GalleryContext";

import AppWrapper from "./AppWrapper";
import Header from "./components/Header";

function AppContent() {
  const location = useLocation();

  // Pages where Header should be hidden
  const noHeaderRoutes = ["/login", "/dashboard"];

  const hideHeader = noHeaderRoutes.includes(location.pathname);

  return (
    <>
      {!hideHeader && <Header />}
      <AppWrapper />
    </>
  );
}

function App() {
  return (
    <UserProvider>
      <BookingProvider>
        <AttendanceProvider>
          <WorkProvider>
            <MenuProvider>
              <GalleryProvider>
                <BrowserRouter basename="/">
                  <AppContent />
                </BrowserRouter>
              </GalleryProvider>
            </MenuProvider>
          </WorkProvider>
        </AttendanceProvider>
      </BookingProvider>
    </UserProvider>
  );
}

export default App;
