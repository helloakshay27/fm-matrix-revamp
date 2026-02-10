import React, { useState, useEffect } from "react";
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
import axios from "axios";

interface Employee {
  id: number;
  name: string;
  email: string;
  mobile: string | null;
  department_name: string;
  designation: string | null;
  full_address: string | null;
  profile_image_url: string | null;
  reporting_manager_name: string;
  children: Employee[];
}

const Directory: React.FC = () => {
  const navigate = useNavigate();
  const baseUrl = localStorage.getItem("baseUrl");
  const [searchTerm, setSearchTerm] = useState("");
  const [hierarchyData, setHierarchyData] = useState<Employee | null>(null);
  const [flatEmployeeList, setFlatEmployeeList] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dropdown States
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get logged-in user email from localStorage
  const getUserEmail = (): string | null => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      const user = JSON.parse(userStr);
      return user?.email || null;
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      return null;
    }
  };

  const userEmail = getUserEmail();

  // Fetch employee hierarchy
  useEffect(() => {
    // Flatten the hierarchy tree into a list
    const flattenHierarchy = (employee: Employee): Employee[] => {
      const result: Employee[] = [employee];
      if (employee.children && employee.children.length > 0) {
        employee.children.forEach((child) => {
          result.push(...flattenHierarchy(child));
        });
      }
      return result;
    };

    const fetchEmployeeHierarchy = async () => {
      if (!userEmail) {
        setError("User email not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Get token from localStorage
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No authentication token found in localStorage");
          setError("Authentication token not found. Please login again.");
          setLoading(false);
          return;
        }

        console.log("📧 Fetching hierarchy for email:", userEmail);
        console.log(
          "🔑 Using token:",
          token ? `${token.substring(0, 20)}...` : "none"
        );

        const response = await axios.get(
          `https://${baseUrl}/pms/users/employee_hierarchy`,
          {
            params: {
              email: userEmail,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(
          "✅ Successfully fetched employee hierarchy:",
          response.data
        );
        setHierarchyData(response.data);
        const flatList = flattenHierarchy(response.data);
        setFlatEmployeeList(flatList);
        setError(null);
      } catch (err: any) {
        console.error("❌ Failed to fetch employee hierarchy:", err);
        console.error("Error details:", {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          message: err.response?.data?.message || err.response?.data?.error,
          headers: err.response?.headers,
        });

        console.error(
          "Full error response data:",
          JSON.stringify(err.response?.data, null, 2)
        );

        if (err.response?.status === 401) {
          const errorMessage =
            err.response?.data?.message ||
            err.response?.data?.error ||
            "Authentication failed";
          setError(
            `Authentication failed: ${errorMessage}. Please login again.`
          );
        } else {
          setError("Failed to load employee directory");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeHierarchy();
  }, [userEmail]);

  // Get unique departments for filter
  const departments = Array.from(
    new Set(flatEmployeeList.map((emp) => emp.department_name).filter(Boolean))
  );

  // Filter employees based on search and filters
  const filteredEmployees = flatEmployeeList.filter((employee) => {
    const matchesSearch =
      searchTerm === "" ||
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "" ||
      employee.department_name === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading employee directory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
            Browse and connect with your colleagues across the organization. Use
            the search and filters to find specific team members.
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
            placeholder="Search with Name, department, email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
              <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-sm shadow-lg z-50 max-h-60 overflow-y-auto">
                <div
                  className="px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                  onClick={() => {
                    setSelectedDepartment("");
                    setIsDepartmentOpen(false);
                  }}
                >
                  All Departments
                </div>
                {departments.map((dept) => (
                  <div
                    key={dept}
                    className="px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                    onClick={() => {
                      setSelectedDepartment(dept);
                      setIsDepartmentOpen(false);
                    }}
                  >
                    {dept}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="ml-auto text-sm text-gray-600">
            Showing {filteredEmployees.length} of {flatEmployeeList.length}{" "}
            employees
          </div>
        </div>
      </div>

      {/* Employee Grid */}
      <div className="max-w-[76rem] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredEmployees.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">
              No employees found matching your criteria.
            </p>
          </div>
        ) : (
          filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className="bg-[#F8F6F1] rounded-xl p-5 border border-gray-100/50 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Card Header & Profile Image */}
              <div className="flex justify-between items-start mb-4">
                <img
                  src={
                    employee.profile_image_url ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.name}`
                  }
                  alt={employee.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-gray-700 italic">
                    Active
                  </span>
                  <Circle className="w-2.5 h-2.5 text-green-500 fill-green-500" />
                </div>
              </div>

              {/* Name & Role */}
              <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-900 mb-0.5">
                  {employee.name}
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  {employee.designation || "N/A"}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {employee.department_name}
                </p>
              </div>

              {/* Action Icons */}
              <div className="flex justify-end gap-3 mb-4 border-b border-gray-200/50 pb-4">
                <a
                  href={`mailto:${employee.email}`}
                  className="p-1.5 rounded-full border border-gray-300 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
                <div className="p-1.5 rounded-full border border-gray-300 text-gray-500 hover:text-gray-700 cursor-pointer">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                {employee.mobile && (
                  <a
                    href={`tel:${employee.mobile}`}
                    className="p-1.5 rounded-full border border-gray-300 text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[10px] text-gray-600 font-sans mb-3">
                <div>
                  <p className="text-gray-400 mb-0.5">Reports To</p>
                  <p className="font-bold">{employee.reporting_manager_name}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-0.5">Department</p>
                  <p className="font-bold">{employee.department_name}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-400 mb-0.5">Email ID</p>
                  <p className="font-bold truncate">{employee.email}</p>
                </div>
                {employee.mobile && (
                  <div className="col-span-2">
                    <p className="text-gray-400 mb-0.5">Mobile</p>
                    <p className="font-bold">{employee.mobile}</p>
                  </div>
                )}
                {employee.full_address && (
                  <div className="col-span-2">
                    <p className="text-gray-400 mb-0.5">Location</p>
                    <p className="font-bold leading-tight line-clamp-2">
                      {employee.full_address}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Directory;
