import { Button } from '@/components/ui/button'
import MilestoneBody from '../components/MilestoneBody'
import { Plus } from 'lucide-react'
import AddMilestoneModal from '@/components/AddMilestoneModal'
import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { fetchFMUsers } from '@/store/slices/fmUserSlice'
import { toast } from 'sonner'

const ProjectMilestones = () => {
    const dispatch = useAppDispatch();

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
                owners={owners}
            />
        </div>
    )
}

export default ProjectMilestones