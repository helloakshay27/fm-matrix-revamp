import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { set } from "react-hook-form";
import { baseURL } from "../../../apiDomain";
import { useLocation } from "react-router-dom";
import { getCloudHomeRoute } from "../../utils/navigationUtils";

// Define login route to destination mappings
const LOGIN_DESTINATIONS = {
  '/cloud-projects-login': '/cloud-projects',
  '/cloud-minutes-login': '/cloud-minutes',
};

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine destination based on current login route using smart utility
  const getDestination = () => {
    return getCloudHomeRoute(location.pathname) || '/projects';
  };
  
  // Check if this is a cloud login
  const isCloudLogin = Object.keys(LOGIN_DESTINATIONS).includes(location.pathname);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.dismiss();
      toast.error("Email and password are required");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${baseURL}/users/signin.json`, {
        user: {
          email,
          password,
        },
      });
      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Store cloud preference if this is a cloud login
        if (isCloudLogin) {
          localStorage.setItem('useCloudRoutes', 'true');
        }
        
        toast.dismiss();
        toast.success("Login successful!");
        
        const destination = getDestination();
        setTimeout(() => navigate(destination), 500);
      }
    } catch (error) {
      const errMsg = error.response?.data?.error || "Login failed";
      setError(errMsg);
      toast.dismiss();
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-start w-screen h-screen">
      <div className="w-1/3 bg-[#E9E9E9]"></div>
      <div className="flex justify-center items-center w-2/3">
        <div className="flex flex-col justify-center align-center gap-8">
          <div className="flex justify-center items-center mb-8">
            <img src="LockatedLogo.png" alt="Logo" className="w-[170px]" />
          </div>
          <div className="font-[600] text-[22px]">
            Login to access Project Management
          </div>
          <div className="flex flex-col justify-start gap-2">
            <label className="font-[600] text-[16px]">User Name</label>
            <input
              type="email"
              className="w-[420px] h-[48px] bg-[#D9D9D957] p-2"
              placeholder="Enter user name or id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col justify-start gap-2 relative">
            <label className="font-[600] text-[16px]">Password</label>
            <input
              type={`${showPassword ? "" : "password"}`}
              className="w-[420px] h-[48px] bg-[#D9D9D957] p-2"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {showPassword ? (
              <EyeOff
                size={20}
                className="absolute right-4 top-14 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <Eye
                size={20}
                className="absolute right-4 top-14 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
          <div>
            {error && (
              <p className="text-red-500 align-center text-[12px]">{error}</p>
            )}
          </div>
          <button
            className={`w-[420px] h-[48px] bg-[#C72030] text-white text-[20px] font-[400] ${
              loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
            onClick={handleLogin}
            disabled={loading}
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
