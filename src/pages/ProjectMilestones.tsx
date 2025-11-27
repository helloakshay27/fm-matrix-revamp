import { Button } from '@/components/ui/button'
import MilestoneBody from '../components/MilestoneBody'
import { ChartNoAxesColumn, ChevronDown, List, Plus } from 'lucide-react'
import AddMilestoneModal from '@/components/AddMilestoneModal'
import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { fetchFMUsers } from '@/store/slices/fmUserSlice'
import { toast } from 'sonner'

const ProjectMilestones = () => {
    const dispatch = useAppDispatch();

    const [selectedView, setSelectedView] = useState("List");
    const [isOpen, setIsOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false)
    const [owners, setOwners] = useState([])

    const getOwners = async () => {
        try {
            const response = await dispatch(fetchFMUsers()).unwrap();
            setOwners(response.users);
        } catch (error) {
            console.log(error)
            toast.error(error)
        }
    }

    useEffect(() => {
        getOwners()
    }, [])

    return (
        <div className='py-6 relative'>
            <div className='flex items-center justify-between p-4 absolute'>
                <Button
                    className="bg-[#C72030] hover:bg-[#A01020] text-white"
                    onClick={() => setOpenDialog(true)}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Milestone
                </Button>
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
                    >
                        <span className="text-[#C72030] font-medium flex items-center gap-2">
                            {selectedView === "Kanban" ? (
                                <ChartNoAxesColumn className="w-4 h-4 rotate-180 text-[#C72030]" />
                            ) : (
                                <List className="w-4 h-4 text-[#C72030]" />
                            )}
                            {selectedView}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                    </button>

                    {isOpen && (
                        <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
                            <div className="py-2">
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