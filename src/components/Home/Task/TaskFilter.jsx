import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { X, Search, ChevronRight, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { set } from "react-hook-form";
import {fetchUsers} from "../../../redux/slices/userSlice"
import { useSelector , useDispatch} from "react-redux";


const statusOptions = [
    { label: "Active", color: "bg-green-500" },
    { label: "Inactive", color: "bg-pink-600" },
    { label: "On track", color: "bg-yellow-500" },
    { label: "Delayed", color: "bg-black" },
    { label: "On Hold", color: "bg-cyan-400" },
];


const projectTypeOptions = ["Design", "Development", "Marketing"];
const projectManagerOptions = ["Anuj", "Anagha", "Tara"];
const createdByOptions = ["Admin", "User", "System"];

const TaskFilter = ({ isModalOpen, setIsModalOpen }) => {
    const modalRef = useRef(null);

    // Selected options
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [selectedResponsible, setSelectedResponsible] = useState([]);
    // const [selectedManagers, setSelectedManagers] = useState([]);
    const [selectedCreators, setSelectedCreators] = useState([]);
    const [dates, setDates] = useState({ "Start date": "", "End date": "" });
    const [responsiblePersonOptions,setResponsiblePersonOptions]=useState([]);

    // Dropdown open/close state (only one open at a time)
    const [dropdowns, setDropdowns] = useState({
        status: false,
        ResponsiblePerson: false,
        startDate: false,
        endDate: false,
        creator: false,
    });
    const dispatch=useDispatch();

    
const {
    fetchUsers:users,
    loading,
    error,
}=useSelector(state=>state.fetchUsers)

    // Search inputs inside dropdowns
    const [statusSearch, setStatusSearch] = useState("");
    const [ResponsiblePersonSearch, setResponsiblePersonSearch] = useState("");
    const [creatorSearch, setCreatorSearch] = useState("");


    useEffect(() => {
        try{
            if(users.length===0)
            dispatch(fetchUsers());
          
        }catch(error){
            console.log(error);
        }finally{
            setResponsiblePersonOptions(users.map((user) => ( user.firstname+ " " +user.lastname )));
        }
    },[dispatch,users])

    const toggleDropdown = (key) => {
        setDropdowns((prev) => {
            const isAlreadyOpen = prev[key];
            if (isAlreadyOpen) {
                return { ...prev, [key]: false };
            }
            return {
                status: false,
                ResponsiblePerson: false,
                creator: false,
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

    // Close modal animation
    const closeModal = () => {
        gsap.to(modalRef.current, {
            x: "100%",
            duration: 0.4,
            ease: "power3.in",
            onComplete: () => setIsModalOpen(false),
        });
    };

    // Open modal animation
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
        console.log(options);

        return (
            <div className="max-h-40 overflow-y-auto p-2">
                {filtered.map((option) => {
                    const label = typeof option === "string" ? option : option.label;
                    const color = typeof option === "string" ? null : option.color;

                    return (
                        <label
                            key={label}
                            className="flex items-center justify-between py-2 px-2 text-sm cursor-pointer hover:bg-gray-50 rounded"
                        >
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={selected.includes(label)}
                                    onChange={() => toggleOption(label, selected, setSelected)}
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
        setSelectedResponsible([]);
        setSelectedCreators([]);
        setStatusSearch("");
        setResponsiblePersonSearch("");
        setCreatorSearch("");
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

                    {/* Project Type */}
                    <div className="p-6 py-3">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleDropdown("ResponsiblePerson")}
                        >
                            <span className="font-medium text-sm select-none">Responsible Person</span>
                            {dropdowns.ResponsiblePerson ? (
                                <ChevronDown className="text-gray-400" />
                            ) : (
                                <ChevronRight className="text-gray-400" />
                            )}
                        </div>
                        {dropdowns.ResponsiblePerson && (
                            <div className="mt-4 border">
                                <div className="relative border-b">
                                    <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Filter project type..."
                                        className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                        value={ResponsiblePersonSearch}
                                        onChange={(e) => setResponsiblePersonSearch(e.target.value)}
                                    />
                                </div>
                                {renderCheckboxList(responsiblePersonOptions, selectedResponsible, setSelectedResponsible, ResponsiblePersonSearch)}
                            </div>
                        )}
                    </div>

                    {/* Project Manager */}
                    {/* <div className="p-6 py-3">
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
                                {renderCheckboxList(projectManagerOptions, selectedManagers, setSelectedManagers, managerSearch)}
                            </div>
                        )}
                    </div> */}

                    {["startDate", "endDate"].map((key) => {
                        const label = key === "startDate" ? "Start Date" : "End Date";
                        return (
                            <div key={key} className="p-6 py-3">
                                <div
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => toggleDropdown(key)}
                                >
                                    <span className="font-medium text-sm select-none">
                                        {label}
                                    </span>


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

                <div className="flex justify-center items-center gap-4 px-6 py-3 border-t">
                    <button
                        className="bg-[#C62828] text-white rounded px-10 py-2 text-sm font-semibold hover:bg-[#b71c1c]"
                        onClick={clearAll}
                    >
                        Apply
                    </button>
                    <button
                        className="border border-[#C62828] text-[#C62828] rounded px-10 py-2 text-sm font-semibold hover:bg-red-50"
                        onClick={() => {
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

export default TaskFilter;
