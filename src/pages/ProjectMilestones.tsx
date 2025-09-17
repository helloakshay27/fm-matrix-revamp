import { Button } from '@/components/ui/button'
import MilestoneBody from '../components/MilestoneBody'
import { Plus } from 'lucide-react'
import AddMilestoneModal from '@/components/AddMilestoneModal'
import { useState } from 'react'

const ProjectMilestones = () => {
    const [openDialog, setOpenDialog] = useState(false)

    return (
        <div className='py-6'>
            <div className='flex items-center justify-end p-4'>
                <Button
                    className="bg-[#C72030] hover:bg-[#A01020] text-white"
                    onClick={() => setOpenDialog(true)}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Milestone
                </Button>
            </div>
            <MilestoneBody />

            <AddMilestoneModal
                openDialog={openDialog}
                handleCloseDialog={() => setOpenDialog(false)}
                handleSubmit={() => { }}
            />
        </div>
    )
}

export default ProjectMilestones