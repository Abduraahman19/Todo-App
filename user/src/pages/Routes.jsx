import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "../../src/pages/auth/Signup";
import SignIn from "../pages/auth/Signin";
import DashboardLayoutBasic from "../../src/pages/main/DashBoard";
import CheckAuthentication from '../components/CheckAuthentication'; // Authentication check component

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Redirecting root route to Dashboard if authenticated */}
        <Route path="/" element={<CheckAuthentication />} /> {/* This checks authentication */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<DashboardLayoutBasic />} /> {/* Dashboard route */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
