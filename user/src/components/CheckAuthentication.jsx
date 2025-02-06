import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CheckAuthentication = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const isTokenExpired = checkTokenExpiration(token);
      if (isTokenExpired) {
        localStorage.removeItem("token");
        navigate("/signin"); 
      } else {
        navigate("/dashboard");
      }
    } else {
      navigate("/signin");
    }
  }, [navigate]);

  return null;
};

const checkTokenExpiration = (token) => {
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const currentTime = Date.now() / 1000; 
  return decodedToken.exp < currentTime; 
};

export default CheckAuthentication;
