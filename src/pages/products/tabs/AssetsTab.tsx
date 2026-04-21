import React from "react";
import { Globe, UserCheck, Lock, User } from "lucide-react";
import { ProductData } from "../types";

interface AssetsTabProps {
  productData: ProductData;
}

const AssetsTab: React.FC<AssetsTabProps> = ({ productData }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {productData.assets.map((asset, index) => (
          <div
            key={index}
            className="border border-[#C4B89D] rounded-xl p-5 flex items-center gap-4 hover: transition-all bg-transparent cursor-pointer group"
            onClick={() =>
              asset.url !== "#" && window.open(asset.url, "_blank")
            }
          >
            <div className="p-3 bg-transparent rounded-xl text-[#2C2C2C]/60 group-hover:text-gray-700 transition-colors">
              {asset.icon}
            </div>
            <span className="text-xs font-semibold text-[#2C2C2C]/80 uppercase tracking-tight group-hover:text-gray-700 group-hover:underline transition-all">
              {asset.title}
            </span>
          </div>
        ))}
      </div>
      <div className="bg-transparent rounded-3xl border border-[#C4B89D]  overflow-hidden mt-10">
        <div className="bg-transparent p-8 border-b border-[#C4B89D] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-transparent rounded-2xl flex items-center justify-center ">
              <UserCheck className="w-7 h-7 text-[#C72030]" />
            </div>
            <h3 className="text-2xl font-semibold uppercase text-[#2C2C2C] tracking-tighter">
              Login Credentials
            </h3>
          </div>
          <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-full text-[9px] font-semibold uppercase">
            <Lock className="w-3 h-3" /> Secure Access
          </div>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4 bg-transparent/50">
          {productData.credentials.map((cred, index) => (
            <div
              key={index}
              className="bg-transparent p-6 rounded-2xl border border-[#C4B89D]  hover: transition-all"
            >
              <h4 className="text-xs font-semibold text-[#2C2C2C] uppercase tracking-widest mb-4 border-b pb-2">
                {cred.title}
              </h4>
              <div className="space-y-3">
                <div
                  className="flex items-center gap-3 text-[10px] font-semibold text-[#4B5563] hover:underline cursor-pointer"
                  onClick={() =>
                    cred.url !== "#" && window.open(cred.url, "_blank")
                  }
                >
                  <Globe className="w-3 h-3" /> {cred.url}
                </div>
                <div className="bg-transparent p-3 rounded-lg flex justify-between items-center text-[10px] font-semibold text-[#2C2C2C]/60 uppercase tracking-tighter">
                  <span>ID: {cred.id}</span>
                  <span>PASS: {cred.pass}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Owner Section */}
      <div className="mt-16 flex flex-col md:flex-row items-center gap-10 bg-white border border-[#D3D1C7] rounded-[3rem] p-10 text-gray-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-5">
          <User className="w-64 h-64 text-gray-300" />
        </div>
        <div className="w-48 h-56 rounded-3xl overflow-hidden border-4 border-[#D3D1C7] relative z-10 flex-shrink-0">
          <img
            src={productData.ownerImage}
            alt={productData.owner}
            className="w-full h-full object-cover grayscale transition-all duration-500"
          />
        </div>
        <div className="relative z-10 text-center md:text-left">
          <h3 className="text-5xl font-semibold font-poppins tracking-tighter uppercase mb-2">
            {productData.owner}
          </h3>
          <p className="text-gray-600 font-semibold font-poppins uppercase tracking-[0.2em] text-sm mb-6 underline decoration-wavy underline-offset-8">
            Product Champion
          </p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <span className="bg-white px-4 py-2 rounded-xl text-[10px] font-semibold uppercase border border-[#D3D1C7] tracking-widest font-poppins">
              Industry Expert
            </span>
            <span className="bg-white px-4 py-2 rounded-xl text-[10px] font-semibold uppercase border border-[#D3D1C7] tracking-widest font-poppins">
              Domain Specialist
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetsTab;
