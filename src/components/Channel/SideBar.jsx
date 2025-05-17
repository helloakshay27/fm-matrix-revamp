import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';

const SideBar = () => {
    const [openSections, setOpenSections] = useState({
        dms: true,
        groups: true,

    });

    const toggleSection = (section) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    return (
        <div className="w-64 h-full border-r shadow-sm p-4 space-y-6">         
            <button className="bg-[#C72030] text-white w-full py-3 flex items-center justify-center rounded-sm font-normal hover:bg-red-800">
                <Plus size={12} className="mr-2 text-xs" />
                <span className="font-normal text-xs">New Chat</span>
            </button>
            <div className="space-y-4 text-sm">
                <div>
                    <div
                        className="flex items-center justify-between cursor-pointer hover:text-gray-600"
                    >
                        <span className="text-sm font-medium">Home</span>
                        <ChevronRight size={16} />
                    </div>
                </div>
                <div className="flex items-center justify-between cursor-pointer hover:text-gray-600">
                    <span className="text-sm font-medium">Starred</span>
                    <ChevronRight size={16} />
                </div>
                <div className='space-y-3'>
                    <div
                        onClick={() => toggleSection('dms')}
                        className="flex items-center justify-between cursor-pointer hover:text-gray-600"
                    >
                        <span className="text-sm font-medium">Direct Messages</span>
                        {openSections.dms ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                    {openSections.dms && (
                        <ul className="mt-2 space-y-4 text-gray-800 font-normal">
                            <li className="text-xs">Abdul Ghaffar</li>
                            <li className="text-xs">Sohail Ansari</li>
                            <li className="text-xs">Mahendra Lungare</li>
                            <li className="text-xs">Kshitij Rasal</li>
                        </ul>
                    )}
                </div>
                <div>
                    <div
                        onClick={() => toggleSection('groups')}
                        className="flex items-center justify-between cursor-pointer hover:text-gray-600"
                    >
                        <span className="text-sm font-medium">Groups</span>
                        {openSections.groups ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                    {openSections.groups && (
                        <ul className="mt-2 space-y-1 text-gray-800 font-normal">
                            <li className="text-xs">Project 1</li>
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SideBar;
