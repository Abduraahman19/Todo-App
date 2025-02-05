import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import VR from "../../../public/Icon/vr.jpg";
import { useNavigate } from "react-router-dom";
import MoonLoader from 'react-spinners/MoonLoader';

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/signin", { email, password });
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.response?.data?.message === "Invalid credentials") {
        setError("Incorrect Password");
      } else {
        setError(err.response?.data?.message || "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen md:px-40 sm:px-20 px-10 flex justify-center items-center bg-gradient-to-r from-[#080357] to-[#0A2FB9]">
      <div className="w-full max-w-[1280px] h-auto lg:h-[620px] bg-white rounded-2xl shadow-lg flex flex-col lg:flex-row overflow-hidden">
        <div className="w-full lg:w-1/2 md:px-[60px] px-[30px] md:py-[69px] py-[39px] flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl text-center font-extrabold text-blue-900 mb-6 md:mb-8">Sign In</h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSignIn}>
            <div>
              <label className="block text-sm font-medium text-[#15186D99]">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border-b-2 text-[#0b2f8a] font-medium border-[#15186D99] outline-none py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-[#15186D99]">Password</label>
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full border-b-2 text-[#0b2f8a] font-medium border-[#15186D99] outline-none py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
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

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-center w-full">
              <button
                type="submit"
                className="w-[220px] h-[45px] bg-blue-900 text-white py-2 rounded-[16px] hover:bg-blue-700 transition-all"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <MoonLoader color="white" size={20} />
                    <span className="ml-2">Signing In...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>

          <div className="flex items-center my-4">
            <span className="border-t border-gray-300 flex-grow"></span>
            <span className="text-sm text-gray-500 mx-4">Or sign in with</span>
            <span className="border-t border-gray-300 flex-grow"></span>
          </div>

          <div className="flex gap-8 text-3xl justify-center">
            <FcGoogle className="cursor-pointer rounded-full shadow-stone-600 shadow-lg" />
            <FaFacebook className="text-[#1877f2] cursor-pointer rounded-full shadow-stone-600 shadow-lg" />
            <FaSquareXTwitter className="text-black cursor-pointer shadow-stone-600 shadow-lg" />
          </div>

          <p className="mt-6 text-sm text-gray-500 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>

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
