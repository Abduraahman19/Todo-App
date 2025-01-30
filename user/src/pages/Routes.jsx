import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Signup from "../../src/pages/auth/Signup";
import SignIn from "../pages/auth/Signin";
import DashboardLayoutBasic from "../../src/pages/main/DashBoard";


const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<SignIn />} />
                <Route path="/dashboard" element={<DashboardLayoutBasic />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
