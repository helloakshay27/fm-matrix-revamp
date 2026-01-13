import { Button } from '@/components/ui/button'
import MilestoneBody from '../components/MilestoneBody'
import { ArrowLeft, ChartNoAxesColumn, ChartNoAxesGantt, ChevronDown, List, Plus } from 'lucide-react'
import AddMilestoneModal from '@/components/AddMilestoneModal'
import { useEffect, useState, useRef } from 'react'
import { useAppDispatch } from '@/store/hooks'
import MilestoneList from '@/components/MilestoneList'
import MilestoneKanban from '@/components/MilestoneKanban'
import { useLayout } from '@/contexts/LayoutContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const ProjectMilestones = () => {
    const { setCurrentSection } = useLayout();

    const view = localStorage.getItem("selectedView");

    useEffect(() => {
        setCurrentSection(view === "admin" ? "Value Added Services" : "Project Task");
    }, [setCurrentSection]);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [selectedView, setSelectedView] = useState<"Kanban" | "Gantt" | "List">("List");
    const [isOpen, setIsOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false)
    const [owners, setOwners] = useState([])
    const dropdownRef = useRef<HTMLDivElement>(null)

    const getOwners = async () => {
        try {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const response = await axios.get(`https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setOwners(response.data.users || []);
        } catch (error) {
            console.log('Error fetching mention users:', error);
        }
    }

    useEffect(() => {
        getOwners()
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen])

    if (selectedView === "List") {
        return (
            <div className='py-6'>
                <MilestoneList selectedView={selectedView} setSelectedView={setSelectedView} setOpenDialog={setOpenDialog} />

                <AddMilestoneModal
                    openDialog={openDialog}
                    handleCloseDialog={() => setOpenDialog(false)}
                    owners={owners}
                />
            </div>
        )
    } else if (selectedView === "Kanban") {
        return (
            <div className='py-2'>
                <div className='flex items-center justify-between p-4'>
                    <Button
                        className="bg-[#C72030] hover:bg-[#A01020] text-white"
                        onClick={() => setOpenDialog(true)}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                    </Button>
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
                        >
                            <span className="text-[#C72030] font-medium flex items-center gap-2">
                                <ChartNoAxesColumn className="w-4 h-4 rotate-180 text-[#C72030]" />
                                {selectedView}
                            </span>
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                        </button>

                        {isOpen && (
                            <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
                                <div className="py-2">
                                    <button
                                        onClick={() => {
                                            setSelectedView("Gantt");
                                            setIsOpen(false);
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50"
                                    >
                                        <div className="w-4 flex justify-center">
                                            <ChartNoAxesGantt className="rotate-180 text-[#C72030]" />
                                        </div>
                                        <span className="text-gray-700">Gantt</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedView("Kanban");
                                            setIsOpen(false);
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50"
                                    >
                                        <div className="w-4 flex justify-center">
                                            <ChartNoAxesColumn className="rotate-180 text-[#C72030]" />
                                        </div>
                                        <span className="text-gray-700">Kanban</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setSelectedView("List");
                                            setIsOpen(false);
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50"
                                    >
                                        <div className="w-4 flex justify-center">
                                            <List className="w-4 h-4 text-[#C72030]" />
                                        </div>
                                        <span className="text-gray-700">List</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <MilestoneKanban />

                <AddMilestoneModal
                    openDialog={openDialog}
                    handleCloseDialog={() => setOpenDialog(false)}
                    owners={owners}
                />
            </div>
        )
    }

    return (
        <div className='py-2'>
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>
            <div className='flex items-center justify-between p-4'>
                <Button
                    className="bg-[#C72030] hover:bg-[#A01020] text-white"
                    onClick={() => setOpenDialog(true)}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                </Button>
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
                    >
                        <span className="text-[#C72030] font-medium flex items-center gap-2">
                            <ChartNoAxesGantt className="w-4 h-4 rotate-180 text-[#C72030]" />
                            {selectedView}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                    </button>

                    {isOpen && (
                        <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
                            <div className="py-2">
                                <button
                                    onClick={() => {
                                        setSelectedView("Gantt");
                                        setIsOpen(false);
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50"
                                >
                                    <div className="w-4 flex justify-center">
                                        <ChartNoAxesGantt className="rotate-180 text-[#C72030]" />
                                    </div>
                                    <span className="text-gray-700">Gantt</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedView("Kanban");
                                        setIsOpen(false);
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50"
                                >
                                    <div className="w-4 flex justify-center">
                                        <ChartNoAxesColumn className="rotate-180 text-[#C72030]" />
                                    </div>
                                    <span className="text-gray-700">Kanban</span>
                                </button>

                                <button
                                    onClick={() => {
                                        setSelectedView("List");
                                        setIsOpen(false);
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50"
                                >
                                    <div className="w-4 flex justify-center">
                                        <List className="w-4 h-4 text-[#C72030]" />
                                    </div>
                                    <span className="text-gray-700">List</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <MilestoneBody />

            <AddMilestoneModal
                openDialog={openDialog}
                handleCloseDialog={() => setOpenDialog(false)}
                owners={owners}
            />
        </div>
    )
}

export default ProjectMilestones