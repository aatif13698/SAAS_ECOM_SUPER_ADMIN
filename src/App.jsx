import React, { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

const Login = lazy(() => import("./pages/auth/login"));
const Profile = lazy(() => import("./pages/profile/profile"));
const ViewProfile = lazy(() => import("./pages/profile/viewProfile"));
const OtpVerify = lazy(() => import("./pages/auth/OtpVerify"));

const Vendors = lazy(() => import("./pages/vendor/Vendor"))
const CreateVendor = lazy(() => import("./pages/vendor/CreateVendor"));
const Category = lazy(() => import("./pages/category/Category"));
const SubCategory = lazy(() => import("./pages/subcategory/SubCategory"));
const Request = lazy(() => import("./pages/request/Request"));
const CreateDemoRequest = lazy(() => import("./pages/request/CreateDemoRequest"))



import ProtectedRoutes from "./routes/ProtectedRoutes";
import PublicRoutes from "./routes/PublicRoutes";

import Layout from "./layout/Layout";
import AuthLayout from "./layout/AuthLayout";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";








import ForgotPassword from "./Common/forgotPassword/ForgotPassword";
import ResetPassword from "./Common/resetPassword/ResetPassword";
import Error from "./pages/404";
import BusinessUnit from "./components/BusinessUnit/BusinessUnit";



function App() {
  let isLoggedIn = false;
  const [refresh, setRefresh] = useState(0);
  const { user: currentUser, isAuth: auth } = useSelector(
    (state) => state.auth
  );

  if (
    currentUser &&
    auth &&
    (currentUser.roleId === 1 || currentUser.roleId === 2)
  ) {
    isLoggedIn = true;
  }
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // hadling token expiry
  const tokenExpiryTime = 3600000; // 1 hour in milliseconds

  // Function to check if token has expired
  const isTokenExpired = () => {
    const tokenExpiryTimestamp = localStorage.getItem("expiryTime");

    const currentTime = new Date().getTime();
    return currentTime > parseInt(tokenExpiryTimestamp, 10);
  };

  // Function to clear local storage when token expires
  const clearLocalStorageIfTokenExpired = () => {
    if (isTokenExpired()) {
      alert("Your session has been Expired Please Login Again");
      localStorage.clear(); // Clear all local storage
      window.location.reload();
      navigate("/");
    }
  };

  // Effect to run the expiry check periodically
  useEffect(() => {
    const intervalId = setInterval(clearLocalStorageIfTokenExpired, 60000); // Check every minute (adjust as needed)
    return () => clearInterval(intervalId); // Clean up the interval when component unmounts
  }, []); // Run only once on component mount

  return (
    <>



      <main className="App  relative">

        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route element={<ProtectedRoutes isLoggedIn={isLoggedIn} />}>
              <Route path="/" element={<Layout />}>
                <Route
                  path="*"
                  element={<Error roleId={currentUser?.roleId} />}
                />


                {/* ---- Profile Routes ----- */}
                <Route path="profile" element={<Profile />} />
                <Route path="viewProfile" element={<ViewProfile />} />
                <Route path="business-unit" element={<BusinessUnit />} />
                <Route path="vendors-list" element={<Vendors roleId={currentUser?.roleId} />} />
                <Route path="create-vendor" element={<CreateVendor roleId={currentUser?.roleId} />} />
                <Route path="category" element={<Category />} />
                <Route path="subcategory" element={<SubCategory />} />
                <Route path="request" element={<Request />} />
                <Route path="create/request" element={<CreateDemoRequest />} />
                <Route path="view/request" element={<CreateDemoRequest />} />

              </Route>
            </Route>

            <Route element={<PublicRoutes isLoggedIn={isLoggedIn} />}>
              <Route path="/signIn" element={<Login />} />
              <Route path="/otp" element={<OtpVerify />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              {/* forgot-password */}
            </Route>
          </Route>
        </Routes>
      </main></>
  );
}

export default App;
