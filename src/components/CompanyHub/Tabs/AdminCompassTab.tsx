import React from "react";
import GlassCard from "../GlassCard";
import { Settings, Shield, HardDrive, Bell } from "lucide-react";

const AdminCompassTab: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <Settings className="w-8 h-8 text-blue-500" />
        <h2 className="text-2xl font-black text-gray-800">Admin Compass</h2>
      </div>
    </div>
  );
};

export default AdminCompassTab;
