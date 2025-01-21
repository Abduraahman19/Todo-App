import React from "react";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import Signup from "../../src/pages/auth/Signup";
import SignIn from "../pages/auth/Signin";
import DashboardLayoutBasic from "./main/Home";
import PersonalPage from "../../src/pages/main/PersonalPage"; // Import PersonalPage component

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<SignIn />} />
                <Route path="/home" element={<DashboardLayoutBasic />} />
                <Route path="/personal" element={<PersonalPage />} /> {/* Added route for PersonalPage */}
                {/* Add more routes here */}
            </Routes>
        </Router>
    );
};

export default AppRoutes;
