import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  Mail,
  MessageSquare,
  Phone,
  Moon,
  Circle,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Employee {
  id: string;
  name: string;
  role: string;
  location: string;
  status: "Active" | "Inactive" | "Away";
  reportsTo: string;
  team: string;
  email: string;
  skills: string;
  image: string;
}

const employees: Employee[] = [
  {
    id: "1",
    name: "Chetan Bafna",
    role: "CEO",
    location: "Mumbai, India",
    status: "Away",
    reportsTo: "Chetan Bafna",
    team: "Design Team",
    email: "Chetan.bafna@lockated.com",
    skills: "Team Management, Figma, Soft spoken",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "2",
    name: "Chetan Bafna",
    role: "CEO",
    location: "Mumbai, India",
    status: "Away",
    reportsTo: "Chetan Bafna",
    team: "Design Team",
    email: "Chetan.bafna@lockated.com",
    skills: "Team Management, Figma, Soft spoken",
    image: "https://randomuser.me/api/portraits/men/85.jpg",
  },
  {
    id: "3",
    name: "Chetan Bafna",
    role: "CEO",
    location: "Mumbai, India",
    status: "Active",
    reportsTo: "Chetan Bafna",
    team: "Design Team",
    email: "Chetan.bafna@lockated.com",
    skills: "Team Management, Figma, Soft spoken",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "4",
    name: "Chetan Bafna",
    role: "CEO",
    location: "Mumbai, India",
    status: "Inactive",
    reportsTo: "Chetan Bafna",
    team: "Design Team",
    email: "Chetan.bafna@lockated.com",
    skills: "Team Management, Figma, Soft spoken",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    id: "5",
    name: "Chetan Bafna",
    role: "CEO",
    location: "Mumbai, India",
    status: "Away",
    reportsTo: "Chetan Bafna",
    team: "Design Team",
    email: "Chetan.bafna@lockated.com",
    skills: "Team Management, Figma, Soft spoken",
    image: "https://randomuser.me/api/portraits/women/67.jpg",
  },
  {
    id: "6",
    name: "Chetan Bafna",
    role: "CEO",
    location: "Mumbai, India",
    status: "Away",
    reportsTo: "Chetan Bafna",
    team: "Design Team",
    email: "Chetan.bafna@lockated.com",
    skills: "Team Management, Figma, Soft spoken",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: "7",
    name: "Chetan Bafna",
    role: "CEO",
    location: "Mumbai, India",
    status: "Active",
    reportsTo: "Chetan Bafna",
    team: "Design Team",
    email: "Chetan.bafna@lockated.com",
    skills: "Team Management, Figma, Soft spoken",
    image: "https://randomuser.me/api/portraits/men/15.jpg",
  },
  {
    id: "8",
    name: "Chetan Bafna",
    role: "CEO",
    location: "Mumbai, India",
    status: "Inactive",
    reportsTo: "Chetan Bafna",
    team: "Design Team",
    email: "Chetan.bafna@lockated.com",
    skills: "Team Management, Figma, Soft spoken",
    image: "https://randomuser.me/api/portraits/women/89.jpg",
  },
];

const Directory: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Dropdown States
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 lg:p-10 font-sans">
      {/* Header */}
      <div className="relative mb-8">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 top-0 flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="text-center w-full max-w-5xl mx-auto pt-2">
          <h1 className="text-xl font-bold text-gray-900 mb-4">
            Employee Directory
          </h1>
          <p className="text-xs text-gray-500 leading-relaxed max-w-3xl mx-auto text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search with Name, department"
            className="w-full h-12 pl-11 pr-4 rounded-full bg-[#E5E5E5]/50 border-none focus:ring-1 focus:ring-gray-300 text-sm text-gray-700 placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-[76rem] mx-auto mb-8">
        <div className="flex flex-wrap items-center gap-4">
          {/* Department Dropdown */}
          <div className="w-64 relative">
            <label className="absolute -top-2 left-3 px-1 bg-[#FDFBF7] text-[10px] font-medium text-gray-500 z-10">
              Department Name
            </label>
            <div
              className="w-full h-11 border border-gray-300 rounded-[4px] px-3 flex items-center justify-between cursor-pointer bg-transparent"
              onClick={() => setIsDepartmentOpen(!isDepartmentOpen)}
            >
              <span
                className={
                  selectedDepartment
                    ? "text-gray-900 text-xs"
                    : "text-gray-400 text-xs"
                }
              >
                {selectedDepartment || "Select Department"}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </div>
            {isDepartmentOpen && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-sm shadow-lg z-50">
                {[
                  "Design Team",
                  "Technical Team",
                  "Accounts Team",
                  "QA Team",
                ].map((option) => (
                  <div
                    key={option}
                    className="px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                    onClick={() => {
                      setSelectedDepartment(option);
                      setIsDepartmentOpen(false);
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="w-64 relative">
            <label className="absolute -top-2 left-3 px-1 bg-[#FDFBF7] text-[10px] font-medium text-gray-500 z-10">
              Status
            </label>
            <div
              className="w-full h-11 border border-gray-300 rounded-[4px] px-3 flex items-center justify-between cursor-pointer bg-transparent"
              onClick={() => setIsStatusOpen(!isStatusOpen)}
            >
              <span
                className={
                  selectedStatus
                    ? "text-gray-900 text-xs flex items-center gap-2"
                    : "text-gray-400 text-xs"
                }
              >
                {selectedStatus ? (
                  <>
                    {selectedStatus === "Active" && (
                      <Circle className="w-2 h-2 text-green-500 fill-green-500" />
                    )}
                    {selectedStatus === "Inactive" && (
                      <Circle className="w-2 h-2 text-red-500 fill-red-500" />
                    )}
                    {selectedStatus === "Away" && (
                      <Moon className="w-2.5 h-2.5 text-amber-400 fill-amber-400 transform -rotate-12" />
                    )}
                    {selectedStatus}
                  </>
                ) : (
                  "Select Employer Status"
                )}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </div>
            {isStatusOpen && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-sm shadow-lg z-50">
                {[
                  { label: "Active", type: "active" },
                  { label: "Inactive", type: "inactive" },
                  { label: "Away", type: "away" },
                ].map((option) => (
                  <div
                    key={option.label}
                    className="px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 flex items-center gap-2"
                    onClick={() => {
                      setSelectedStatus(option.label);
                      setIsStatusOpen(false);
                    }}
                  >
                    {option.type === "active" && (
                      <Circle className="w-2 h-2 text-green-500 fill-green-500" />
                    )}
                    {option.type === "inactive" && (
                      <Circle className="w-2 h-2 text-red-500 fill-red-500" />
                    )}
                    {option.type === "away" && (
                      <Moon className="w-2.5 h-2.5 text-amber-400 fill-amber-400 transform -rotate-12" />
                    )}
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Keywords Input */}
          <div className="w-64 relative">
            <label className="absolute -top-2 left-3 px-1 bg-[#FDFBF7] text-[10px] font-medium text-gray-500 z-10">
              Search with keywords
            </label>
            <input
              type="text"
              placeholder="Type keywords"
              className="w-full h-11 border border-gray-300 rounded-[4px] px-3 text-xs text-gray-900 placeholder:text-gray-400 bg-transparent focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Filter Button */}
          <div className="ml-auto relative">
            <button
              className="w-10 h-10 border border-[#FF6B6B] rounded-md flex items-center justify-center bg-white hover:bg-red-50 transition-colors"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <SlidersHorizontal className="w-5 h-5 text-[#FF6B6B]" />
            </button>
            {isFilterOpen && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-gray-200 rounded-sm shadow-lg z-50">
                {["Title A-Z", "Title Z-A", "Recently Added"].map((option) => (
                  <div
                    key={option}
                    className="px-4 py-3 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      // Handle sort logic here
                      setIsFilterOpen(false);
                    }}
                  >
                    <div className="w-3 h-3 rounded-full border border-red-400 flex items-center justify-center">
                      {/* Placeholder for selected state dot/check if needed */}
                    </div>
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Employee Grid */}
      <div className="max-w-[76rem] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {employees.map((employee, index) => (
          <div
            key={index}
            className="bg-[#F8F6F1] rounded-xl p-5 border border-gray-100/50 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Card Header & Status */}
            <div className="flex justify-between items-start mb-4">
              <img
                src={employee.image}
                alt={employee.name}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold text-gray-700 italic">
                  {employee.status}
                </span>
                {employee.status === "Away" && (
                  <Moon className="w-3 h-3 text-amber-400 fill-amber-400 transform -rotate-12" />
                )}
                {employee.status === "Active" && (
                  <Circle className="w-2.5 h-2.5 text-green-500 fill-green-500" />
                )}
                {employee.status === "Inactive" && (
                  <Circle className="w-2.5 h-2.5 text-red-500 fill-red-500" />
                )}
              </div>
            </div>

            {/* Name & Role */}
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-900 mb-0.5">
                {employee.name}
              </h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                {employee.role}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {employee.location}
              </p>
            </div>

            {/* Action Icons */}
            <div className="flex justify-end gap-3 mb-4 border-b border-gray-200/50 pb-4">
              <div className="p-1.5 rounded-full border border-gray-300 text-gray-500 hover:text-gray-700 cursor-pointer">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <div className="p-1.5 rounded-full border border-gray-300 text-gray-500 hover:text-gray-700 cursor-pointer">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <div className="p-1.5 rounded-full border border-gray-300 text-gray-500 hover:text-gray-700 cursor-pointer">
                <Phone className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[10px] text-gray-600 font-sans mb-3">
              <div>
                <p className="text-gray-400 mb-0.5">Reports To</p>
                <p className="font-bold">{employee.reportsTo}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-0.5">Team</p>
                <p className="font-bold">{employee.team}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 mb-0.5">Email ID</p>
                <p className="font-bold truncate">{employee.email}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 mb-0.5">Skills</p>
                <p className="font-bold leading-tight">{employee.skills}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Directory;
