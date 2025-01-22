import React, { useState } from "react";
import axios from "axios"; // Ensure axios is installed
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { AiFillTwitterCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import VR from "../../../public/Icon/vr.jpg";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const [email, setEmail] = useState(""); // Email state
  const [password, setPassword] = useState(""); // Password state
  const [passwordVisible, setPasswordVisible] = useState(false); // Password visibility
  const [error, setError] = useState(""); // Error message
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Handle form submission
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/signin", { email, password });
      alert("Sign-In Successful");
      console.log(response.data);
      if (response.status === 200) {
            navigate("/dashboard");
    }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen md:px-40 sm:px-20 px-10 flex justify-center items-center bg-gradient-to-r from-[#080357] to-[#0A2FB9]">
      <div className="w-full max-w-[1280px] h-auto lg:h-[620px] bg-white rounded-2xl shadow-lg flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 md:px-[60px] px-[30px] md:py-[69px] py-[39px] flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl text-center font-extrabold text-blue-900 mb-6 md:mb-8">Sign In</h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSignIn}>
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-[#15186D99]">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border-b-2 text-[#0b2f8a] font-medium border-[#15186D99] outline-none py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update email state
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-[#15186D99]">Password</label>
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full border-b-2 text-[#0b2f8a] font-medium border-[#15186D99] outline-none py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update password state
              />
              {/* Eye Icon */}
              <span
                onClick={togglePasswordVisibility}
                className="absolute top-2/4 transform -translate-y-2/4 right-2 cursor-pointer text-xl mt-4"
              >
                {passwordVisible ? (
                  <FaEyeSlash className="w-6 h-6 text-gray-600" />
                ) : (
                  <FaEye className="w-6 h-6 text-gray-600" />
                )}
              </span>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Submit Button */}
            <div className="flex justify-center w-full">
              <button
                type="submit"
                className="w-[220px] h-[45px] bg-blue-900 text-white py-2 rounded-[16px] hover:bg-blue-700 transition-all"
                disabled={loading} // Disable button during loading
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center my-4">
            <span className="border-t border-gray-300 flex-grow"></span>
            <span className="text-sm text-gray-500 mx-4">Or sign in with</span>
            <span className="border-t border-gray-300 flex-grow"></span>
          </div>

          {/* Social Icons */}
          <div className="flex gap-8 text-3xl justify-center">
            <FcGoogle className="cursor-pointer rounded-full shadow-stone-600 shadow-lg" />
            <FaFacebook className="text-[#1877f2] cursor-pointer rounded-full shadow-stone-600 shadow-lg" />
            <AiFillTwitterCircle className="text-[#1da1f2] cursor-pointer rounded-full shadow-stone-600 shadow-lg" />
          </div>

          {/* Sign Up Link */}
          <p className="mt-6 text-sm text-gray-500 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        {/* Right Side - Image */}
        <div className="bg-gradient-to-l sm:w-1/2 from-[#0A2FB9] to-[#080357] items-center justify-center hidden lg:block">
          <img
            src={VR}
            alt="VR User"
            className="w-full h-full rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default SignIn;
