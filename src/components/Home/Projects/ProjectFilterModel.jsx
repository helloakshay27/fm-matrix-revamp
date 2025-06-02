/* eslint-disable react/jsx-key */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { X, Search, ChevronRight, ChevronDown } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../../redux/slices/userSlice";

// Define status options with user-friendly labels and colors, matching ProjectList format
const statusOptions = [
    { label: "Active", value: "Active", color: "bg-green-500" },
    { label: "Inactive", value: "Inactive", color: "bg-pink-600" },
    { label: "In Progress", value: "In_progress", color: "bg-cyan-400" },
    { label: "Overdue", value: "Overdue", color: "bg-red-500" },
    { label: "Completed", value: "Completed", color: "bg-black" },
    { label: "On Hold", value: "On_hold", color: "bg-yellow-500" },
    { label: "Abort", value: "Abort", color: "bg-gray-500" },
];

const projectTypeOptions = ["Design", "Development", "Marketing"];
const createdByOptions = ["Admin", "User", "System"];

const ProjectFilterModal = ({ isModalOpen, setIsModalOpen, onApplyFilters, filters }) => {
    const dispatch = useDispatch();
    const { fetchUsers: users, error: fetchUsersError } = useSelector((state) => state.fetchUsers);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    // Extract firstname values with unique identifiers
    const firstNames = users && users.length > 0
        ? users.map((user, index) => ({
            label: user.firstname,
            value: user.id || `${user.firstname}-${index}`,
        }))
        : [];

    const modalRef = useRef(null);

    // Initialize state with filters prop
    const [selectedStatuses, setSelectedStatuses] = useState(filters?.statuses || []);
    const [selectedTypes, setSelectedTypes] = useState(filters?.types || []);
    const [selectedManagers, setSelectedManagers] = useState(filters?.managers || []);
    const [selectedCreators, setSelectedCreators] = useState(filters?.creators || []);
    const [dates, setDates] = useState({
        "Start date": filters?.startDate || "",
        "End date": filters?.endDate || "",
    });

    // Update state when filters prop changes
    useEffect(() => {
        setSelectedStatuses(filters?.statuses || []);
        setSelectedTypes(filters?.types || []);
        setSelectedManagers(filters?.managers || []);
        setSelectedCreators(filters?.creators || []);
        setDates({
            "Start date": filters?.startDate || "",
            "End date": filters?.endDate || "",
        });
    }, [filters]);

    // Dropdown open/close state (only one open at a time)
    const [dropdowns, setDropdowns] = useState({
        status: false,
        projectType: false,
        projectManager: false,
        createdBy: false,
        startDate: false,
        endDate: false,
    });

    // Search inputs for dropdowns
    const [statusSearch, setStatusSearch] = useState("");
    const [typeSearch, setTypeSearch] = useState("");
    const [managerSearch, setManagerSearch] = useState("");
    const [creatorSearch, setCreatorSearch] = useState("");

    // Toggle dropdown (only one open at a time)
    const toggleDropdown = (key) => {
        setDropdowns((prev) => {
            const isAlreadyOpen = prev[key];
            if (isAlreadyOpen) {
                return { ...prev, [key]: false };
            }
            return {
                status: false,
                projectType: false,
                projectManager: false,
                createdBy: false,
                startDate: false,
                endDate: false,
                [key]: true,
            };
        });
    };

    // Toggle checkbox option selection
    const toggleOption = (value, selected, setSelected) => {
        setSelected((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
    };

    // Close modal with animation
    const closeModal = () => {
        gsap.to(modalRef.current, {
            x: "100%",
            duration: 0.4,
            ease: "power3.in",
            onComplete: () => setIsModalOpen(false),
        });
    };

    // Open modal with animation
    useGSAP(() => {
        if (isModalOpen) {
            gsap.fromTo(
                modalRef.current,
                { x: "100%" },
                { x: "0%", duration: 0.4, ease: "power3.out" }
            );
        }
    }, [isModalOpen]);

    // Render checkbox list with search filtering
    const renderCheckboxList = (options, selected, setSelected, searchTerm = "") => {
        const filtered = options.filter((opt) =>
            typeof opt === "string"
                ? opt.toLowerCase().includes(searchTerm.toLowerCase())
                : opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div className="max-h-40 overflow-y-auto p-2">
                {filtered.map((option) => {
                    const label = typeof option === "string" ? option : option.label;
                    const value = typeof option === "string" ? option : option.value;
                    const color = typeof option === "string" ? null : option.color;

                    return (
                        <label
                            key={value}
                            className="flex items-center justify-between py-2 px-2 text-sm cursor-pointer hover:bg-gray-50 rounded"
                        >
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={selected.includes(value)}
                                    onChange={() => toggleOption(value, selected, setSelected)}
                                />
                                <span>{label}</span>
                            </div>
                            {color && <span className={clsx("w-2 h-2 rounded-full", color)}></span>}
                        </label>
                    );
                })}
                {filtered.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-2">No results found</div>
                )}
            </div>
        );
    };

    // Clear all selections and search inputs
    const clearAll = () => {
        setSelectedStatuses([]);
        setSelectedTypes([]);
        setSelectedManagers([]);
        setSelectedCreators([]);
        setStatusSearch("");
        setTypeSearch("");
        setManagerSearch("");
        setCreatorSearch("");
        setDates({ "Start date": "", "End date": "" });
        onApplyFilters({});
    };

    // Apply filters and close modal
    const handleApplyFilters = () => {
        const newFilters = {
            statuses: selectedStatuses,
            types: selectedTypes,
            managers: selectedManagers.map((value) => {
                const manager = firstNames.find((m) => m.value === value);
                return manager ? manager.label : value; // Maps to firstname
            }),
            creators: selectedCreators,
            startDate: dates["Start date"],
            endDate: dates["End date"],
        };
        onApplyFilters(newFilters);
        closeModal();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-black bg-opacity-50">
            <div
                ref={modalRef}
                className="bg-white w-full max-w-sm h-full shadow-xl flex flex-col relative"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b">
                    <h2 className="text-xl font-semibold">Filter</h2>
                    <X className="cursor-pointer" onClick={closeModal} />
                </div>

                <div className="px-6 py-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-red-400" size={18} />
                        <input
                            type="text"
                            placeholder="Filter search..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto divide-y">
                    {/* Status Filter */}
                    <div className="p-6 py-3">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleDropdown("status")}
                        >
                            <span className="font-medium text-sm select-none">Status</span>
                            {dropdowns.status ? (
                                <ChevronDown className="text-gray-400" />
                            ) : (
                                <ChevronRight className="text-gray-400" />
                            )}
                        </div>
                        {dropdowns.status && (
                            <div className="mt-4 border">
                                <div className="relative border-b">
                                    <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Filter status..."
                                        className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                        value={statusSearch}
                                        onChange={(e) => setStatusSearch(e.target.value)}
                                    />
                                </div>
                                {renderCheckboxList(statusOptions, selectedStatuses, setSelectedStatuses, statusSearch)}
                            </div>
                        )}
                    </div>

                    {/* Project Type Filter */}
                    <div className="p-6 py-3">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleDropdown("projectType")}
                        >
                            <span className="font-medium text-sm select-none">Project Type</span>
                            {dropdowns.projectType ? (
                                <ChevronDown className="text-gray-400" />
                            ) : (
                                <ChevronRight className="text-gray-400" />
                            )}
                        </div>
                        {dropdowns.projectType && (
                            <div className="mt-4 border">
                                <div className="relative border-b">
                                    <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Filter project type..."
                                        className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                        value={typeSearch}
                                        onChange={(e) => setTypeSearch(e.target.value)}
                                    />
                                </div>
                                {renderCheckboxList(projectTypeOptions, selectedTypes, setSelectedTypes, typeSearch)}
                            </div>
                        )}
                    </div>

                    {/* Project Manager Filter */}
                    <div className="p-6 py-3">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleDropdown("projectManager")}
                        >
                            <span className="font-medium text-sm select-none">Project Manager</span>
                            {dropdowns.projectManager ? (
                                <ChevronDown className="text-gray-400" />
                            ) : (
                                <ChevronRight className="text-gray-400" />
                            )}
                        </div>
                        {dropdowns.projectManager && (
                            <div className="mt-4 border">
                                <div className="relative border-b">
                                    <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Filter project manager..."
                                        className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                        value={managerSearch}
                                        onChange={(e) => setManagerSearch(e.target.value)}
                                    />
                                </div>
                                {fetchUsersError ? (
                                    <div className="text-center text-red-500 text-sm py-2">
                                        Failed to load managers: {fetchUsersError}
                                    </div>
                                ) : (
                                    renderCheckboxList(firstNames, selectedManagers, setSelectedManagers, managerSearch)
                                )}
                            </div>
                        )}
                    </div>

                    {/* Date Filters */}
                    {["startDate", "endDate"].map((key) => {
                        const label = key === "startDate" ? "Start Date" : "End Date";
                        return (
                            <div key={key} className="p-6 py-3">
                                <div
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => toggleDropdown(key)}
                                >
                                    <span className="font-medium text-sm select-none">{label}</span>
                                    {dropdowns[key] ? (
                                        <ChevronDown className="text-gray-400" />
                                    ) : (
                                        <ChevronRight className="text-gray-400" />
                                    )}
                                </div>
                                {dropdowns[key] && (
                                    <div className="mt-4 px-1">
                                        <input
                                            type="date"
                                            value={dates[label]}
                                            onChange={(e) =>
                                                setDates((prev) => ({
                                                    ...prev,
                                                    [label]: e.target.value,
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

                    {/* Created By Filter */}
                    <div className="p-6 py-3">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleDropdown("createdBy")}
                        >
                            <span className="font-medium text-sm select-none">Created By</span>
                            {dropdowns.createdBy ? (
                                <ChevronDown className="text-gray-400" />
                            ) : (
                                <ChevronRight className="text-gray-400" />
                            )}
                        </div>
                        {dropdowns.createdBy && (
                            <div className="mt-4 border">
                                <div className="relative border-b">
                                    <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Filter created by..."
                                        className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                        value={creatorSearch}
                                        onChange={(e) => setCreatorSearch(e.target.value)}
                                    />
                                </div>
                                {renderCheckboxList(createdByOptions, selectedCreators, setSelectedCreators, creatorSearch)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer with Apply and Reset buttons */}
                <div className="flex justify-center items-center gap-4 px-6 py-3 border-t">
                    <button
                        className="bg-[#C62828] text-white rounded px-10 py-2 text-sm font-semibold hover:bg-[#b71c1c]"
                        onClick={handleApplyFilters}
                    >
                        Apply
                    </button>
                    <button
                        className="border border-[#C62828] text-[#C62828] rounded px-10 py-2 text-sm font-semibold hover:bg-red-50"
                        onClick={() => {
                            clearAll();
                            closeModal();
                        }}
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectFilterModal;