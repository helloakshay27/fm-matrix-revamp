import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
    const [openDropdown, setOpenDropdown] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Lockated");

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const dropdownOptions = ["Lockated", "Sai Radhe", "Vodafone", "URBNWRK"];

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setOpenDropdown(false);
    };

    return (
        <div className="w-screen shadow-md h-[58px]">
            <div className="flex items-center justify-between py-3 px-5">
                <div className="flex items-center gap-10 w-1/2">
                    <Link to="/">
                        <img
                            src="/logo.webp"
                            alt="Lockated"
                            className="w-[159px] h-[35px]"
                        />
                    </Link>
                    <div className="flex items-center">
                        <NavLink
                            to="/projects"
                            className={({ isActive }) =>
                                `px-6 py-2 text-[12px] ${isActive ? "bg-red text-white" : "text-gray-700"
                                }`
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                `px-6 py-2 text-[12px] ${isActive ? "bg-red text-white" : "text-gray-700"
                                }`
                            }
                        >
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="/setup"
                            className={({ isActive }) =>
                                `px-6 py-2 text-[12px] ${isActive ? "bg-red text-white" : "text-gray-700"
                                }`
                            }
                        >
                            Setup
                        </NavLink>
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-6">
                        <div className="relative" ref={dropdownRef}>
                            <div
                                className="flex items-center gap-1 cursor-pointer px-2 py-1"
                                onClick={() => setOpenDropdown(!openDropdown)}
                                role="button"
                                aria-haspopup="true"
                                aria-expanded={openDropdown}
                                tabIndex={0}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && setOpenDropdown(!openDropdown)
                                }
                            >
                                <span className="text-[13px]">{selectedOption}</span> {/* Display selected option */}
                                <ChevronDown
                                    size={15}
                                    className={`${openDropdown ? "rotate-180" : ""
                                        } transition-transform`}
                                />
                            </div>
                            <ul
                                className={`dropdown-menu absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden ${openDropdown ? "block" : "hidden"}`}
                                role="menu"
                                style={{
                                    minWidth: "150px",
                                    maxHeight: "400px",
                                    overflowY: "auto",
                                    zIndex: 1000,
                                }}
                            >
                                {dropdownOptions.map((option, idx) => (
                                    <li key={idx} role="menuitem">
                                        <button
                                            className={`dropdown-item w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-100 ${selectedOption === option
                                                ? "bg-gray-100 font-semibold"
                                                : ""
                                                }`}
                                            onClick={() => handleOptionSelect(option)}
                                        >
                                            {option}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <span className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer">
                            A
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
