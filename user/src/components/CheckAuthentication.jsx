import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CheckAuthentication = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Token exists, check for expiration (if any expiration logic)
      const isTokenExpired = checkTokenExpiration(token); // Function to check token expiry
      if (isTokenExpired) {
        localStorage.removeItem("token"); // Clear expired token
        navigate("/signin"); // Redirect to sign-in page if token expired
      } else {
        navigate("/dashboard"); // Redirect to the dashboard page if token is valid
      }
    } else {
      navigate("/signin"); // If no token exists, navigate to sign-in page
    }
  }, [navigate]);

  return null; // No UI element needs to be rendered for this check
};

// Function to check if token is expired (adjust based on your token structure)
const checkTokenExpiration = (token) => {
  const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode the token (assuming JWT)
  const currentTime = Date.now() / 1000; // Get current time in seconds
  return decodedToken.exp < currentTime; // Check if token expired
};

export default CheckAuthentication;
