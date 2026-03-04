import { X, Search, ChevronRight, ChevronDown } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import clsx from "clsx";

interface TodoFilterModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    onApplyFilters: (filters: TodoFilters) => void;
    users?: Array<{ id: number | string; full_name: string; name?: string }>;
}

export interface TodoFilters {
    fromDate: string;
    toDate: string;
    selectedPriorities: string[];
    selectedCreators: string[];
    creatorSearch: string;
}

const PRIORITY_OPTIONS = [
    { label: "P1 - Urgent & Important", value: "P1", color: "bg-red-500" },
    { label: "P2 - Important, Not Urgent", value: "P2", color: "bg-green-500" },
    { label: "P3 - Urgent, Not Important", value: "P3", color: "bg-yellow-500" },
    { label: "P4 - Not Urgent or Important", value: "P4", color: "bg-blue-500" },
];

const TodoFilterModal = ({
    isModalOpen,
    setIsModalOpen,
    onApplyFilters,
    users = [],
}: TodoFilterModalProps) => {
    const modalRef = useRef(null);

    const getInitialFilters = (): TodoFilters => {
        try {
            const saved = localStorage.getItem("todoFilters");
            return saved
                ? JSON.parse(saved)
                : {
                    fromDate: "",
                    toDate: "",
                    selectedPriorities: [],
                    selectedCreators: [],
                    creatorSearch: "",
                };
        } catch (error) {
            console.error("Error parsing todoFilters from localStorage:", error);
            return {
                fromDate: "",
                toDate: "",
                selectedPriorities: [],
                selectedCreators: [],
                creatorSearch: "",
            };
        }
    };

    const [fromDate, setFromDate] = useState(getInitialFilters().fromDate);
    const [toDate, setToDate] = useState(getInitialFilters().toDate);
    const [selectedPriorities, setSelectedPriorities] = useState(
        getInitialFilters().selectedPriorities
    );
    const [selectedCreators, setSelectedCreators] = useState(
        getInitialFilters().selectedCreators
    );
    const [creatorSearch, setCreatorSearch] = useState(
        getInitialFilters().creatorSearch
    );

    const userOptions = users.map((user: any) => ({
        label: user.full_name || user.name || "Unknown",
        value: user.id,
    }));

    // Save filters to localStorage
    useEffect(() => {
        const filters: TodoFilters = {
            fromDate,
            toDate,
            selectedPriorities,
            selectedCreators,
            creatorSearch,
        };
        if (
            selectedPriorities.length > 0 ||
            selectedCreators.length > 0 ||
            fromDate ||
            toDate ||
            creatorSearch
        ) {
            localStorage.setItem("todoFilters", JSON.stringify(filters));
        }
    }, [fromDate, toDate, selectedPriorities, selectedCreators, creatorSearch]);

    // Dropdown open/close state
    const [dropdowns, setDropdowns] = useState({
        priority: false,
        createdBy: false,
        fromDate: false,
        toDate: false,
    });

    const toggleDropdown = (key: string) => {
        setDropdowns((prev) => {
            const isAlreadyOpen = prev[key as keyof typeof prev];
            if (isAlreadyOpen) {
                return { ...prev, [key]: false };
            }
            return {
                priority: false,
                createdBy: false,
                fromDate: false,
                toDate: false,
                [key]: true,
            };
        });
    };

    // Toggle checkbox option selection
    const toggleOption = (
        value: string,
        selected: string[],
        setSelected: (selected: string[]) => void
    ) => {
        if (selected.includes(value)) {
            setSelected(selected.filter((v) => v !== value));
        } else {
            setSelected([...selected, value]);
        }
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Render checkbox list with search filtering
    const renderCheckboxList = (
        options: any[],
        selected: string[],
        setSelected: (selected: string[]) => void,
        searchTerm: string = ""
    ) => {
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
                            {/* {color && (
                                <span className={clsx("w-2 h-2 rounded-full", color)}></span>
                            )} */}
                        </label>
                    );
                })}
                {filtered.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-2">
                        No results found
                    </div>
                )}
            </div>
        );
    };

    // Clear all selections and reset to initial data
    const clearAll = () => {
        setFromDate("");
        setToDate("");
        setSelectedPriorities([]);
        setSelectedCreators([]);
        setCreatorSearch("");
        localStorage.removeItem("todoFilters");

        onApplyFilters({
            fromDate: "",
            toDate: "",
            selectedPriorities: [],
            selectedCreators: [],
            creatorSearch: "",
        });
    };

    // Apply filters and dispatch API call
    const handleApplyFilters = () => {
        const filters: TodoFilters = {
            fromDate,
            toDate,
            selectedPriorities,
            selectedCreators,
            creatorSearch,
        };
        onApplyFilters(filters);
        closeModal();
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
                    <h2 className="text-xl font-semibold">Filter Todos</h2>
                    <X className="cursor-pointer" onClick={closeModal} />
                </div>

                <div className="flex-1 overflow-y-auto divide-y">
                    {/* Date Range - From Date */}
                    <div className="p-6 py-3">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleDropdown("fromDate")}
                        >
                            <span className="font-medium text-sm select-none">From Date</span>
                            {dropdowns.fromDate ? (
                                <ChevronDown className="text-gray-400" />
                            ) : (
                                <ChevronRight className="text-gray-400" />
                            )}
                        </div>
                        {dropdowns.fromDate && (
                            <div className="mt-4 px-1">
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="w-full p-2 border rounded text-sm"
                                    autoFocus
                                />
                            </div>
                        )}
                    </div>

                    {/* Date Range - To Date */}
                    <div className="p-6 py-3">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleDropdown("toDate")}
                        >
                            <span className="font-medium text-sm select-none">To Date</span>
                            {dropdowns.toDate ? (
                                <ChevronDown className="text-gray-400" />
                            ) : (
                                <ChevronRight className="text-gray-400" />
                            )}
                        </div>
                        {dropdowns.toDate && (
                            <div className="mt-4 px-1">
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="w-full p-2 border rounded text-sm"
                                    autoFocus
                                />
                            </div>
                        )}
                    </div>

                    {/* Priority Filter */}
                    <div className="p-6 py-3">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleDropdown("priority")}
                        >
                            <span className="font-medium text-sm select-none">Priority</span>
                            {dropdowns.priority ? (
                                <ChevronDown className="text-gray-400" />
                            ) : (
                                <ChevronRight className="text-gray-400" />
                            )}
                        </div>
                        {dropdowns.priority && (
                            <div className="mt-4 border">
                                {renderCheckboxList(
                                    PRIORITY_OPTIONS,
                                    selectedPriorities,
                                    setSelectedPriorities
                                )}
                            </div>
                        )}
                    </div>

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
                                    <Search
                                        className="absolute left-3 top-2.5 text-red-400"
                                        size={16}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Filter by creator..."
                                        className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                        value={creatorSearch}
                                        onChange={(e) => setCreatorSearch(e.target.value)}
                                    />
                                </div>
                                {renderCheckboxList(
                                    userOptions,
                                    selectedCreators,
                                    setSelectedCreators,
                                    creatorSearch
                                )}
                            </div>
                        )}
                    </div>
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

export default TodoFilterModal;
