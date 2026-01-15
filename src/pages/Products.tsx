import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Eye,
  ChevronDown,
  SlidersHorizontal,
  Circle,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  industry: string;
  champion: string;
  purpose: string;
  objective: string;
  whoTheyServe: string;
  purposeTheyServe: string;
}

const productData: Product[] = [
  {
    id: "1",
    name: "Loyalty Management",
    industry: "Residential Product",
    champion: "Kshitij Rasal",
    purpose:
      "Monitoring implementation and effectiveness of data protection efforts within company",
    objective:
      "Monitoring implementation and effectiveness of data protection efforts within company",
    whoTheyServe: "Monitoring implementation and effectiveness of data",
    purposeTheyServe:
      "Monitoring implementation and effectiveness of data protection efforts within company",
  },
  {
    id: "2",
    name: "Snag 360",
    industry: "Residential Product",
    champion: "Kshitij Rasal",
    purpose:
      "Monitoring implementation and effectiveness of data protection efforts within company",
    objective:
      "Monitoring implementation and effectiveness of data protection efforts within company",
    whoTheyServe: "Monitoring implementation and effectiveness of data",
    purposeTheyServe:
      "Monitoring implementation and effectiveness of data protection efforts within company",
  },
  {
    id: "3",
    name: "Snag 360",
    industry: "Residential Product",
    champion: "Kshitij Rasal",
    purpose:
      "Monitoring implementation and effectiveness of data protection efforts within company",
    objective:
      "Monitoring implementation and effectiveness of data protection efforts within company",
    whoTheyServe: "Monitoring implementation and effectiveness of data",
    purposeTheyServe:
      "Monitoring implementation and effectiveness of data protection efforts within company",
  },
  {
    id: "4",
    name: "Snag 360",
    industry: "Residential Product",
    champion: "Kshitij Rasal",
    purpose:
      "Monitoring implementation and effectiveness of data protection efforts within company",
    objective:
      "Monitoring implementation and effectiveness of data protection efforts within company",
    whoTheyServe: "Monitoring implementation and effectiveness of data",
    purposeTheyServe:
      "Monitoring implementation and effectiveness of data protection efforts within company",
  },
  {
    id: "5",
    name: "Snag 360",
    industry: "Residential Product",
    champion: "Kshitij Rasal",
    purpose:
      "Monitoring implementation and effectiveness of data protection efforts within company",
    objective:
      "Monitoring implementation and effectiveness of data protection efforts within company",
    whoTheyServe: "Monitoring implementation and effectiveness of data",
    purposeTheyServe:
      "Monitoring implementation and effectiveness of data protection efforts within company",
  },
  {
    id: "6",
    name: "Snag 360",
    industry: "Residential Product",
    champion: "Kshitij Rasal",
    purpose:
      "Monitoring implementation and effectiveness of data protection efforts within company",
    objective:
      "Monitoring implementation and effectiveness of data protection efforts within company",
    whoTheyServe: "Monitoring implementation and effectiveness of data",
    purposeTheyServe:
      "Monitoring implementation and effectiveness of data protection efforts within company",
  },
  {
    id: "7",
    name: "Snag 360",
    industry: "Residential Product",
    champion: "Kshitij Rasal",
    purpose:
      "Monitoring implementation and effectiveness of data protection efforts within company",
    objective:
      "Monitoring implementation and effectiveness of data protection efforts within company",
    whoTheyServe: "Monitoring implementation and effectiveness of data",
    purposeTheyServe:
      "Monitoring implementation and effectiveness of data protection efforts within company",
  },
  {
    id: "8",
    name: "Snag 360",
    industry: "Residential Product",
    champion: "Kshitij Rasal",
    purpose:
      "Monitoring implementation and effectiveness of data protection efforts within company",
    objective:
      "Monitoring implementation and effectiveness of data protection efforts within company",
    whoTheyServe: "Monitoring implementation and effectiveness of data",
    purposeTheyServe:
      "Monitoring implementation and effectiveness of data protection efforts within company",
  },
];

const Products: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Dropdown States
  const [isProductTypeOpen, setIsProductTypeOpen] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState("");

  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState("");

  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 lg:p-10 font-sans">
      {/* Header Container */}
      <div className="relative mb-8">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="absolute left-0 top-0 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors border border-blue-200 px-3 py-1.5 rounded"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        {/* Title & Description */}
        <div className="text-center w-full max-w-4xl mx-auto pt-2">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Lockated Products
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt
          </p>
        </div>
      </div>

      {/* Main Search Bar */}
      <div className="flex justify-center mb-10">
        <div className="relative w-full max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border-none rounded-full bg-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 sm:text-sm"
            placeholder="Search Product Name, Industry"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 items-center mb-8">
        {/* Filter 1 */}
        <div className="relative">
          <label className="absolute -top-2 left-2 bg-[#FDFBF7] px-1 text-[10px] font-bold text-gray-600 z-10">
            Product Type
          </label>
          <div
            className="w-full border border-gray-300 rounded-sm px-3 py-3 text-xs text-gray-500 cursor-pointer bg-transparent relative flex items-center justify-between"
            onClick={() => setIsProductTypeOpen(!isProductTypeOpen)}
          >
            <span
              className={
                selectedProductType ? "text-gray-900" : "text-gray-400"
              }
            >
              {selectedProductType || "Select Product Type"}
            </span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </div>

          {isProductTypeOpen && (
            <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-sm shadow-lg z-50 max-h-60 overflow-y-auto">
              {[
                "Wallet Management",
                "CRM",
                "Visitor Management",
                "Facility Management",
                "Loyalty",
                "Pre - Sales",
                "Post - Sales",
                "Vendor Portal",
                "Customer Portal",
              ].map((option) => (
                <div
                  key={option}
                  className="px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                  onClick={() => {
                    setSelectedProductType(option);
                    setIsProductTypeOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filter 2 */}
        <div className="relative">
          <label className="absolute -top-2 left-2 bg-[#FDFBF7] px-1 text-[10px] font-bold text-gray-600 z-10">
            Industry Type
          </label>
          <div
            className="w-full border border-gray-300 rounded-sm px-3 py-3 text-xs text-gray-500 cursor-pointer bg-transparent relative flex items-center justify-between"
            onClick={() => setIsIndustryOpen(!isIndustryOpen)}
          >
            <span
              className={selectedIndustry ? "text-gray-900" : "text-gray-400"}
            >
              {selectedIndustry || "Select Industry Type"}
            </span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </div>

          {isIndustryOpen && (
            <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-sm shadow-lg z-50">
              {["Residential", "Commercial", "ERP", "Others"].map((option) => (
                <div
                  key={option}
                  className="px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                  onClick={() => {
                    setSelectedIndustry(option);
                    setIsIndustryOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filter 3 */}
        <div className="relative">
          <label className="absolute -top-2 left-2 bg-[#FDFBF7] px-1 text-[10px] font-bold text-gray-600 z-10">
            Project Status
          </label>
          <div
            className="w-full border border-gray-300 rounded-sm px-3 py-3 text-xs text-gray-500 cursor-pointer bg-transparent relative flex items-center justify-between"
            onClick={() => setIsStatusOpen(!isStatusOpen)}
          >
            <span
              className={selectedStatus ? "text-gray-900" : "text-gray-400"}
            >
              {selectedStatus || "Select Project Status"}
            </span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </div>

          {isStatusOpen && (
            <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-sm shadow-lg z-50">
              {[
                {
                  label: "Active",
                  color: "text-green-500",
                  fill: "fill-green-500",
                },
                {
                  label: "Inactive",
                  color: "text-red-500",
                  fill: "fill-red-500",
                },
              ].map((option) => (
                <div
                  key={option.label}
                  className="px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 flex items-center gap-2"
                  onClick={() => {
                    setSelectedStatus(option.label);
                    setIsStatusOpen(false);
                  }}
                >
                  <Circle
                    className={`w-2 h-2 ${option.color} ${option.fill}`}
                  />
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filter 4 - Keywords */}
        <div className="relative">
          <label className="absolute -top-2 left-2 bg-[#FDFBF7] px-1 text-[10px] font-bold text-gray-600 z-10">
            Search with keywords
          </label>
          <input
            type="text"
            placeholder="Type keywords"
            className="block w-full border border-gray-300 rounded-sm px-3 py-3 text-xs placeholder-gray-400 focus:border-gray-400 focus:outline-none bg-transparent"
          />
        </div>

        {/* Filter Button */}
        <div className="flex justify-end md:justify-start relative">
          <button
            className="p-2 border border-red-300 rounded bg-white hover:bg-red-50 text-red-500 transition-colors"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>

          {isFilterOpen && (
            <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-gray-200 rounded-sm shadow-lg z-50">
              {["Title A-Z", "Title Z-A", "Recently Added"].map((option) => (
                <div
                  key={option}
                  className="px-4 py-3 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                >
                  <div className="w-3 h-3 rounded-full border border-red-400 flex items-center justify-center">
                    {/* Placeholder for selected state dot if needed */}
                  </div>
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded shadow-sm overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#EBE5D9]">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-16"
              >
                Action
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer group hover:bg-[#ded6c6] transition-colors"
              >
                <div className="flex items-center gap-1">
                  Product Name
                  <ChevronDown className="w-3 h-3 text-gray-500 group-hover:text-gray-800" />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer group hover:bg-[#ded6c6] transition-colors"
              >
                <div className="flex items-center gap-1">
                  Industry
                  <ChevronDown className="w-3 h-3 text-gray-500 group-hover:text-gray-800" />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer group hover:bg-[#ded6c6] transition-colors"
              >
                <div className="flex items-center gap-1">
                  Product Champion
                  <ChevronDown className="w-3 h-3 text-gray-500 group-hover:text-gray-800" />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer group hover:bg-[#ded6c6] transition-colors"
              >
                <div className="flex items-center gap-1">
                  Product Purpose
                  <ChevronDown className="w-3 h-3 text-gray-500 group-hover:text-gray-800" />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer group hover:bg-[#ded6c6] transition-colors"
              >
                <div className="flex items-center gap-1">
                  Objective
                  <ChevronDown className="w-3 h-3 text-gray-500 group-hover:text-gray-800" />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer group hover:bg-[#ded6c6] transition-colors"
              >
                <div className="flex items-center gap-1">
                  Who they Serve
                  <ChevronDown className="w-3 h-3 text-gray-500 group-hover:text-gray-800" />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer group hover:bg-[#ded6c6] transition-colors"
              >
                <div className="flex items-center gap-1">
                  Purpose they Serve
                  <ChevronDown className="w-3 h-3 text-gray-500 group-hover:text-gray-800" />
                </div>
              </th>
              <th scope="col" className="px-4 py-3 w-4"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productData.map((product, index) => (
              <tr
                key={product.id}
                className={
                  index % 2 === 0
                    ? "bg-white"
                    : "bg-[#F9F9F9] hover:bg-gray-50 transition-colors"
                }
              >
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  <Eye
                    className="w-4 h-4 cursor-pointer hover:text-blue-600"
                    onClick={() => navigate("/product-details")}
                  />
                </td>
                <td className="px-4 py-4 text-xs font-medium text-gray-900 w-32">
                  {product.name}
                </td>
                <td className="px-4 py-4 text-xs text-gray-500 w-32">
                  {product.industry}
                </td>
                <td className="px-4 py-4 text-xs text-gray-500 w-32">
                  {product.champion}
                </td>
                <td className="px-4 py-4 text-[10px] text-gray-500 leading-relaxed min-w-[200px]">
                  {product.purpose}
                </td>
                <td className="px-4 py-4 text-[10px] text-gray-500 leading-relaxed min-w-[200px]">
                  {product.objective}
                </td>
                <td className="px-4 py-4 text-[10px] text-gray-500 leading-relaxed min-w-[150px]">
                  {product.whoTheyServe}
                </td>
                <td className="px-4 py-4 text-[10px] text-gray-500 leading-relaxed min-w-[200px]">
                  {product.purposeTheyServe}
                </td>
                <td className="px-2 py-4"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
