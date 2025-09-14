import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getMoMPaths, useIsCloudRoute } from "../../utils/navigationUtils";
import { momTabs } from "../../data/Data";
import { useDispatch, useSelector } from "react-redux";
import { fetchMoM } from "../../redux/slices/momSlice";

const getRandomColor = () => {
    const r = Math.floor(Math.random() * 76) + 180;
    const g = Math.floor(Math.random() * 76) + 180;
    const b = Math.floor(Math.random() * 76) + 180;
    return `#${r.toString(16).padStart(2, "0")}${g
        .toString(16)
        .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

const MinutesOfMeeting = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isCloudRoute = useIsCloudRoute();

    const { fetchMoM: mom } = useSelector((state) => state.fetchMoM);

    const [activeTab, setActiveTab] = useState(momTabs[0].id);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10; // Number of items per page

    useEffect(() => {
        dispatch(fetchMoM({ token }));
    }, [dispatch]);

    const tabRefs = useRef({});
    const underlineRef = useRef(null);

    useGSAP(() => {
        if (tabRefs.current[activeTab] && underlineRef.current) {
            const tab = tabRefs.current[activeTab];
            const { offsetLeft, offsetWidth } = tab;

            gsap.to(underlineRef.current, {
                left: offsetLeft,
                width: offsetWidth,
                duration: 0.3,
                ease: "power2.out",
            });
        }
    }, [activeTab]);

    // Pagination logic
    const totalItems = mom?.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = mom && [...mom].reverse().slice(startIndex, endIndex);

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    // Generate page numbers to display
    const visiblePages = 3;
    let startPage = Math.max(0, currentPage - Math.floor(visiblePages / 2));
    let endPage = startPage + visiblePages;

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(0, endPage - visiblePages);
    }

    const pageNumbers = Array.from(
        { length: endPage - startPage },
        (_, i) => startPage + i
    );

    const handleAdd = () => {
        navigate(getMoMPaths("", isCloudRoute).newMom);
    }

    return (
        <>
            <div className="relative flex items-center mx-6 mt-3 mb-0 gap-10 text-sm">
                {momTabs.map((tab) => (
                    <div
                        key={tab.id}
                        ref={(el) => (tabRefs.current[tab.id] = el)}
                        className={`relative cursor-pointer text-[12px] pb-3 ${activeTab === tab.id ? "text-[#C72030]" : "text-gray-600"
                            }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </div>
                ))}
                <div
                    ref={underlineRef}
                    className="absolute bottom-0 h-[2px] bg-[#C72030]"
                />
            </div>

            <hr className="border border-gray-200" />

            <div className="flex items-center justify-end mx-8 my-5 text-sm">
                <button
                    className="text-[12px] flex items-center justify-center gap-2 bg-red text-white px-3 py-2 w-40"
                    onClick={handleAdd}
                >
                    <Plus size={18} /> New MoM
                </button>
            </div>

            <div className="text-[14px] font-light mx-8">
                <div className="overflow-x-auto rounded-md border border-gray-300">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="px-4 py-4">MoM id</th>
                                <th className="px-4 py-4 w-[25%]">Meeting Title</th>
                                <th className="px-4 py-4">Date Of Meeting</th>
                                <th className="px-4 py-4 w-[15%]">Organizer</th>
                                <th className="px-4 py-4">Meeting Mode</th>
                                <th className="px-4 py-4">Participants</th>
                                <th className="px-4 py-4">Agenda Items</th>
                                <th className="px-4 py-4">Action Items</th>
                                <th className="px-4 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems?.length > 0 ? (
                                currentItems.map((item) => (
                                    <tr key={item.id}>
                                        <td className="p-4">{item.id}</td>
                                        <td className="p-4">
                                            <Link to={getMoMPaths(item.id, isCloudRoute).mom} className="hover:underline">
                                                {item.title}
                                            </Link>
                                        </td>
                                        <td className="p-4" style={{ padding: "1rem" }}>{item.meeting_date?.split("T")[0]}</td>
                                        <td className="p-4">John Doe</td>
                                        <td className="p-4">{item.meeting_mode}</td>
                                        <td className="p-4">
                                            <div className="flex items-center">
                                                {item.mom_attendees?.map((member, index) => (
                                                    <div
                                                        key={index}
                                                        title={member.name}
                                                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-gray-800 cursor-pointer ${index !== 0 ? "-ml-[6px]" : ""
                                                            }`}
                                                        style={{ backgroundColor: getRandomColor() }}
                                                    >
                                                        {member.name ? member.name.charAt(0) : ""}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4">Meeting 1</td>
                                        <td className="p-4">Meeting 1</td>
                                        <td className="p-4">
                                            <div className="flex gap-2 items-center">
                                                <Link
                                                    to={getMoMPaths(item.id, isCloudRoute).mom}
                                                    className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border border-blue-600 rounded hover:bg-blue-50"
                                                >
                                                    View
                                                </Link>
                                                {/* <Link
                                                    to={`${getMoMPaths(item.id, isCloudRoute).mom}?edit=true`}
                                                    className="text-green-600 hover:text-green-800 text-xs px-2 py-1 border border-green-600 rounded hover:bg-green-50"
                                                >
                                                    Edit
                                                </Link> */}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center py-6 text-gray-500">
                                        No meetings
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </div>

            {mom?.length > 0 && (
                <div className="flex items-center justify-start gap-4 mt-4 mx-8 text-[12px]">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 0}
                        className="text-red-600 disabled:opacity-30"
                    >
                        {"<"}
                    </button>

                    {pageNumbers.map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageClick(page)}
                            className={`px-3 py-1 ${page === currentPage ? "bg-gray-200 font-bold" : ""
                                }`}
                        >
                            {page + 1}
                        </button>
                    ))}

                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages - 1}
                        className="text-red-600 disabled:opacity-30"
                    >
                        {">"}
                    </button>
                </div>
            )}
        </>
    );
};

export default MinutesOfMeeting;