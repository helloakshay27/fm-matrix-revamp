import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Bell, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUser, clearAuth } from "../utils/auth";

export const EmployeeDynamicHeader: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCompany } = useSelector((state: RootState) => state.project);
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="fixed top-16 left-64 right-0 h-12 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-30 transition-all duration-300">
      {/* Left Section - Company Info */}
    </div>
  );
};
