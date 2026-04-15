import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, ArrowLeft, X } from "lucide-react";
import { EmployeeHeader } from "@/components/EmployeeHeader";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";

interface Product {
  id: string;
  name: string;
  industry: string;
  champion: string;
  slug: string;
  purpose: string;
  objective: string;
  whoTheyServe: string;
  purposeTheyServe: string;
}

const productData: Product[] = [
  {
    id: "1",
    name: "Customer App",
    industry: "Real Estate Developers",
    champion: "Kshitij Rasal",
    slug: "customer-app",
    purpose:
      "A customer Lifecycle Management Mobile app being used by Real Estate Developers to manage their Customers across the Entire cycle from Booking to Handover and can be extended until Community Management.",
    objective:
      "CRM (SSO user registration, Buyer purchase details, Demand notes, construction updates, Smart NCF form, Registration scheduling, TDS Tutorials, Rule Engine gamification)",
    whoTheyServe: "CRM, Referral & Loyalty",
    purposeTheyServe:
      "Customisation of Look & Feel, Data security, Partner experience, Referral Journey & Payout",
  },
  {
    id: "1b",
    name: "Customer Post Possession",
    industry: "Real Estate Developers",
    champion: "Kshitij Rasal",
    slug: "customer-post-possession",
    purpose:
      "Post-possession customer journey modules focused on community, service, engagement, and retention—delivered in a developer-branded app experience.",
    objective:
      "Community modules (broadcasts, events), service workflows (helpdesk, visitors), and retention loops (loyalty/campaigns) with measurable adoption.",
    whoTheyServe: "Community Ops, CX, Residents",
    purposeTheyServe:
      "Increase resident engagement, reduce support load, and build advocacy after handover.",
  },
  {
    id: "2",
    name: "Hi Society (Society Community Management)",
    industry: "Property & Facility Management",
    champion: "Deepak Gupta",
    slug: "hi-society",
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
    slug: "snag-360",
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
    slug: "qc",
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
    slug: "rhb",
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
    slug: "brokers",
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
    slug: "fm-matrix",
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
    slug: "gophygital-corporate",
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
    slug: "gophygital-coworking",
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
    slug: "task-manager",
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
    slug: "vendor-management",
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
    slug: "procurement",
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
    slug: "loyalty-engine",
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
    slug: "msafe",
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
    slug: "incident-management",
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
    slug: "appointments",
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
    slug: "hse-app",
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
    slug: "club-management",
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

  // Filter States
  const [selectedProductType, setSelectedProductType] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Column configuration for EnhancedTable
  const columns: ColumnConfig[] = [
    {
      key: "name",
      label: "Product Name",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "industry",
      label: "Industry",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "champion",
      label: "Product Champion",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "purpose",
      label: "Product Purpose",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "objective",
      label: "Objective",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "whoTheyServe",
      label: "Who they Serve",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "purposeTheyServe",
      label: "Purpose they Serve",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "quickDemo",
      label: "Quick Demo",
      sortable: false,
      draggable: true,
      defaultVisible: true,
    },
  ];

  // Custom cell renderer
  const renderCell = (product: Product, columnKey: string) => {
    switch (columnKey) {
      case "industry":
        return (
          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-medium border border-blue-100">
            {product.industry}
          </span>
        );
      case "purpose":
      case "objective":
      case "whoTheyServe":
      case "purposeTheyServe":
        return (
          <span className="text-[10px] text-gray-500 leading-relaxed">
            {product[columnKey as keyof Product]}
          </span>
        );
      case "quickDemo":
        return (
          <span className="text-xs font-semibold text-blue-600 underline cursor-pointer hover:text-blue-800 transition-colors">
            Watch Video
          </span>
        );
      default:
        return (
          <span className="text-xs text-gray-900">
            {product[columnKey as keyof Product]}
          </span>
        );
    }
  };

  const renderActions = (product: Product) => (
    <div className="flex items-center justify-center gap-2">
      <Eye
        className="w-4 h-4 cursor-pointer hover:text-blue-600 transition-colors"
        onClick={() =>
          navigate(`/product/${product.slug}`)
        }
      />
    </div>
  );

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

  // Handle filter reset
  const handleFilterReset = () => {
    setSearchTerm("");
    setSelectedIndustry("");
    setSelectedProductType("");
    setSelectedStatus("");
  };

  // Custom filter panel
  const FilterModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Filter Products</h3>
          <button
            onClick={() => setShowFilters(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Type
              </label>
              <select
                value={selectedProductType}
                onChange={(e) => setSelectedProductType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Product Type</option>
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
                  <option key={option} value={option === "All Types" ? "" : option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry Type
              </label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Industry Type</option>
                {["All Industries", "Residential", "Commercial", "ERP", "Others"].map(
                  (option) => (
                    <option
                      key={option}
                      value={option === "All Industries" ? "" : option}
                    >
                      {option}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Project Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            onClick={() => setShowFilters(false)}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleFilterReset();
              setShowFilters(false);
            }}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Reset Filters
          </Button>
          <Button
            onClick={() => setShowFilters(false)}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );

  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 lg:p-10 font-sans">
      <EmployeeHeader />
      <div className="pt-16"></div>
      {/* Header Container */}
      <div className="relative mb-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/employee/company-hub")}
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

      {/* Enhanced Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <EnhancedTable
          data={filteredProducts}
          columns={columns}
          renderCell={renderCell}
          renderActions={renderActions}
          storageKey="products-table"
          enableSearch={true}
          searchPlaceholder="Search Product Name, industry"
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          enableExport={false}
          onFilterClick={() => setShowFilters(true)}
          hideTableSearch={false}
          hideTableExport={true}
          hideColumnsButton={false}
          emptyMessage="No products found matching your active filters."
          className="products-table"
        />
      </div>

      {/* Filter Modal */}
      {showFilters && <FilterModal />}
    </div>
  );
};

export default Products;
