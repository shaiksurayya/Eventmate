// import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
//   useLocation,
// } from "react-router-dom";
// import "./App.css";

// // Contexts
// import { AuthProvider, useAuth } from "./Context/AuthContext";
// import { OwnerAuthProvider, useOwnerAuth } from "./Context/OwnerAuthContext";

// // Common Components
// import Navbar from "./components/Navbar.jsx";
// import UserNavbar from "./components/UserNavbar.jsx";
// import OwnerNavbar from "./components/OwnerNavbar.jsx";
// import Footer from "./components/Footer.jsx";
// import AIAssistant from "./components/AIAssistant.jsx";

// // Authentication Components (User)
// import Login from "./Authentication/Login.jsx";
// import Signup from "./Authentication/Signup.jsx";
// import ForgotPass from "./Authentication/ForgotPass.jsx";
// import ResetPassOtp from "./Authentication/ResetPassOtp.jsx";
// import EmailOtp from "./Authentication/EmailOtp.jsx";

// // Authentication Components (Owner)
// import SignupOwner from "./Authentication/SignupOwner.jsx";
// import LoginOwner from "./Authentication/LoginOwner.jsx";
// import OwnerEmailOtp from "./Authentication/OwnerEmailOtp.jsx";

// // Pages
// import Hero from "./components/Hero.jsx";
// import TrendingVenues from "./components/TrendingVenues.jsx";
// import Categories from "./components/Categories.jsx";
// import Recommendations from "./components/Recommendations.jsx";
// import About from "./Pages/About.jsx";
// import Contact from "./Pages/Contact.jsx";
// import VenueDetails from "./Pages/VenueDetails.jsx";

// // Dashboard (User)
// import DashboardLayout from "./Pages/DashboardLayout.jsx";
// import FindHall from "./HallPages/FindHall.jsx";
// import CheckAvailabilityForm from "./HallBooking/CheckAvailabilityForm.jsx";
// import DateTimeRangeReactDatePicker from "./HallBooking/DateTimeRangeReactDatepicker.jsx";
// import HallBookingForm from "./HallBooking/HallBookingForm.jsx";
// import SuccessMsg from "./HallBooking/SuccessMsg.jsx";
// import BookingSuggestions from "./HallBooking/BookingSuggestions.jsx";
// import Bookings from "./Pages/Bookings.jsx";
// import Photographers from "./Pages/Photographers.jsx";
// import PhotographerDetails from "./Pages/PhotographerDetails.jsx";
// import Planners from "./Pages/Planners.jsx";
// import PlannerDetails from "./Pages/PlannerDetails.jsx";
// import Cakes from "./Pages/Cakes.jsx";
// import CakeDetails from "./Pages/CakeDetails.jsx";
// import Attire from "./Pages/Attire.jsx";
// import AttireDetails from "./Pages/AttireDetails.jsx";
// import Profilesettings from "./Pages/Profilesettings.jsx";
// import ViewHalls from "./Pages/ViewHalls.jsx";

// // Owner Dashboard
// import OwnerDashboardLayout from "./Pages/OwnerDashboard.jsx";
// import OwnerManageHalls from "./Pages/OwnerManageHalls.jsx";
// import OwnerBookings from "./Pages/OwnerBookings.jsx";
// import OwnerProfile from "./Pages/OwnerProfile.jsx";
// import ManageHallsInfo from "./Pages/ManageHallsInfo.jsx";
// import ContactEventmate from "./Pages/ContactEventmate.jsx";


// // Recommendation Pages
// import Modern from "./Pages/Modern.jsx";
// import Grand from "./Pages/Grand.jsx";
// import Elegant from "./Pages/Elegant.jsx";
// import Planning from "./Pages/Planning.jsx";

// // ✅ Private Routes
// const PrivateRoute = ({ children }) => {
//   const { isAuthenticated } = useAuth();
//   const location = useLocation();
//   return isAuthenticated ? (
//     children
//   ) : (
//     <Navigate to="/login" state={{ from: location }} replace />
//   );
// };

// const PrivateOwnerRoute = ({ children }) => {
//   const { isOwnerAuthenticated } = useOwnerAuth();
//   const location = useLocation();
//   return isOwnerAuthenticated ? (
//     children
//   ) : (
//     <Navigate to="/login-owner" state={{ from: location }} replace />
//   );
// };

// // ✅ Conditional Header & Footer
// const ConditionalHeader = () => {
//   const { isAuthenticated } = useAuth();
//   const { isOwnerAuthenticated } = useOwnerAuth();
//   if (isOwnerAuthenticated) return <OwnerNavbar />;
//   if (isAuthenticated) return <UserNavbar />;
//   return <Navbar />;
// };

// const ConditionalFooter = () => {
//   const location = useLocation();
//   const hideOnPages = [
//     "/forgot-password",
//     "/resetpassotp",
//     "/emailotp",
//     "/login",
//     "/signup",
//     "/login-owner",
//     "/signup-owner",
//     "/owner-email-otp",
//   ];
//   return hideOnPages.includes(location.pathname.toLowerCase()) ? null : (
//     <Footer />
//   );
// };

// // ✅ User Dashboard Routes (protected)
// const DashboardRoutes = () => (
//   <DashboardLayout>
//     <Routes>
//       <Route path="/bookings" element={<Bookings />} />
//       <Route path="/findhall" element={<FindHall />} />
//       <Route path="/halls" element={<ViewHalls />} />
//       <Route path="/checkavailabilityform" element={<CheckAvailabilityForm />} />
//       <Route path="/hallbookingform" element={<HallBookingForm />} />
//       <Route path="/booking-suggestions" element={<BookingSuggestions />} />
//       <Route path="/successmsg" element={<SuccessMsg />} />
//       <Route
//         path="/datetimerangereactdatepicker"
//         element={<DateTimeRangeReactDatePicker />}
//       />
//       <Route path="/photographers" element={<Photographers />} />
//       <Route path="/photographer/:id" element={<PhotographerDetails />} />
//       <Route path="/planners" element={<Planners />} />
//       <Route path="/planner/:id" element={<PlannerDetails />} />
//       <Route path="/cakes" element={<Cakes />} />
//       <Route path="/cakes/:id" element={<CakeDetails />} />
//       <Route path="/attire" element={<Attire />} />
//       <Route path="/attire/:id" element={<AttireDetails />} />
//       <Route path="/profilesettings" element={<Profilesettings />} />
//     </Routes>
//   </DashboardLayout>
// );

// // ✅ Owner Dashboard Routes (protected)
// const OwnerDashboardRoutes = () => (
//   <OwnerDashboardLayout>
//     <Routes>
//       <Route path="/owner/manage-halls" element={<OwnerManageHalls />} />
//       <Route path="/owner/manage-halls-info" element={<ManageHallsInfo />} />
//       <Route path="/owner/bookings" element={<OwnerBookings />} />
//       <Route path="/owner/contact-eventmate" element={<ContactEventmate />} />
//       <Route path="/owner/profile" element={<OwnerProfile />} />
//     </Routes>
//   </OwnerDashboardLayout>
// );

// // ✅ Main App Routes
// const AppRoutes = () => {
//   const { isAuthenticated } = useAuth();

//   return (
//     <div className="app-container">
//       <ConditionalHeader />
//       <main>
//         <Routes>
//           {/* Home Page */}
//           <Route
//             path="/"
//             element={
//               <>
//                 <Hero />
//                 <TrendingVenues />
//                 <Categories />
//                 <Recommendations />
//               </>
//             }
//           />

//           {/* Public Pages */}
//           <Route path="/recommendations" element={<Recommendations />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/contact" element={<Contact />} />
//           <Route path="/venue/:venueId" element={<VenueDetails />} />
//                     {/* ✅ Public Grand Halls Page */}


//           {/* ✅ Public Recommendation Pages */}
//           <Route path="/modern" element={<Modern />} />
//           <Route path="/grand" element={<Grand />} />
//           <Route path="/elegant" element={<Elegant />} />
//           <Route path="/planning" element={<Planning />} />

//           {/* User Auth */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/forgot-password" element={<ForgotPass />} />
//           <Route path="/resetpassotp" element={<ResetPassOtp />} />
//           <Route path="/emailotp" element={<EmailOtp />} />

//           {/* Owner Auth */}
//           <Route path="/login-owner" element={<LoginOwner />} />
//           <Route path="/signup-owner" element={<SignupOwner />} />
//           <Route path="/owner-email-otp" element={<OwnerEmailOtp />} />

//           {/* ✅ Dashboards */}
//           {isAuthenticated && (
//             <Route
//               path="/*"
//               element={
//                 <PrivateRoute>
//                   <DashboardRoutes />
//                 </PrivateRoute>
//               }
//             />
//           )}
//           <Route
//             path="/*"
//             element={
//               <PrivateOwnerRoute>
//                 <OwnerDashboardRoutes />
//               </PrivateOwnerRoute>
//             }
//           />
//         </Routes>
//       </main>
//       <ConditionalFooter />
//     </div>
//   );
// };

// // ✅ Final App
// function App() {
//   return (
//     <AuthProvider>
//       <OwnerAuthProvider>
//         <Router>
//           <AppRoutes />
//           <AIAssistant />
//         </Router>
//       </OwnerAuthProvider>
//     </AuthProvider>
//   );
// }

// export default App;




































import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./App.css";

// Contexts
import { AuthProvider, useAuth } from "./Context/AuthContext";
import { OwnerAuthProvider, useOwnerAuth } from "./Context/OwnerAuthContext";

// 🔥 Single Smart Navbar
import SmartNavbar from "./components/SmartNavbar.jsx";
import Footer from "./components/Footer.jsx";
import AIAssistant from "./components/AIAssistant.jsx";

// Authentication Components (User)
import Login from "./Authentication/Login.jsx";
import Signup from "./Authentication/Signup.jsx";
import ForgotPass from "./Authentication/ForgotPass.jsx";
import ResetPassOtp from "./Authentication/ResetPassOtp.jsx";
import EmailOtp from "./Authentication/EmailOtp.jsx";

// Authentication Components (Owner)
import SignupOwner from "./Authentication/SignupOwner.jsx";
import LoginOwner from "./Authentication/LoginOwner.jsx";
import OwnerEmailOtp from "./Authentication/OwnerEmailOtp.jsx";

// Pages
import Hero from "./components/Hero.jsx";
import TrendingVenues from "./components/TrendingVenues.jsx";
import Categories from "./components/Categories.jsx";
import Recommendations from "./components/Recommendations.jsx";
import About from "./Pages/About.jsx";
import Contact from "./Pages/Contact.jsx";
import VenueDetails from "./Pages/VenueDetails.jsx";

// Dashboard (User)
import DashboardLayout from "./Pages/DashboardLayout.jsx";
import FindHall from "./HallPages/FindHall.jsx";
import CheckAvailabilityForm from "./HallBooking/CheckAvailabilityForm.jsx";
import DateTimeRangeReactDatePicker from "./HallBooking/DateTimeRangeReactDatepicker.jsx";
import HallBookingForm from "./HallBooking/HallBookingForm.jsx";
import SuccessMsg from "./HallBooking/SuccessMsg.jsx";
import BookingSuggestions from "./HallBooking/BookingSuggestions.jsx";
import Bookings from "./Pages/Bookings.jsx";
import Photographers from "./Pages/Photographers.jsx";
import PhotographerDetails from "./Pages/PhotographerDetails.jsx";
import Planners from "./Pages/Planners.jsx";
import PlannerDetails from "./Pages/PlannerDetails.jsx";
import Cakes from "./Pages/Cakes.jsx";
import CakeDetails from "./Pages/CakeDetails.jsx";
import Attire from "./Pages/Attire.jsx";
import AttireDetails from "./Pages/AttireDetails.jsx";
import Profilesettings from "./Pages/Profilesettings.jsx";
import ViewHalls from "./Pages/ViewHalls.jsx";
import Home from "./Pages/UserHome.jsx";

// Owner Dashboard
import OwnerDashboardLayout from "./Pages/OwnerDashboard.jsx";
import OwnerManageHalls from "./Pages/OwnerManageHalls.jsx";
import OwnerBookings from "./Pages/OwnerBookings.jsx";
import OwnerProfile from "./Pages/OwnerProfile.jsx";
import ManageHallsInfo from "./Pages/ManageHallsInfo.jsx";
import ContactEventmate from "./Pages/ContactEventmate.jsx";

// Recommendation Pages
import Modern from "./Pages/Modern.jsx";
import Grand from "./Pages/Grand.jsx";
import Elegant from "./Pages/Elegant.jsx";
import Planning from "./Pages/Planning.jsx";


// 🔐 Private Routes
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

const PrivateOwnerRoute = ({ children }) => {
  const { isOwnerAuthenticated } = useOwnerAuth();
  const location = useLocation();
  return isOwnerAuthenticated ? (
    children
  ) : (
    <Navigate to="/login-owner" state={{ from: location }} replace />
  );
};


// ✅ Conditional Footer
const ConditionalFooter = () => {
  const location = useLocation();
  const hideOnPages = [
    "/forgot-password",
    "/resetpassotp",
    "/emailotp",
    "/login",
    "/signup",
    "/login-owner",
    "/signup-owner",
    "/owner-email-otp",
  ];

  return hideOnPages.includes(location.pathname.toLowerCase())
    ? null
    : <Footer />;
};


// 👤 User Dashboard Routes
const DashboardRoutes = () => (
  <DashboardLayout>
    <Routes>
      {/* ✅ Default landing page for dashboard */}
      <Route path="/" element={<Navigate to="/bookings" replace />} />

      <Route path="/home" element={<Home />} />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/findhall" element={<FindHall />} />
      <Route path="/halls" element={<ViewHalls />} />
      <Route path="/checkavailabilityform" element={<CheckAvailabilityForm />} />
      <Route path="/hallbookingform" element={<HallBookingForm />} />
      <Route path="/booking-suggestions" element={<BookingSuggestions />} />
      <Route path="/successmsg" element={<SuccessMsg />} />
      <Route path="/datetimerangereactdatepicker" element={<DateTimeRangeReactDatePicker />} />
      <Route path="/photographers" element={<Photographers />} />
      <Route path="/photographer/:id" element={<PhotographerDetails />} />
      <Route path="/planners" element={<Planners />} />
      <Route path="/planner/:id" element={<PlannerDetails />} />
      <Route path="/cakes" element={<Cakes />} />
      <Route path="/cakes/:id" element={<CakeDetails />} />
      <Route path="/attire" element={<Attire />} />
      <Route path="/attire/:id" element={<AttireDetails />} />
      <Route path="/profilesettings" element={<Profilesettings />} />
    </Routes>
  </DashboardLayout>
);

// 🏢 Owner Dashboard Routes
const OwnerDashboardRoutes = () => (
  <OwnerDashboardLayout>
    <Routes>
      <Route path="/owner/manage-halls" element={<OwnerManageHalls />} />
      <Route path="/owner/manage-halls-info" element={<ManageHallsInfo />} />
      <Route path="/owner/bookings" element={<OwnerBookings />} />
      <Route path="/owner/contact-eventmate" element={<ContactEventmate />} />
      <Route path="/owner/profile" element={<OwnerProfile />} />
    </Routes>
  </OwnerDashboardLayout>
);


// 🌍 Main App Routes
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-container">
      <SmartNavbar />

      <main>
        <Routes>

          {/* Home */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <TrendingVenues />
                <Categories />
                <Recommendations />
              </>
            }
          />

          {/* Public Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/venue/:venueId" element={<VenueDetails />} />
          <Route path="/modern" element={<Modern />} />
          <Route path="/grand" element={<Grand />} />
          <Route path="/elegant" element={<Elegant />} />
          <Route path="/planning" element={<Planning />} />

          {/* User Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route path="/resetpassotp" element={<ResetPassOtp />} />
          <Route path="/emailotp" element={<EmailOtp />} />

          {/* Owner Auth */}
          <Route path="/login-owner" element={<LoginOwner />} />
          <Route path="/signup-owner" element={<SignupOwner />} />
          <Route path="/owner-email-otp" element={<OwnerEmailOtp />} />

          {/* User Dashboard */}
          {isAuthenticated && (
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <DashboardRoutes />
                </PrivateRoute>
              }
            />
          )}

          {/* Owner Dashboard */}
          <Route
            path="/*"
            element={
              <PrivateOwnerRoute>
                <OwnerDashboardRoutes />
              </PrivateOwnerRoute>
            }
          />

        </Routes>
      </main>

      <ConditionalFooter />
    </div>
  );
};


// 🔥 Final App
function App() {
  return (
    <AuthProvider>
      <OwnerAuthProvider>
        <Router>
          <AppRoutes />
          <AIAssistant />
        </Router>
      </OwnerAuthProvider>
    </AuthProvider>
  );
}

export default App;
