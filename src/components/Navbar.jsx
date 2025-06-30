import { useState, useEffect, useRef } from "react";
import { Bell, ChevronDown } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
    const [openDropdown, setOpenDropdown] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Lockated");
    const [notifications, setNotifications] = useState([
    ]);

    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setShowNotifications(false);
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



    // Dummy user data (replace with real user data as needed)
    const user = JSON.parse(localStorage.getItem("user"))

    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        // Add logout logic here (e.g., clear tokens, redirect, etc.)
        setShowLogoutModal(false);

        // Example: window.location.href = "/login";
        localStorage.removeItem("token");
        window.location.href = "/login";

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
                        <div className="relative" ref={notificationRef}>
                            <Bell
                                size={20}
                                className="cursor-pointer"
                                onClick={() => setShowNotifications(!showNotifications)}
                            />
                            {notifications.filter(n => !n.read).length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 rounded-full">
                                    {notifications.filter(n => !n.read).length}
                                </span>
                            )}

                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                    <div className="p-3 border-b text-sm font-semibold">Notifications</div>
                                    <ul className="max-h-72 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <li className="p-4 text-sm text-gray-500">No notifications</li>
                                        ) : (
                                            notifications.map((notif) => (
                                                <li
                                                    key={notif.id}
                                                    className={`p-3 text-sm hover:bg-gray-100 cursor-pointer ${notif.read ? "text-gray-500" : "text-black font-medium"
                                                        }`}
                                                    onClick={() => {
                                                        // Example handler: mark as read
                                                        setNotifications((prev) =>
                                                            prev.map((n) =>
                                                                n.id === notif.id ? { ...n, read: true } : n
                                                            )
                                                        );
                                                        setShowNotifications(false);
                                                    }}
                                                >
                                                    {notif.message}
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                        {/* <div className="relative" ref={dropdownRef}>
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
                                <span className="text-[13px]">{selectedOption}</span>
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
                        </div> */}
                        {/* User Profile Dropdown */}
                        <div className="relative">
                            <span
                                className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
                                onClick={() => setShowLogoutModal(true)}
                                title={`${user.firstname || ""} ${user.lasnName || ""}`}
                            >
                                {user.firstname ? user.firstname.charAt(0) : "U"}
                            </span>
                            {/* Enhanced Logout Modal */}
                            {showLogoutModal && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-all duration-300">
                                    <div className="bg-white rounded-xl shadow-2xl p-8 min-w-[340px] max-w-[90vw] animate-fadeIn relative">
                                        {/* Close button */}
                                        <button
                                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
                                            onClick={() => setShowLogoutModal(false)}
                                            aria-label="Close"
                                        >
                                            &times;
                                        </button>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600 border">
                                                {user.firstname ? user.firstname.charAt(0) : "U"}
                                            </div>
                                            <div>
                                                <div className="text-lg font-semibold">{user.firstname} {user.lastname}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2">
                                            <button
                                                className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200 border border-gray-200 transition"
                                                onClick={() => setShowLogoutModal(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 shadow transition"
                                                onClick={handleLogout}
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
