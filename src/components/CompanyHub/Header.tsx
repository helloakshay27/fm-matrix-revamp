import React from "react";
import { Sun } from "lucide-react";
import { getGreeting } from "./utils";

interface HeaderProps {
  displayName: string;
}

const Header: React.FC<HeaderProps> = ({ displayName }) => {
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-3">
        <Sun className="w-6 h-6 text-yellow-500" strokeWidth={2.5} />
        <h1 className="text-2xl font-black text-[#1f1f1f] tracking-tight">
          {getGreeting()}, {displayName}.
        </h1>
      </div>
      <p className="max-w-[50%] text-right text-[14px] text-gray-400 italic font-medium leading-relaxed">
        "Success is not final, failure is not fatal: it is the courage to
        continue that counts."
      </p>
    </div>
  );
};

export default Header;
