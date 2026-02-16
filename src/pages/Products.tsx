import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Eye,
  ChevronDown,
  ChevronUp,
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
    name: "Loyalty (Post Sales to Post Possession)",
    industry: "Real Estate Developers",
    champion: "Kshitij Rasal",
    purpose:
      "A customer Lifecycle Management Mobile app being used by Real Estate Developers to manage their Customers across the Entire cycle from Booking to Handover and can be extended until Community Management.",
    objective:
      "CRM (SSO user registration, Buyer purchase details, Demand notes, construction updates, Smart NCF form, Registration scheduling, TDS Tutorials, Rule Engine gamification)",
    whoTheyServe: "CRM, Referral & Loyalty",
    purposeTheyServe:
      "Customisation of Look & Feel, Data security, Partner experience, Referral Journey & Payout",
  },
  {
    id: "2",
    name: "Hi Society (Society Community Management)",
    industry: "Property & Facility Management",
    champion: "Deepak Gupta",
    purpose:
      "Integrated Residential Property management Solution that manages helpdesk, security, visitor access, and daily community activities.",
    objective:
      "Comprehensive modules for Helpdesk, Communications, Visitor/Staff, Parking, Club, Fitout, and Accounting Management.",
    whoTheyServe: "Gated Communities, RWA, and Real Estate Developers",
    purposeTheyServe:
      "Establishes effective communication, enhances security, automates facility management, and improves resident experience.",
  },
  {
    id: "3",
    name: "Snag 360",
    industry: "Real Estate Developer & FM",
    champion: "Sagar Singh",
    purpose:
      "Mobile-based QC Application specially designed for the Real Estate industry to deliver a zero-defect product.",
    objective:
      "Ensures dynamic Workflow Management and validates checkpoints across various functions before final delivery.",
    whoTheyServe: "Project Head, Quality Head, FM Head",
    purposeTheyServe:
      "Real-time visibility, Time saving, transparency, accountability, and collaboration.",
  },
  {
    id: "4",
    name: "QC (Quality Control)",
    industry: "Real Estate & Construction",
    champion: "Sagar Singh",
    purpose:
      "Mobile-based solution designed to ensure defect-free execution through stage-wise inspections and compliance monitoring.",
    objective:
      "Standardized checklists, real-time issue tracking, and validating work against drawings and specifications.",
    whoTheyServe: "Developers, Contractors, and Project Teams",
    purposeTheyServe:
      "Real-time visibility, enhanced productivity, and zero-defect project delivery through accountability.",
  },
  {
    id: "5",
    name: "RHB (Rajasthan Housing Board Monitoring)",
    industry: "Government",
    champion: "Sagar Singh",
    purpose:
      "Periodically monitor project progress, quality, and financials across multiple locations for the Housing Board of Rajasthan.",
    objective:
      "Tracking completion time, financials, QC reports, site visits, hindrances, and ATR status with automated alerts.",
    whoTheyServe: "Housing Commissioner, Chief Engineer, and Project Teams",
    purposeTheyServe:
      "Real-time visibility, documented progress, smooth project operations, and data-driven management.",
  },
  {
    id: "6",
    name: "Brokers (CP Management)",
    industry: "Real Estate & Sales",
    champion: "Kshitij Rasal",
    purpose:
      "A Channel Partner Lifecycle Management mobile app used by Real Estate Developers to manage Channel Partners end-to-end.",
    objective:
      "Onboarding, project access, lead submission, booking conversion, and brokerage tracking.",
    whoTheyServe:
      "Channel Partners, Agencies, Developers, Sales & Marketing teams",
    purposeTheyServe:
      "Sales enablement, transparent payouts, real-time tracking, and zero manual dependency.",
  },
  {
    id: "7",
    name: "FM Matrix",
    industry: "Facility Management",
    champion: "Abdul Ghaffar",
    purpose:
      "A unified Facility Management platform that digitizes and manages Maintenance, Security, Safety, Procurement, and community operations.",
    objective:
      "Real-time visibility, automated workflows, MIS dashboards, and seamless integrations to improve operational efficiency.",
    whoTheyServe:
      "Facility Managers, Operations Heads, Technicians, Finance/Procurement, Safety Officers, CXOs",
    purposeTheyServe:
      "Digital transformation of site operations, asset management, inventory control, and compliance risk monitoring.",
  },
  {
    id: "8",
    name: "GoPhygital.work (Corporate)",
    industry: "Enterprise Digital Workplace",
    champion: "Aquil Husain",
    purpose:
      "A unified digital workplace platform designed to seamlessly bridge physical and digital operations for modern enterprises.",
    objective:
      "Manage employees, workplace operations, assets, access, safety, and compliance from a single secure ecosystem.",
    whoTheyServe:
      "Large Enterprises, IT Technology Firms, Coworking Providers, Facility Managers",
    purposeTheyServe:
      "Operational control, workforce engagement, and compliance readiness through an integrated platform.",
  },
  {
    id: "9",
    name: "GoPhygital.work (Co working Space)",
    industry: "Coworking Space",
    champion: "Abdul Ghaffar",
    purpose:
      "A unified tenant experience platform designed to bridge the gap between physical workspace operations and digital community engagement.",
    objective:
      "Automates friction points like desk booking and visitor entry while fostering a connected community.",
    whoTheyServe: "Coworking Operators, Community Managers, Members",
    purposeTheyServe:
      "Efficient monetization of space and providing members a seamless self-service experience.",
  },
  {
    id: "10",
    name: "Project and Task Manager",
    industry: "Work Management / All Industries",
    champion: "Yash & Sadanand Gupta",
    purpose:
      "An end-to-end work management solution designed to help teams plan, track, and execute projects efficiently.",
    objective:
      "Centralizes tasks, timelines, ownership, and progress tracking into a single platform.",
    whoTheyServe:
      "Project Managers, Team Leads, Cross-functional Teams, Founders",
    purposeTheyServe:
      "Transparency, accountability, and faster delivery with real-time status visibility.",
  },
  {
    id: "11",
    name: "Vendor Management",
    industry: "Procurement & Supply Chain",
    champion: "Ajay Ghenand",
    purpose:
      "Complete vendor lifecycle management including onboarding, KYC, empanelment, contract administration, and performance assessment.",
    objective:
      "Automates friction points in vendor registration and compliance while ensuring high service quality through audits.",
    whoTheyServe:
      "Procurement Heads, Accounts Payable Teams, Vendor Relationship Managers",
    purposeTheyServe:
      "Eliminates manual tracking, ensures statutory compliance, and builds a transparent vendor ecosystem.",
  },
  {
    id: "12",
    name: "Procurement/Contracts",
    industry: "Real Estate & Manufacturing",
    champion: "Dinesh Shinde",
    purpose:
      "Complete management of the procurement and contract lifecycle, from Indent/Purchase Requisition to Contract Closure & Payment.",
    objective:
      "Seamless management of vendors, tenders, contracts, work orders, and material procurement, ensuring cost control and transparency.",
    whoTheyServe:
      "Procurement Heads, Contractors, Site Engineers, Store Teams, Vendors",
    purposeTheyServe:
      "Eliminates manual re-entry, ensures budget visibility, and streamlines the source-to-pay workflow.",
  },
  {
    id: "13",
    name: "Loyalty Engine",
    industry: "Referral & Loyalty",
    champion: "Vinayak Mane & Kshitij Rasal",
    purpose:
      "A configurable system designed to automatically apply loyalty rewards, points, or benefits based on predefined business rules.",
    objective:
      "Evaluates user actions like payments, referrals, and bookings using logical operatives without requiring code changes.",
    whoTheyServe: "Business, Sales, Finance, Operations, and Legal teams",
    purposeTheyServe:
      "Automation of complex business logic, ensuring consistency, transparency, and auditability in decision-making.",
  },
  {
    id: "14",
    name: "MSafe",
    industry: "Health, Safety & Wellbeing",
    champion: "Sohail Ansari",
    purpose:
      "A HSW compliance application that helps stakeholders monitor various safety compliances and perform Key Risk Compliance checks (KRCC).",
    objective:
      "Enforce safety standards, prevent accidents during high-risk tasks, and comply with industry legal requirements.",
    whoTheyServe: "HSW Heads, Operations Heads, Line Managers, @Risk Workforce",
    purposeTheyServe:
      "HSW governance through digitized risk assessments, compliance checks, and leadership safety engagement.",
  },
  {
    id: "15",
    name: "Incident Management",
    industry: "Health, Safety & Environment",
    champion: "Shahab Anwar",
    purpose:
      "A structured, end-to-end solution designed to help organizations effectively identify, report, investigate, and resolve incidents.",
    objective:
      "Timely incident reporting followed by systematic investigation, root cause analysis, and preventive action (CAPA) tracking.",
    whoTheyServe:
      "Safety Officers, EHS Teams, Site Engineers, Operation Directors",
    purposeTheyServe:
      "Risk reduction, organizational safety standards, accountability, and legal defensibility through structured workflows.",
  },
  {
    id: "16",
    name: "Appointments",
    industry: "Real Estate",
    champion: "Deepak Gupta & Sagar Singh",
    purpose:
      "A digital solution that allows customers and site teams to schedule, manage, and property handover appointments.",
    objective:
      "Streamlines the unit handover process by enabling customers to book, reschedule, and confirm handover appointments digitally.",
    whoTheyServe: "Relationship Managers, CRM Heads, Flat Owners, Site Teams",
    purposeTheyServe:
      "Hassle-free scheduling and organized possession process, reducing manual coordination and delays.",
  },
  {
    id: "17",
    name: "HSE App",
    industry: "Health, Safety & Environment",
    champion: "Shahab Anwar",
    purpose:
      "A unified digital solution that enhances workplace safety by streamlining incidents, audits, checklists, and safety violations.",
    objective:
      "Real-time reporting, role-based workflows, and automated approvals to capture and resolve safety issues efficiently.",
    whoTheyServe: "Area Managers, Contractors, Safety Officers, EHS Teams",
    purposeTheyServe:
      "Risk identification, compliance enforcement, and maintaining audit-ready safety records across multi-site operations.",
  },
  {
    id: "18",
    name: "Club Management",
    industry: "Sports & Recreation",
    champion: "Deepak Gupta",
    purpose:
      "A comprehensive digital platform designed to help commercial clubs efficiently manage bookings, memberships, and daily operations.",
    objective:
      "Streamlines administrative tasks, enhances member experience, and increases revenue through automation and real-time insights.",
    whoTheyServe: "Club Admins, Sports Clubs, Fitness Centers, Social Clubs",
    purposeTheyServe:
      "Unified management of memberships, self-service bookings, and centralized data across all club activities.",
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

  const filteredProducts = productData.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.whoTheyServe.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      !selectedProductType ||
      product.whoTheyServe
        .toLowerCase()
        .includes(selectedProductType.toLowerCase()) ||
      product.name.toLowerCase().includes(selectedProductType.toLowerCase()) ||
      product.purpose.toLowerCase().includes(selectedProductType.toLowerCase());

    const matchesIndustry =
      !selectedIndustry ||
      product.industry.toLowerCase().includes(selectedIndustry.toLowerCase()) ||
      (selectedIndustry === "Others" &&
        !["Residential", "Commercial", "ERP"].some((i) =>
          product.industry.toLowerCase().includes(i.toLowerCase())
        ));

    // For demonstration, we assume all listed products are "Active"
    const matchesStatus = !selectedStatus || selectedStatus === "Active";

    return matchesSearch && matchesType && matchesIndustry && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 lg:p-10 font-sans">
      {/* Header Container */}
      <div className="relative mb-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/company-hub")}
          className="absolute left-0 top-0 flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium text-base">Back</span>
        </button>

        {/* Title & Description */}
        <div className="text-center w-full max-w-3xl mx-auto pt-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Lockated Products
          </h2>
          <p className="text-gray-700 text-base leading-relaxed max-w-2xl mx-auto font-medium">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt
          </p>
        </div>
      </div>

      {/* Main Search Bar */}
      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-xl">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-5 py-4 border-none rounded-full bg-[#E0E0E0] text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 text-lg shadow-inner whitespace-nowrap overflow-hidden text-ellipsis"
            placeholder="Search Product Name, industry"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap lg:flex-nowrap gap-4 items-center mb-10">
        {/* Filter 1 */}
        <div className="relative flex-1 min-w-[160px]">
          <label className="absolute -top-2 left-2 bg-[#FDFBF7] px-1 text-xs font-bold text-gray-600 z-10">
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
                "All Types",
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
                    setSelectedProductType(
                      option === "All Types" ? "" : option
                    );
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
        <div className="relative flex-1 min-w-[160px]">
          <label className="absolute -top-2 left-2 bg-[#FDFBF7] px-1 text-xs font-bold text-gray-600 z-10">
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
              {[
                "All Industries",
                "Residential",
                "Commercial",
                "ERP",
                "Others",
              ].map((option) => (
                <div
                  key={option}
                  className="px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                  onClick={() => {
                    setSelectedIndustry(
                      option === "All Industries" ? "" : option
                    );
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
        <div className="relative flex-1 min-w-[160px]">
          <label className="absolute -top-2 left-2 bg-[#FDFBF7] px-1 text-xs font-bold text-gray-600 z-10">
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
                { label: "All Status", color: "text-gray-400", fill: "" },
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
                    setSelectedStatus(
                      option.label === "All Status" ? "" : option.label
                    );
                    setIsStatusOpen(false);
                  }}
                >
                  {option.fill && (
                    <Circle
                      className={`w-2.5 h-2.5 ${option.color} ${option.fill}`}
                    />
                  )}
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filter 4 - Search with keywords */}
        <div className="relative flex-1 min-w-[160px]">
          <label className="absolute -top-2 left-2 bg-[#FDFBF7] px-1 text-xs font-bold text-gray-600 z-10">
            Search with keywords
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-sm px-3 py-3 text-xs text-gray-900 bg-transparent focus:outline-none placeholder-gray-400"
            placeholder="Type keywords"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Button */}
        <div className="flex justify-end lg:justify-start">
          <button
            className="p-3 border border-red-300 rounded bg-white hover:bg-red-50 text-red-500 transition-colors"
            onClick={() => {
              setSearchTerm("");
              setSelectedIndustry("");
              setSelectedProductType("");
              setSelectedStatus("");
            }}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
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
                  <div className="flex flex-col">
                    <ChevronUp className="w-3 h-3 text-gray-500 group-hover:text-gray-800 -mb-1" />
                    <ChevronDown className="w-3 h-3 text-gray-500 group-hover:text-gray-800" />
                  </div>
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer group hover:bg-[#ded6c6] transition-colors"
              >
                <div className="flex items-center gap-1">
                  Industry
                  <div className="flex flex-col">
                    <ChevronUp className="w-3 h-3 text-gray-500 group-hover:text-gray-800 -mb-1" />
                    <ChevronDown className="w-3 h-3 text-gray-500 group-hover:text-gray-800" />
                  </div>
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer group hover:bg-[#ded6c6] transition-colors"
              >
                <div className="flex items-center gap-1">
                  Product Champion
                  <div className="flex flex-col">
                    <ChevronUp className="w-3 h-3 text-gray-500 group-hover:text-gray-800 -mb-1" />
                    <ChevronDown className="w-3 h-3 text-gray-500 group-hover:text-gray-800" />
                  </div>
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer group hover:bg-[#ded6c6] transition-colors"
              >
                <div className="flex items-center gap-1">
                  Product Purpose
                  <div className="flex flex-col">
                    <ChevronUp className="w-3 h-3 text-gray-500 group-hover:text-gray-800 -mb-1" />
                    <ChevronDown className="w-3 h-3 text-gray-500 group-hover:text-gray-800" />
                  </div>
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer group hover:bg-[#ded6c6] transition-colors"
              >
                <div className="flex items-center gap-1">
                  Objective
                  <div className="flex flex-col">
                    <ChevronUp className="w-3 h-3 text-gray-500 group-hover:text-gray-800 -mb-1" />
                    <ChevronDown className="w-3 h-3 text-gray-500 group-hover:text-gray-800" />
                  </div>
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer group hover:bg-[#ded6c6] transition-colors"
              >
                <div className="flex items-center gap-1">
                  Who they Serve
                  <div className="flex flex-col">
                    <ChevronUp className="w-3 h-3 text-gray-500 group-hover:text-gray-800 -mb-1" />
                    <ChevronDown className="w-3 h-3 text-gray-500 group-hover:text-gray-800" />
                  </div>
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer group hover:bg-[#ded6c6] transition-colors"
              >
                <div className="flex items-center gap-1">
                  Purpose they Serve
                  <div className="flex flex-col">
                    <ChevronUp className="w-3 h-3 text-gray-500 group-hover:text-gray-800 -mb-1" />
                    <ChevronDown className="w-3 h-3 text-gray-500 group-hover:text-gray-800" />
                  </div>
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer group hover:bg-[#ded6c6] transition-colors"
              >
                <div className="flex items-center gap-1">
                  Quick Demo
                  <div className="flex flex-col">
                    <ChevronUp className="w-3 h-3 text-gray-500 group-hover:text-gray-800 -mb-1" />
                    <ChevronDown className="w-3 h-3 text-gray-500 group-hover:text-gray-800" />
                  </div>
                </div>
              </th>
              <th scope="col" className="px-4 py-3 w-4"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product, index) => (
              <tr
                key={product.id}
                className={
                  index % 2 === 0
                    ? "bg-white"
                    : "bg-[#F9F9F9] hover:bg-gray-50 transition-colors"
                }
              >
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Eye
                      className="w-4 h-4 cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() =>
                        navigate("/product-details", {
                          state: { productId: product.id },
                        })
                      }
                    />
                  </div>
                </td>
                <td className="px-4 py-4 text-xs font-bold text-gray-900 w-32">
                  {product.name}
                </td>
                <td className="px-4 py-4 text-xs text-gray-600 w-32">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-medium border border-blue-100">
                    {product.industry}
                  </span>
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
                <td className="px-4 py-4 text-center min-w-[120px]">
                  <span className="text-xs font-semibold text-blue-600 underline cursor-pointer hover:text-blue-800 transition-colors">
                    Watch Video
                  </span>
                </td>
                <td className="px-2 py-4"></td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <Search className="w-12 h-12 text-gray-200" />
                    <p className="text-gray-400 font-medium">
                      No products found matching your active filters.
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedIndustry("");
                        setSelectedProductType("");
                        setSelectedStatus("");
                      }}
                      className="text-blue-600 text-sm font-bold hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
