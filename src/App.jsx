// App.jsx
import { UserProvider } from "./context/UserContext";
import { BookingProvider } from "./context/BookingContext";
import { AttendanceProvider } from "./context/AttendanceContext";
import { WorkProvider } from "./context/WorkContext";
import { MenuProvider } from "./context/MenuContext";
import { GalleryProvider } from "./context/GalleryContext";
import AppWrapper from "./AppWrapper";

function App() {
  return (
    <UserProvider>
      <BookingProvider>
        <AttendanceProvider>
          <WorkProvider>
            <MenuProvider>
              <GalleryProvider>
                <AppWrapper />
              </GalleryProvider>
            </MenuProvider>
          </WorkProvider>
        </AttendanceProvider>
      </BookingProvider>
    </UserProvider>
  );
}

export default App;
