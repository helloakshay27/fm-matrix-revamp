import { Dialog, DialogContent, DialogTitle, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { useAppDispatch } from "@/store/hooks";
import { createProjectTypes, updateProjectTypes } from "@/store/slices/projectTypeSlice";
import { toast } from "sonner";

const ProjectTypeModal = ({ openDialog, handleCloseDialog, isEditing, record, fetchData }) => {
    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token")
    const baseUrl = localStorage.getItem("baseUrl")

    const [type, setType] = useState("")

    useEffect(() => {
        if (isEditing && record) {
            setType(record.name)
        }
    }, [isEditing, record])

    const handleSubmit = async () => {
        if (type === "") {
            toast.error("Project Type name is required")
            return
        }
        if (!isEditing) {
            try {
                const payload = {
                    name: type,
                    created_by_id: JSON.parse(localStorage.getItem("user"))?.id || "",
                    active: true,
                }

                await dispatch(createProjectTypes({ baseUrl, token, data: payload })).unwrap();
                toast.success('Project Type created successfully');
                fetchData();
                handleCloseDialog();
            } catch (error) {
                console.log(error)
                toast.error(error)
            }
        } else {
            try {
                const payload = {
                    name: type,
                    updated_by_id: JSON.parse(localStorage.getItem("user"))?.id || "",
                }
                await dispatch(updateProjectTypes({ baseUrl, token, data: payload, id: record.id })).unwrap();
                toast.success('Project Type updated successfully');
                fetchData();
                handleCloseDialog();
            } catch (error) {
                console.log(error)
                toast.error(error)
            }
        }
    }

    const handleClose = () => {
        handleCloseDialog()
        setType("")
    }

    return (
        <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add Project Type</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="type"
                    label="New Project Type"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                    InputLabelProps={{ style: { color: '#000000' } }}
                    InputProps={{
                        style: { backgroundColor: '#fff', borderRadius: '4px' },
                    }}
                />
            </DialogContent>

            <div className="flex justify-center gap-3 mb-4">
                <Button
                    variant="outline"
                    onClick={handleClose}
                    className="px-6"
                >
                    Cancel
                </Button>
                <Button
                    className="bg-green-500 hover:bg-green-600 text-white px-6"
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </div>
        </Dialog>
    )
}

export default ProjectTypeModal