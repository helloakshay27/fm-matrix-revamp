import { ChevronDown, ChevronRight, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { filterProjects } from "@/store/slices/projectManagementSlice";

interface ProjectFilterModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  onApplyFilters?: () => void;
}

const statusOptions = [
  { label: "Active", value: "active", color: "bg-green-500" },
  { label: "In Progress", value: "in_progress", color: "bg-cyan-400" },
  { label: "Completed", value: "completed", color: "bg-black" },
  { label: "On Hold", value: "on_hold", color: "bg-yellow-500" },
  { label: "Overdue", value: "overdue", color: "bg-red-500" },
];

const getInitialFilters = () => {
  try {
    const saved = localStorage.getItem("projectFilters");
    return saved
      ? JSON.parse(saved)
      : {
        selectedStatuses: [],
        selectedTypes: [],
        selectedManagers: [],
        dates: { startDate: "", endDate: "" },
        statusSearch: "",
        typeSearch: "",
        managerSearch: "",
      };
  } catch (error) {
    console.error("Error parsing projectFilters from localStorage:", error);
    return {
      selectedStatuses: [],
      selectedTypes: [],
      selectedManagers: [],
      dates: { startDate: "", endDate: "" },
      statusSearch: "",
      typeSearch: "",
      managerSearch: "",
    };
  }
};

export const ProjectFilterModal = ({
  isModalOpen,
  setIsModalOpen,
  onApplyFilters,
}: ProjectFilterModalProps) => {
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");
  const dispatch = useAppDispatch();
  const modalRef = useRef<HTMLDivElement>(null);

  const [selectedStatuses, setSelectedStatuses] = useState(
    getInitialFilters().selectedStatuses
  );
  const [selectedTypes, setSelectedTypes] = useState(
    getInitialFilters().selectedTypes
  );
  const [selectedManagers, setSelectedManagers] = useState(
    getInitialFilters().selectedManagers
  );
  const [dates, setDates] = useState(getInitialFilters().dates);
  const [statusSearch, setStatusSearch] = useState(
    getInitialFilters().statusSearch
  );
  const [typeSearch, setTypeSearch] = useState(getInitialFilters().typeSearch);
  const [managerSearch, setManagerSearch] = useState(
    getInitialFilters().managerSearch
  );

  const [dropdowns, setDropdowns] = useState({
    status: false,
    projectType: false,
    projectManager: false,
    startDate: false,
    endDate: false,
  });

  // Save filters to localStorage
  useEffect(() => {
    const filters = {
      selectedStatuses,
      selectedTypes,
      selectedManagers,
      dates,
      statusSearch,
      typeSearch,
      managerSearch,
    };
    if (
      selectedStatuses.length > 0 ||
      selectedTypes.length > 0 ||
      selectedManagers.length > 0 ||
      statusSearch ||
      typeSearch ||
      managerSearch ||
      dates.startDate ||
      dates.endDate
    ) {
      localStorage.setItem("projectFilters", JSON.stringify(filters));
    }
  }, [
    selectedStatuses,
    selectedTypes,
    selectedManagers,
    dates,
    statusSearch,
    typeSearch,
    managerSearch,
  ]);

  const toggleDropdown = (key: keyof typeof dropdowns) => {
    setDropdowns((prev) => {
      const isAlreadyOpen = prev[key];
      if (isAlreadyOpen) {
        return { ...prev, [key]: false };
      }
      return {
        status: false,
        projectType: false,
        projectManager: false,
        startDate: false,
        endDate: false,
        [key]: true,
      };
    });
  };

  const toggleOption = (
    value: string,
    selected: string[],
    setSelected: (selected: string[]) => void
  ) => {
    setSelected(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const renderCheckboxList = (
    options: { label: string; value: string; color?: string }[],
    selected: string[],
    setSelected: (selected: string[]) => void,
    searchTerm: string = ""
  ) => {
    const filtered = options.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="max-h-40 overflow-y-auto p-2">
        {filtered.map((option) => (
          <label
            key={option.value}
            className="flex items-center justify-between py-2 px-2 text-sm cursor-pointer hover:bg-gray-50 rounded"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected.includes(option.value)}
                onChange={() => toggleOption(option.value, selected, setSelected)}
              />
              <span>{option.label}</span>
            </div>
            {option.color && (
              <span className={`w-2 h-2 rounded-full ${option.color}`}></span>
            )}
          </label>
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-2">
            No results found
          </div>
        )}
      </div>
    );
  };

  const clearAll = () => {
    setSelectedStatuses([]);
    setSelectedTypes([]);
    setSelectedManagers([]);
    setStatusSearch("");
    setTypeSearch("");
    setManagerSearch("");
    setDates({ startDate: "", endDate: "" });
    localStorage.removeItem("projectFilters");
    closeModal();
  };

  const handleApplyFilters = async () => {
    const newFilters: Record<string, any> = {};

    if (selectedStatuses.length > 0) {
      newFilters["q[status_in][]"] = selectedStatuses;
    }
    if (selectedManagers.length > 0) {
      newFilters["q[owner_id_in][]"] = selectedManagers;
    }
    if (selectedTypes.length > 0) {
      newFilters["q[project_type_id_in][]"] = selectedTypes;
    }
    if (dates.startDate) {
      newFilters["q[start_date_eq]"] = dates.startDate;
    }
    if (dates.endDate) {
      newFilters["q[end_date_eq]"] = dates.endDate;
    }

    // Convert to query string format
    const queryParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => queryParams.append(key, v));
      } else {
        queryParams.set(key, value);
      }
    });

    try {
      await dispatch(
        filterProjects({ token, baseUrl, filters: queryParams.toString() })
      ).unwrap();
      onApplyFilters?.();
      closeModal();
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={closeModal}
        />
      )}

      {/* Modal */}
      <div
        ref={modalRef}
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-sm bg-white shadow-xl flex flex-col transition-transform duration-300 ease-out ${isModalOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h2 className="text-xl font-semibold">Filter</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-red-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Filter search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
            />
          </div>
        </div>

        {/* Filter Options */}
        <div className="flex-1 overflow-y-auto divide-y">
          {/* Status Filter */}
          <div className="p-6 py-3">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleDropdown("status")}
            >
              <span className="font-medium text-sm select-none">Status</span>
              {dropdowns.status ? (
                <ChevronDown className="text-gray-400 w-4 h-4" />
              ) : (
                <ChevronRight className="text-gray-400 w-4 h-4" />
              )}
            </div>
            {dropdowns.status && (
              <div className="mt-4 border animate-in fade-in duration-200">
                <div className="relative border-b">
                  <Search className="absolute left-3 top-2.5 text-red-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Filter status..."
                    className="w-full pl-8 pr-4 py-2 text-sm border-0 focus:outline-none"
                    value={statusSearch}
                    onChange={(e) => setStatusSearch(e.target.value)}
                  />
                </div>
                {renderCheckboxList(
                  statusOptions,
                  selectedStatuses,
                  setSelectedStatuses,
                  statusSearch
                )}
              </div>
            )}
          </div>

          {/* Date Filters */}
          {["startDate", "endDate"].map((key) => {
            const dateKey = key as "startDate" | "endDate";
            const label = key === "startDate" ? "Start Date" : "End Date";
            return (
              <div key={key} className="p-6 py-3">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleDropdown(key as any)}
                >
                  <span className="font-medium text-sm select-none">
                    {label}
                  </span>
                  {dropdowns[key as any] ? (
                    <ChevronDown className="text-gray-400 w-4 h-4" />
                  ) : (
                    <ChevronRight className="text-gray-400 w-4 h-4" />
                  )}
                </div>
                {dropdowns[key as any] && (
                  <div className="mt-4 px-1 animate-in fade-in duration-200">
                    <input
                      type="date"
                      value={dates[dateKey] || ""}
                      onChange={(e) =>
                        setDates((prev) => ({
                          ...prev,
                          [dateKey]: e.target.value,
                        }))
                      }
                      className="w-full p-2 border rounded text-sm"
                      autoFocus
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-center items-center gap-4 px-6 py-3 border-t">
          <button
            className="bg-[#C62828] text-white rounded px-10 py-2 text-sm font-semibold hover:bg-[#b71c1c] transition-colors duration-200"
            onClick={handleApplyFilters}
          >
            Apply
          </button>
          <button
            className="border border-[#C62828] text-[#C62828] rounded px-10 py-2 text-sm font-semibold hover:bg-red-50 transition-colors duration-200"
            onClick={clearAll}
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
};
